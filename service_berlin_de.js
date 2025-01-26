// ==UserScript==
// @name         Combined Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-01-26
// @description  Combined functionality of two scripts
// @author       You
// @match        https://service.berlin.de/terminvereinbarung/termin*
// @match        https://service.berlin.de/dienstleistung/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=berlin.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Functionality for terminvereinbarung pages
    if (window.location.href.includes("/terminvereinbarung/termin")) {
        window.onload = function() {
            console.log("Page fully loaded.");
            let interval = setInterval(oneSecondFunction, 1000);

            function oneSecondFunction() {
                // Check for calendar-table
                if (document.getElementsByClassName("calendar-table").length > 0) {
                    console.log("Calendar table found. Waiting for 2 minutes before refreshing.");
                    clearInterval(interval);

                    // Wait for 2 minutes and then refresh the page
                    setTimeout(() => {
                        console.log("Refreshing the page after 2 minutes.");
                        location.reload();
                    }, 60000);
                    return; // Exit the function
                }

                // Handle the countdown timer
                const calculatedSecs = document.getElementById("calculatedSecs");
                if (calculatedSecs && calculatedSecs.textContent === '00:00') {
                    console.log("Countdown reached 00:00. Restarting process.");
                    clearInterval(interval);

                    const form = document.querySelector("form[action='/terminvereinbarung/termin/restart/']");
                    if (form) {
                        form.submit();
                    } else {
                        console.error("Form not found for restart.");
                    }
                }
            }
        };
    }

    // Functionality for dienstleistung pages
    if (window.location.href.includes("/dienstleistung/")) {
        window.addEventListener('load', function() {
            const labelsToCheck = [
                "Bürgeramt 1 (Kreuzberg), Yorckstraße",
                "Bürgeramt 3 (Friedrichshain), Frankfurter Allee",
                "Bürgeramt Rathaus Mitte",
                "Bürgeramt Rathaus Tiergarten",
                "Bürgeramt Wedding",
                "Bürgeramt Klosterstraße",
                "Bürgeramt Wedding - Personaldokumente nach Einbürgerung (LEA)",
                "Bürgeramt Prenzlauer Berg",
                "Bürgeramt Schöneberg",
                "Bürgeramt Tempelhof",
            ];

            labelsToCheck.forEach(labelText => {
                // Find the label element by its text content
                const label = Array.from(document.querySelectorAll('label.form-check-label')).find(label => label.textContent.trim() === labelText);

                if (label) {
                    // Find the associated checkbox input
                    const checkbox = document.getElementById(label.getAttribute('for'));

                    // Simulate a click on the checkbox if it exists
                    if (checkbox) {
                        checkbox.click();
                    }
                }
            });
        });
    }
})();
