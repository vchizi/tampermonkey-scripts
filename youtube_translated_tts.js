// ==UserScript==
// @name         Intercept Specific Request
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Intercept fetch requests to a specific URL
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey script started');
    window.addEventListener('load', function() {
        console.log('YouTube page is fully loaded!');

        // Store the original fetch function
        const originalFetch = window.fetch;

        const checkForRequest = setInterval(() => {
            console.log("tick")
            const openRequests = performance.getEntriesByType('resource').filter(entry => entry.name.startsWith('https://vtrans.s3-private.mds'));

            if (openRequests.length > 0) {
                openRequests.forEach(request => {
                    console.log('Request Found:', request.name);
                    // Get the current YouTube video URL
                    const youtubeVideoUrl = window.location.href;

                    // Embed the request URL and YouTube video URL in a JSON object
                    const jsonData = {
                        translatedAudio: request.name,
                        video: youtubeVideoUrl
                    };

                    showModal(jsonData);
                });

                // Stop checking after we find the request
                clearInterval(checkForRequest);
            }
        }, 100); // Check every second
    });

    function showModal(jsonData) {
        // Create a modal window
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.border = '1px solid #ccc';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        modal.style.zIndex = '10000';
        modal.style.fontFamily = 'Arial, sans-serif';

        // Convert JSON data to a string for display
        const jsonString = JSON.stringify(jsonData, null, 2);

        // Add the JSON data to the modal
        const jsonText = document.createElement('pre');
        jsonText.textContent = jsonString;
        jsonText.style.wordBreak = 'break-all';
        jsonText.style.marginBottom = '20px';
        jsonText.style.whiteSpace = 'pre-wrap'; // Ensure JSON is properly formatted
        modal.appendChild(jsonText);

        // Add a "Copy" button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy JSON';
        copyButton.style.padding = '10px 20px';
        copyButton.style.backgroundColor = '#007bff';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '5px';
        copyButton.style.cursor = 'pointer';
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(jsonString)
                .then(() => {
                    alert('JSON copied to clipboard!');
                })
                .catch(() => {
                    alert('Failed to copy JSON. Please copy it manually.');
                });
        });
        modal.appendChild(copyButton);

        // Add a "Close" button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#dc3545';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.marginLeft = '10px';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        modal.appendChild(closeButton);

        // Append the modal to the body
        document.body.appendChild(modal);
    }
})();
