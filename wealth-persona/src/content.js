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

// Function to show a full-screen popup
const showPopup = () => {
  const stockTickerElement = document.querySelector(".quote-symbol .nowrap.ellipsis");
  const stockExchangeElement = document.querySelector(".quote-exch.text-regular.fg50.nowrap.quote-sm");

  const stockTicker = stockTickerElement ? stockTickerElement.textContent.trim() : "Unknown Ticker";
  const stockExchange = stockExchangeElement ? stockExchangeElement.textContent.trim() : "Unknown Exchange";

  const popupContainer = document.createElement("div");
  popupContainer.id = "popup-container";
  popupContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    font-family: Arial, sans-serif;
  `;

  const popupContent = document.createElement("div");
  popupContent.style.cssText = `
    text-align: center;
  `;

  const tickerText = document.createElement("h1");
  tickerText.textContent = `Ticker: ${stockTicker}`;
  tickerText.style.cssText = `
    font-size: 2rem;
    margin-bottom: 20px;
  `;

  const exchangeText = document.createElement("h2");
  exchangeText.textContent = `Exchange: ${stockExchange}`;
  exchangeText.style.cssText = `
    font-size: 1.5rem;
    margin-bottom: 40px;
  `;

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.cssText = `
    padding: 10px 20px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  `;
  closeButton.addEventListener("click", () => {
    document.body.removeChild(popupContainer);
  });

  popupContent.appendChild(tickerText);
  popupContent.appendChild(exchangeText);
  popupContent.appendChild(closeButton);

  popupContainer.appendChild(popupContent);
  document.body.appendChild(popupContainer);

  console.log("Popup displayed with Ticker and Exchange.");
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
