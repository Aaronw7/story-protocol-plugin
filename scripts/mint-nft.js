require('dotenv').config();
const ethers = require('ethers');

// Function to mint NFT with dynamic tokenUri
async function mintNFT(tokenUri) {
    // Get Alchemy App URL from environment variables
    const API_KEY = process.env.API_KEY;

    // Define an Alchemy Provider for the Sepolia testnet
    const provider = new ethers.AlchemyProvider('sepolia', API_KEY);

    // Get contract ABI file
    const contract = require("../artifacts/contracts/YouTubeNFT.sol/YouTubeNFT.json");

    // Create a signer using a private key from environment variables
    const privateKey = process.env.PRIVATE_KEY;
    const signer = new ethers.Wallet(privateKey, provider);

    // Get contract ABI and address
    const abi = contract.abi;
    const contractAddress = '0x334565EdCC39fbA6d2E5EDFEB13a0fAbAF2A1006';

    // Create a contract instance
    const youTubeNftContract = new ethers.Contract(contractAddress, abi, signer);

    try {
        // Call mintNFT function of the smart contract
        let nftTxn = await youTubeNftContract.mintNFT(signer.address, tokenUri);
        await nftTxn.wait();
        console.log(`NFT Minted! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`);
    } catch (error) {
        console.error('Error minting NFT:', error);
    }
}

const tokenUri = process.argv[2]; // Gets the third command-line argument, which is the first user-supplied argument
if (!tokenUri) {
    console.error("Token URI not provided.");
    process.exit(1);
}

mintNFT(tokenUri);
