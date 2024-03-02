chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {


  if (request.action === "requestVideoDetails") {
    const title = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent?.trim() || 'Unknown Title';
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || 'No Description';
    const videoUrl = window.location.href;
    const videoIdMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    // YouTube thumbnails can be accessed using the video ID
    let thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'Default thumbnail URL';
    console.log("this is the title, desc, url, thumbnail: ", title, description, videoUrl, thumbnailUrl);

    sendResponse({ title, description, videoUrl, thumbnailUrl });
    return true;
  }

  // Handle NFT minting request
  if (request.action === "mintNFT") {
      ethereum.request({ method: 'eth_requestAccounts' })
          .then(accounts => {
              const account = accounts[0]; // Use the first account to mint NFT

              // Assuming ethers is available in the window scope (e.g., via a script tag in popup.html)
              const signer = new ethers.providers.Web3Provider(ethereum).getSigner();
              const contract = new ethers.Contract(request.contractAddress, request.abi, signer);

              // Use the tokenUri passed from the popup
              contract.mintNFT(account, request.tokenUri)
                  .then((tx) => {
                      console.log('NFT Minted', tx);
                      sendResponse({ success: true, tx: tx });
                  })
                  .catch((error) => {
                      console.error('Error minting NFT', error);
                      sendResponse({ success: false, error: error.message });
                  });
          })
          .catch((error) => {
              console.log('Error fetching accounts', error);
              sendResponse({ success: false, error: error.message });
          });
      return true; // Indicates async response
  }
});
