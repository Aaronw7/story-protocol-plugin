const axios = require('axios');

module.exports = async (req, res) => {
    const { title, description, videoUrl } = req.body;

    // Construct the metadata object
    const metadata = {
        title,
        description,
        image: "URL_to_a_thumbnail", // Optionally add an image URL
        properties: {
            videoUrl,
        }
    };

    try {
        const pinataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
            headers: {
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
            }
        });

        const pinataData = pinataResponse.data;
        res.status(200).json({ tokenUri: `ipfs://${pinataData.IpfsHash}` });
    } catch (error) {
        console.error('Error uploading to Pinata:', error.message);
        res.status(500).json({ error: 'Failed to upload metadata to Pinata.' });
    }
};
