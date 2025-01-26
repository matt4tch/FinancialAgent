// Function to observe URL changes and trigger scraping
const observeURLChanges = () => {
  let currentURL = window.location.href;

  const urlObserver = setInterval(() => {
    if (currentURL !== window.location.href) {
      console.log("URL changed. Restarting scraping...");
      currentURL = window.location.href;

      // Restart scraping
      startScraping();
    }
  }, 1000); // Check for URL changes every 1 second
};

// Function to create the button in a Shadow DOM
const createButtonWithShadowDOM = () => {
  if (document.querySelector("#my-shadow-host")) {
    console.log("Button already exists.");
    return;
  }

  console.log("Creating button...");

  const quoteMainElement = document.querySelector(".quote-main");
  if (!quoteMainElement) {
    console.error("quote-main element not found!");
    return;
  }

  const shadowHost = document.createElement("div");
  shadowHost.id = "my-shadow-host";

  shadowHost.style.display = "inline-block";
  shadowHost.style.marginLeft = "20px";
  shadowHost.style.verticalAlign = "middle";

  const shadowRoot = shadowHost.attachShadow({ mode: "open" });

  const button = document.createElement("button");
  button.textContent = "Click Me!";
  button.style.cssText = `
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-right: 20px;
  `;

  button.addEventListener("click", () => {
    showPopup();
  });

  shadowRoot.appendChild(button);

  const style = document.createElement("style");
  style.textContent = `
    button:hover {
      background-color: #0056b3;
    }
  `;
  shadowRoot.appendChild(style);

  quoteMainElement.appendChild(shadowHost);

  console.log("Button created successfully.");
};

// Function to show a full-screen popup with a 3x3 grid
// Function to show a full-screen popup with a 3x3 grid
const showPopup = () => {
  // Create a popup container
  const popupContainer = document.createElement("div");
  popupContainer.id = "popup-container";
  popupContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    font-family: Arial, sans-serif;
  `;

  // Create the white square container for the grid
  const gridContainer = document.createElement("div");
  gridContainer.style.cssText = `
    position: relative;
    background-color: white;
    width: 400px;
    height: 400px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 5px;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  `;

  // Create placeholders for grid elements
  for (let i = 0; i < 9; i++) {
    const gridItem = document.createElement("div");
    gridItem.textContent = `Placeholder ${i + 1}`;
    gridItem.style.cssText = `
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      border-radius: 5px;
      cursor: pointer;
    `;

    // Add click functionality for each grid item (optional for future use)
    gridItem.addEventListener("click", () => {
      alert(`Clicked on Placeholder ${i + 1}`);
    });

    gridContainer.appendChild(gridItem);
  }

  // Create a close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "✖";
  closeButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  `;
  closeButton.addEventListener("click", () => {
    document.body.removeChild(popupContainer);
  });

  // Add the close button to the grid container
  gridContainer.appendChild(closeButton);

  // Add the grid container to the popup
  popupContainer.appendChild(gridContainer);

  // Add the popup to the body
  document.body.appendChild(popupContainer);

  console.log("Popup displayed with a 3x3 grid.");
};

// Function to dynamically update the grid elements
const updateGridElement = (index, content) => {
  const gridContainer = document.querySelector("#popup-container > div");
  if (gridContainer && index >= 0 && index < 9) {
    const gridItems = gridContainer.querySelectorAll("div");
    gridItems[index].textContent = content;
    console.log(`Updated grid item ${index + 1} with content: ${content}`);
  } else {
    console.error("Grid container or index out of bounds.");
  }
};



// Function to scrape data
const scrapeData = () => {
  const stockTickerElement = document.querySelector(".quote-symbol .nowrap.ellipsis");
  const stockExchangeElement = document.querySelector(".quote-exch.text-regular.fg50.nowrap.quote-sm");

  if (stockTickerElement && stockExchangeElement) {
    const stockTicker = stockTickerElement.textContent.trim();
    const stockExchange = stockExchangeElement.textContent.trim();

    console.log("Scraped Ticker:", stockTicker);
    console.log("Scraped Exchange:", stockExchange);

    createButtonWithShadowDOM();
    stopScraping();
  } else {
    console.log("Waiting for elements to appear...");
  }
};

// Stop all scraping mechanisms
const stopScraping = () => {
  clearInterval(intervalId);
  observer.disconnect();
  console.log("Stopped all scraping mechanisms.");
};

// Function to start scraping
const startScraping = () => {
  console.log("Starting scraping...");
  scrapeData();

  observer.observe(document.body, { childList: true, subtree: true });
  intervalId = setInterval(() => {
    console.log("Regular interval scraping...");
    scrapeData();
  }, 1000); // Check every 1 second
};

// Set up MutationObserver
const observer = new MutationObserver(() => {
  console.log("DOM updated. Checking for elements...");
  scrapeData();
});

// Observe URL changes
observeURLChanges();

// Start scraping for the first time
let intervalId;
startScraping();
