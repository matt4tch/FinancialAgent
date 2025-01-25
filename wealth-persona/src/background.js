console.log("Background script is running!");

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "ELEMENT_CLICKED") {
        console.log("Content script sent:", message.text);

        // Respond to the content script
        sendResponse({ status: "Message received!", data: message.text });
    }
});
