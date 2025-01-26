// src/content.js

import React from "react";
import { createRoot } from "react-dom/client";
import EmbeddedContent from "./EmbeddedContent.jsx";

/**
 * 1. Create a new <div> and attach it to the document body.
 * 2. Use a Shadow DOM to encapsulate styles and render our React component inside it.
 */

function injectContent() {
    const containerId = "wealth-persona-ext-container";

    // Avoid reinjecting if it already exists
    if (document.getElementById(containerId)) {
        return;
    }

    // Create the app container and attach it to the document body
    const appContainer = document.createElement("div");
    appContainer.id = containerId;

    // Style so it's fixed to the right side of the viewport
    Object.assign(appContainer.style, {
        position: "fixed",
        top: "10px",
        right: "10px",
        width: "400px",
        height: "700px",
        zIndex: 999999, // make sure it's on top
    });

    document.body.appendChild(appContainer);

    // Create a shadow root that wraps the app container
    const shadowRoot = appContainer.attachShadow({ mode: "open" });

    // Create the React root container inside the shadow root
    const reactRoot = document.createElement("div");
    shadowRoot.appendChild(reactRoot);

    // Create the root for React 18+ and render the App
    const root = createRoot(reactRoot);
    root.render(<EmbeddedContent />);
}

// Run the injection as soon as the content script is loaded
injectContent();