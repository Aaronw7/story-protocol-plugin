chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "mintNFT") {
      ethereum.request({ method: 'eth_requestAccounts' })
          .then(accounts => {
              // Use the first account to mint NFT
              const account = accounts[0];
              // Assuming ethers is available in the window scope (e.g., via a script tag in popup.html)
              const signer = new ethers.providers.Web3Provider(ethereum).getSigner();
              const contract = new ethers.Contract(contractAddress, abi, signer);

              contract.mintNFT(account, tokenUri)
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
