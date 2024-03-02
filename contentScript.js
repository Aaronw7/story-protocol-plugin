const script = document.createElement('script');
script.src = chrome.runtime.getURL('./scripts/window.js');
(document.head || document.documentElement).appendChild(script);
script.onload = function() {
    this.remove();
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("this is the original request: ", request);
  console.log("this is document: ", document.head);

  if (request.action === "checkEthereum") {
    if (typeof window.ethereum === 'undefined') {
      console.log("Ethereum provider is available.");
      sendResponse({ ethereumAvailable: true });
    } else {
      console.log("Ethereum provider is not available.");
      sendResponse({ ethereumAvailable: false });
    }
  }

  if (request.action === "requestVideoDetails") {
    const title = document.querySelector('h1.ytd-video-primary-info-renderer')?.textContent?.trim() || 'Unknown Title';
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || 'No Description';
    const videoUrl = window.location.href;
    const videoIdMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    console.log("this is the title, desc, url, thumbnail: ", title, description, videoUrl, thumbnailUrl);

    sendResponse({ title, description, videoUrl, thumbnailUrl });
    return true;
  }

  if (request.action === "mintNFT") {
    console.log("Requesting to mint NFT:", request);

    // Send the minting request to the injected script (window.js)
    window.postMessage({
      action: 'MINT_NFT',
      contractAddress: request.contractAddress,
      abi: request.abi,
      tokenUri: request.tokenUri
    }, '*');

    // Listen for a response from window.js
    const handleMintResponse = (event) => {
      // Ensure the message is intended for this script
      if (event.source === window && event.data) {
        if (event.data.type === 'MINT_NFT_SUCCESS' || event.data.type === 'MINT_NFT_ERROR') {
          console.log('Minting NFT response:', event.data);

          // Clean up by removing the event listener after receiving the response
          window.removeEventListener('message', handleMintResponse);

          // Pass the response back to the extension's popup or background script
          sendResponse(event.data);
        }
      }
    };

    window.addEventListener('message', handleMintResponse);

    // Must return true when you use sendResponse asynchronously
    return true;
  }
});
