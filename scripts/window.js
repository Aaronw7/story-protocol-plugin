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
          mintNFT(contractAddress, abi, tokenUri);
      } else {
          // Load ethers.js dynamically if it's not already available
          loadEthersJS(() => mintNFT(contractAddress, abi, tokenUri));
      }
  }
});

async function mintNFT(contractAddress, abi, tokenUri) {
  if (!window.ethereum) {
    console.error('Ethereum object not found. Make sure MetaMask is installed.');
    return;
  }

  try {
    // Request account access if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Create an instance of a provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const provider = ethers.getDefaultProvider()

    // Get signer (user) from the provider
    const signer = await provider.getSigner();

    // Create an instance of your contract
    const youTubeNftContract = new ethers.Contract(contractAddress, abi, signer);

    let nftTxn = await youTubeNftContract.mintNFT(await signer.getAddress(), tokenUri);

    await nftTxn.wait();
    console.log(`NFT Minted! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`);
    window.postMessage({ type: 'MINT_NFT_SUCCESS', tx: nftTxn.transactionHash }, '*');
  } catch (error) {
    console.error('Error minting NFT:', error);
    window.postMessage({ type: 'MINT_NFT_ERROR', error: error.message }, '*');
  }
}
