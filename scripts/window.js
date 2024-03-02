import mintNFT from './mint-nft';

function loadEthersJS(callback) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.umd.min.js'; // Ensure using UMD build
  script.onload = () => {
    console.log('ethers.js has been loaded successfully!');
    if (typeof window.ethers !== 'undefined') {
      callback(window.ethers); // Pass the ethers object to the callback
    } else {
      console.error('ethers.js loaded, but `window.ethers` is not defined.');
    }
  };
  script.onerror = (error) => {
    console.error('Error loading ethers.js:', error);
  };
  document.head.appendChild(script);
}

// Post Ethereum availability status
if (window.ethereum) {
  window.postMessage({ type: 'ETHEREUM_STATUS', status: 'available' }, '*');
} else {
  window.postMessage({ type: 'ETHEREUM_STATUS', status: 'unavailable' }, '*');
}

// Listen for the mint NFT message
window.addEventListener('message', event => {
  if (event.data && event.data.action === 'MINT_NFT') {
      const { contractAddress, abi, tokenUri } = event.data;

      // Ensure ethers.js is loaded before proceeding
      if (window.ethers) {
          mintNFT(tokenUri);
      } else {
          // Load ethers.js dynamically if it's not already available
          loadEthersJS(() => mintNFT(tokenUri));
      }
  }
});

// Function to mint NFT using ethers.js
// function mintNFT(contractAddress, abi, tokenUri) {
//   if (window.ethereum) {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       window.ethereum.request({ method: 'eth_requestAccounts' })
//           .then(accounts => {
//               const signer = provider.getSigner();
//               const contract = new ethers.Contract(contractAddress, abi, signer);

//               console.log("this is the tokenUri: ", tokenUri);
//               contract.mintNFT(tokenUri)
//                   .then(tx => {
//                       console.log('NFT Minted:', tx);
//                       window.postMessage({ type: 'MINT_NFT_SUCCESS', tx: tx }, '*');
//                   })
//                   .catch(error => {
//                       console.error('Error minting NFT:', error);
//                       window.postMessage({ type: 'MINT_NFT_ERROR', error: error.message }, '*');
//                   });
//           })
//           .catch(error => {
//               console.error('Error fetching accounts:', error);
//               window.postMessage({ type: 'MINT_NFT_ERROR', error: error.message }, '*');
//           });
//   } else {
//       console.log('Ethereum is not available.');
//       window.postMessage({ type: 'MINT_NFT_ERROR', error: 'Ethereum is not available.' }, '*');
//   }
// }