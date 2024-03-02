async function main() {
  // Grab the contract factory
  const YouTubeNFT = await ethers.getContractFactory("YouTubeNFT");

  // Start deployment, returning a promise that resolves to a contract object
  const youTubeNFT = await YouTubeNFT.deploy(); // Instance of the contract
  console.log("Contract deployed to address:", youTubeNFT.target);
}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });