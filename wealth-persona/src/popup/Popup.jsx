import React, { useEffect } from "react"
import '../styles.css';

const Popup = () => {
    const handleButtonClick = () => {
        window.open("https://financial-agent-r00kggt51-karanjots-projects-a4d50e3c.vercel.app/", "_blank")
    }

    useEffect(() => {
        console.log("Popup component has rendered.")
    }, [])

    return (
        <div className="w-80 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg rounded-lg overflow-hidden">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-purple-800">Wealth Persona</h1>
                    <img src="/icons/wealth_persona_logo.png" alt="Wealth Persona Logo" className="w-10 h-10 rounded-full" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Unlock your financial potential and discover your unique wealth persona.
                </p>
                <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
                    <h2 className="text-lg font-semibold text-purple-700 mb-2">Did you know?</h2>
                    <p className="text-xs text-gray-500">
                        Understanding your wealth persona can help you make better financial decisions and achieve your goals
                        faster.
                    </p>
                </div>
                <button
                    onClick={handleButtonClick}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                    Start Your Journey
                </button>
            </div>
        </div>
    )
}

export default Popup;
