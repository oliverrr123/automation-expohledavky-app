#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Vytvoření adresářů, pokud neexistují
const publicImagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Funkce pro vytvoření jednoduchého placeholder obrázku
function createPlaceholderImage(width = 1600, height = 900) {
  // Vytvoření canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Pozadí
  ctx.fillStyle = '#f3f4f6'; // Světle šedá
  ctx.fillRect(0, 0, width, height);

  // Diagonální pruhy pro vizuální efekt
  ctx.fillStyle = '#e5e7eb'; // Tmavší šedá
  for (let i = 0; i < width + height; i += 40) {
    ctx.fillRect(0, i, i, 20);
  }

  // Logo nebo text uprostřed
  ctx.fillStyle = '#4b5563'; // Tmavě šedá
  ctx.font = 'bold 64px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ExPohledávky', width / 2, height / 2 - 40);

  // Menší text pod logem
  ctx.fillStyle = '#6b7280'; // Středně šedá
  ctx.font = '32px Arial';
  ctx.fillText('Obrázek nedostupný', width / 2, height / 2 + 40);

  // Konvertování canvas do buffer
  return canvas.toBuffer('image/jpeg', { quality: 0.9 });
}

// Vytvoření placeholder obrázku a uložení do souboru
const placeholderPath = path.join(publicImagesDir, 'placeholder.jpg');
const buffer = createPlaceholderImage();
fs.writeFileSync(placeholderPath, buffer);

console.log(`Placeholder image created at: ${placeholderPath}`); 