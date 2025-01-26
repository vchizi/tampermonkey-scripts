// ==UserScript==
// @name         Dict Leo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://dict.leo.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    console.log("test");
    copy();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    (function() {
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            if (arguments[1].includes('/dictQuery/m-vocab/ende/query.xml')) {
                console.log('request started!', arguments[0], arguments[1]);
                this.addEventListener('load', async function() {
                    console.log('request completed!');

                    await sleep(100);

                    copy();
                });
            }

            origOpen.apply(this, arguments);
        };
    })();

    function tempAlert(msg,duration,element)
    {
        var el = document.createElement("div");
        el.setAttribute("style","position:absolute;top:0%;left:0%;background-color:white;");
        el.innerHTML = msg;
        setTimeout(function(){
            el.parentNode.removeChild(el);
        },duration);
        element.parentNode.appendChild(el);
    }

    function copy() {
        const elements = document.getElementsByClassName("icon_play-circle-outline");
        for (var i = 0; i < elements.length; i++) {
            console.log(elements[i])
            var icon = document.createElement("i");
            icon.className = "icon noselect icon_content-save icon_size_18 darkgray"
            icon.dataset.dzRelAudio = elements[i].dataset.dzRelAudio;
            icon.onclick = function() {
                console.log("click")
                let element = this;
                const copyContent = async () => {
                    try {
                        let url = 'https://dict.leo.org/media/audio/' + element.dataset.dzRelAudio + '.ogg';

                        console.log('Content copied to clipboard: ' + url);
                        await navigator.clipboard.writeText(url);

                        tempAlert("Copied: " + url, 1000, element);
                    } catch (err) {
                        console.error('Failed to copy: ', err);
                    }
                }

                copyContent();
            };

            elements[i].parentNode.appendChild(icon);
        }
    }
})();
