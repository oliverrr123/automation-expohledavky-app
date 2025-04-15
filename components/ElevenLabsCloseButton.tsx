"use client";

import { useEffect } from "react";
import Script from 'next/script';

export default function ElevenLabsCloseButton() {
  return (
    <>
      {/* Vložíme inline skript pro ovládání ElevenLabs ConvAI */}
      <Script
        id="elevenlabs-close-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Funkce pro čekání na načtení prvku
              function waitForElement(selector, timeout = 10000) {
                return new Promise((resolve, reject) => {
                  const startTime = Date.now();
                  
                  const checkInterval = setInterval(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                      clearInterval(checkInterval);
                      resolve(element);
                    } else if (Date.now() - startTime > timeout) {
                      clearInterval(checkInterval);
                      reject(new Error('Timeout waiting for element: ' + selector));
                    }
                  }, 100);
                });
              }
              
              // Funkce pro zachycení kliknutí na zavírací tlačítko (delegace události)
              function setupCloseButton() {
                document.addEventListener('click', function(event) {
                  // Kontrola, zda je kliknuto na nebo v blízkosti pozice zavíracího tlačítka
                  const elevenlabsElement = document.querySelector('elevenlabs-convai');
                  if (!elevenlabsElement) return;
                  
                  const rect = elevenlabsElement.getBoundingClientRect();
                  const clickX = event.clientX;
                  const clickY = event.clientY;
                  
                  // Kontrola, zda je kliknuto v oblasti nalevo od widgetu (nová pozice tlačítka)
                  if (clickX >= rect.left - 60 && clickX <= rect.left - 20 && 
                      clickY >= rect.top + (rect.height / 2) - 20 && clickY <= rect.top + (rect.height / 2) + 20) {
                    console.log('Kliknuto na zavírací tlačítko ElevenLabs ConvAI');
                    
                    // Skrýt widget
                    elevenlabsElement.style.display = 'none';
                    
                    // Uložit stav do localStorage
                    localStorage.setItem('elevenlabs-convai-closed', 'true');
                    
                    // Zastavit propagaci události
                    event.stopPropagation();
                  }
                }, true);
                
                // Kontrola, zda byl widget již dříve zavřen
                setTimeout(() => {
                  const wasClosed = localStorage.getItem('elevenlabs-convai-closed') === 'true';
                  if (wasClosed) {
                    const widget = document.querySelector('elevenlabs-convai');
                    if (widget) {
                      widget.style.display = 'none';
                    }
                  }
                }, 500);
              }
              
              // Počkáme na načtení elevenlabs widgetu
              waitForElement('elevenlabs-convai')
                .then(() => {
                  console.log('ElevenLabs ConvAI widget nalezen');
                  setupCloseButton();
                })
                .catch(err => {
                  console.warn('Nepodařilo se najít ElevenLabs ConvAI widget:', err);
                });
                
              // Reset widgetu při navigaci
              document.addEventListener('click', function(event) {
                if (event.target && 
                    event.target.tagName === 'A' && 
                    event.target.getAttribute('href') && 
                    event.target.getAttribute('href').startsWith('/')) {
                  localStorage.removeItem('elevenlabs-convai-closed');
                }
              });
            })();
          `
        }}
      />
    </>
  );
} 