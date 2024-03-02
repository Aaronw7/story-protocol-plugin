document.getElementById('mintNftButton').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "checkEthereum" }, function(response) {
      if (response && response.ethereumAvailable) {
        console.log("this is the response: ", response);
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
                thumbnailUrl: response.thumbnailUrl,
                videoUrl: response.videoUrl,
              }),
            });

            if (!serverResponse.ok) {
              throw new Error('Server error occurred');
            }

            console.log("does it get here?");
            const { tokenUri } = await serverResponse.json();
            console.log('Token URI:', tokenUri);
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "mintNFT",
              tokenUri: tokenUri,
            });
            console.log("how about here?");
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
