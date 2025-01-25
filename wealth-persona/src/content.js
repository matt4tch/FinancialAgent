console.log("Content script is running!");

document.addEventListener("click", (event) => {
    // Get the text content of the clicked element
    const clickedText = event.target.textContent.trim();

    // Send a message to the background script
    chrome.runtime.sendMessage({ type: "ELEMENT_CLICKED", text: clickedText }, (response) => {
        if (response) {
            console.log("Response from background script:", response);
        }
    });
});
