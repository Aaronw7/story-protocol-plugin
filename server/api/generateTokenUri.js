const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    const { title, description, videoUrl, thumbnailUrl } = req.body;

    const metadata = {
        name: title,
        description,
        image: thumbnailUrl,
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
