document.getElementById('mintNftButton').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "requestVideoDetails" }, async function(response) {
      try {
        console.log('this is the response: ', response);
        const serverResponse = await fetch('https://story-protocol-plugin.vercel.app/api/generateTokenUri', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: response.title,
            description: response.description,
            videoUrl: response.videoUrl,
          }),
        });

        if (!serverResponse.ok) {
          throw new Error('Server error occurred');
        }

        const { tokenUri } = await serverResponse.json();
        console.log('Token URI:', tokenUri);
        // Here you can further use tokenUri, like minting the NFT
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
});
