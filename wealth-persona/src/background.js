chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received data from content script:", message);
    sendResponse({ status: "success" });
  });
  