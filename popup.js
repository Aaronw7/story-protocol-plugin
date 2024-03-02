document.getElementById('mintNftButton').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "checkEthereum" }, function(response) {
      if (response && response.ethereumAvailable) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "requestVideoDetails" }, async function(response) {
          try {
            const serverResponse = await fetch('https://story-protocol-plugin.vercel.app/api/generateTokenUri', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: response.title,
                description: response.description,
                thumbnailUrl: response.thumbnailUrl,
                videoUrl: response.videoUrl,
              }),
            });

            if (!serverResponse.ok) {
              throw new Error('Server error occurred');
            }

            const { tokenUri } = await serverResponse.json();
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "mintNFT",
              tokenUri: tokenUri,
            });
          } catch (error) {
            console.error('Error:', error);
          }
        });
      } else {
        alert('Please install MetaMask or another Ethereum wallet.');
      }
    });
  });
});
