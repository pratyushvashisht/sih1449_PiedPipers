import React, { useState, useEffect } from 'react';
import Download from "./downloadMenu";

const ProgressBar = () => {
    const [progress, setProgress] = useState(0);
    const [showCompletionDiv, setShowCompletionDiv] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(oldProgress => {
                const newProgress = Math.min(oldProgress + 0.83, 100);
                if (newProgress === 100) {
                    clearInterval(interval);
                    setShowCompletionDiv(true); // Show the div on completion
                }
                return newProgress;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div>
            <div className="w-full bg-gray-200 h-4 rounded">
                <div
                    className="bg-blue-600 h-4 rounded"
                    style={{ width: `${progress}%`, transition: 'width 1s ease-out' }}
                ></div>
            </div>
            {showCompletionDiv && (
                <div className="mt-4 p-4 border border-blue-600 rounded">
                    <Download/>
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-lg" onClick={'./home?id=1'}> Check Vulnerabilities</button>

                    <p>Loading Complete!</p>
                </div>
            )}
        </div>
    );
};

export default ProgressBar;
