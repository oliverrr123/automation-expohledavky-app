#!/usr/bin/env node

/**
 * This script generates localized route files for Next.js App Router
 * It takes existing routes in the app directory and creates appropriate
 * localized versions for different languages
 * 
 * Usage:
 * node scripts/generate-localized-routes.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const APP_DIR = path.join(__dirname, '..', 'app');
const LOCALES = ['en', 'de', 'sk'];

// Import route mappings from route-mapping.ts
const { ROUTE_MAPPING } = require('../lib/route-mapping-node');

// Localized labels for the redirecting text
const REDIRECT_LABELS = {
  en: {
    title: 'Redirecting...',
    text: 'Please wait while you are redirected to the correct page.'
  },
  de: {
    title: 'Weiterleitung...',
    text: 'Bitte warten Sie, während Sie zur richtigen Seite weitergeleitet werden.'
  },
  sk: {
    title: 'Presmerovanie...',
    text: 'Počkajte prosím, kým budete presmerovaní na správnu stránku.'
  }
};

// Template for localized page files
function generateTemplateFile(csPath, locale, targetPath) {
  const labels = REDIRECT_LABELS[locale];
  
  return `"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentLocale } from "@/lib/i18n"
import { transformPath } from "@/lib/route-mapping"

export default function ${capitalize(locale)}Page() {
  const router = useRouter()
  
  useEffect(() => {
    // Get the current locale
    const locale = getCurrentLocale()
    
    // For ${locale} locale on Czech route, redirect to the ${locale} route
    // This should only happen if the middleware rewriting failed
    if (locale === '${locale}') {
      const ${locale}Path = transformPath('${csPath}', 'cs', '${locale}') // Will be ${targetPath}
      router.replace(${locale}Path)
    }
  }, [router])
  
  // This content shouldn't be visible as the redirect should happen immediately
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4">${labels.title}</h1>
      <p>${labels.text}</p>
    </div>
  )
}`;
}

// Template for redirect page files
function generateRedirectFile(fromPath, locale, targetPath) {
  const labels = REDIRECT_LABELS[locale];
  
  return `"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentLocale } from "@/lib/i18n"
import { transformPath } from "@/lib/route-mapping"

export default function ${capitalize(locale)}RedirectPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Get the current locale
    const locale = getCurrentLocale()
    
    // Redirect to the Czech version which definitely exists
    const czechPath = transformPath('${fromPath}', '${locale}', 'cs') 
    router.push(czechPath)
  }, [router])
  
  return (
    <div className="container mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4">${labels.title}</h1>
      <p>${labels.text}</p>
    </div>
  )
}`;
}

// Helper functions
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getDirectories(srcPath) {
  return fs
    .readdirSync(srcPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

// Function to recursively process directories
function processDirectory(relativeDir) {
  const fullDir = path.join(APP_DIR, relativeDir);
  console.log(`Processing directory: ${relativeDir}`);
  
  // Skip if directory doesn't have a page.tsx
  const pagePath = path.join(fullDir, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    console.log(`  - Skipping: No page.tsx found in ${relativeDir}`);
    return;
  }
  
  // Generate localized versions for each locale
  LOCALES.forEach(locale => {
    const csPath = `/${relativeDir}`;
    
    // 1. Generate [locale].tsx file in the CS directory
    const localizedPath = path.join(fullDir, `page.${locale}.tsx`);
    
    // Look up the target path for this CS route in the target locale
    const targetDir = ROUTE_MAPPING[`cs-${locale}`]?.[relativeDir];
    if (!targetDir) {
      console.log(`  - Skipping ${locale}: No mapping found for ${relativeDir}`);
      return;
    }
    
    const targetPath = `/${targetDir}`;
    
    // Create the localized file
    const fileContent = generateTemplateFile(csPath, locale, targetPath);
    
    // Write the file
    fs.writeFileSync(localizedPath, fileContent);
    console.log(`  - Created: ${localizedPath}`);
    
    // 2. Generate the redirect file if needed
    // Skip if the target dir is the same as the CS dir
    if (targetDir !== relativeDir) {
      const redirectDir = path.join(APP_DIR, targetDir);
      const redirectFile = path.join(redirectDir, 'page.tsx');
      
      // Create the directory if it doesn't exist
      ensureDirectoryExists(redirectDir);
      
      // Create the redirect file
      const redirectContent = generateRedirectFile(targetPath, locale, csPath);
      
      // Write the file
      fs.writeFileSync(redirectFile, redirectContent);
      console.log(`  - Created redirect: ${redirectFile}`);
    }
  });
  
  // Process subdirectories
  const subdirs = getDirectories(fullDir);
  subdirs.forEach(subdir => {
    // Skip special directories
    if (subdir.startsWith('_') || subdir.startsWith('.')) {
      return;
    }
    
    // Process subdirectory recursively
    processDirectory(path.join(relativeDir, subdir));
  });
}

// Main function
function generateLocalizedRoutes() {
  console.log('Generating localized route files...');
  
  // Get all directories in the app folder
  const appDirs = getDirectories(APP_DIR);
  
  // Filter for content directories (skip special dirs like api)
  const contentDirs = appDirs.filter(dir => 
    !dir.startsWith('_') && 
    !dir.startsWith('.') && 
    !['api', 'auth'].includes(dir)
  );
  
  // Process each top-level directory
  contentDirs.forEach(dir => {
    processDirectory(dir);
  });
  
  console.log('Done generating localized route files!');
}

// Run the script
generateLocalizedRoutes(); 