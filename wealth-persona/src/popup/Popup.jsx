import '../styles.css';
import React, { useState, useEffect } from "react";

function Popup() {
  const [data, setData] = useState({ stockTicker: "", stockExchange: "" });

  useEffect(() => {
    console.log("Popup script loaded.");

    // Listener to receive messages from content.js
    chrome.runtime.onMessage.addListener((message) => {
      console.log("Received message in popup:", message);
      setData(message);
    });
  }, []);

  return (
    <div className="popup">
      <h1>Stock Info</h1>
      <p>
        <strong>Ticker:</strong> {data.stockTicker || "Loading..."}
      </p>
      <p>
        <strong>Exchange:</strong> {data.stockExchange || "Loading..."}
      </p>
    </div>
  );
}

export default Popup;
