import React, {useEffect} from "react";

const App = () => {
    const handleButtonClick = () => {
        // Example: Redirect to a registration page
        window.open("https://your-registration-page.com", "_blank");
    };

    useEffect(() => {
        console.log('App component has rendered.');
    }, []);

    return (
        <div style={{ padding: "16px", fontFamily: "Arial, sans-serif" }}>
            <h1>Welcome to Financial Agent</h1>
            <p>Click below to register and get started:</p>
            <button
                onClick={handleButtonClick}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    color: "#fff",
                    backgroundColor: "#007bff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                Register Now
            </button>
        </div>
    );
};

export default App;
