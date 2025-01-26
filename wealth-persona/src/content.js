// Wait for the DOM to be fully loaded

// Function to create and display a popup or notification when the page loads
function displayOnPageLoad() {
    console.log('displaying on page load now');

    if (document.getElementById('vanilla-onload-popup')) return;

    // Create a container for the popup
    const container = document.createElement('div');
    container.id = 'vanilla-onload-popup';
    container.style.position = 'fixed';
    container.style.top = '10%';
    container.style.right = '10%';
    container.style.zIndex = '9999';

    // Attach a Shadow DOM to the container
    const shadowRoot = container.attachShadow({ mode: 'open' });

    // Create the popup content inside the Shadow DOM
    const popup = document.createElement('div');
    popup.style.backgroundColor = '#007bff';
    popup.style.color = '#fff';
    popup.style.padding = '15px';
    popup.style.borderRadius = '8px';
    popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.textAlign = 'center';

    popup.innerHTML = `
      <h2 style="margin: 0 0 10px;">Welcome!</h2>
      <p style="margin: 0;">This is a message displayed on page load.</p>
    `;

    // Add the popup to the Shadow DOM
    shadowRoot.appendChild(popup);

    // Append the container to the document body
    document.body.appendChild(container);

    // Automatically remove the popup after 5 seconds
    setTimeout(() => {
        container.remove();
    }, 5000);
}

displayOnPageLoad();
