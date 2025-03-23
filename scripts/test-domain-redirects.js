#!/usr/bin/env node

/**
 * This script tests the domain-based language redirects in a development environment.
 * It simulates requests with different country headers to verify the middleware is working.
 * 
 * Usage: node scripts/test-domain-redirects.js
 */

const http = require('http');
const { execSync } = require('child_process');
const url = require('url');

// Test scenarios - country codes and expected domains
const testScenarios = [
  { country: 'CZ', expectedDomain: 'expohledavky.cz', description: 'Czech visitor should go to .cz' },
  { country: 'SK', expectedDomain: 'expohledavky.sk', description: 'Slovak visitor should go to .sk' },
  { country: 'DE', expectedDomain: 'expohledavky.de', description: 'German visitor should go to .de' },
  { country: 'AT', expectedDomain: 'expohledavky.de', description: 'Austrian visitor should go to .de' },
  { country: 'GB', expectedDomain: 'expohledavky.com', description: 'UK visitor should stay on .com' },
  { country: 'US', expectedDomain: 'expohledavky.com', description: 'US visitor should stay on .com' },
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Function to simulate a request with a specific country code
async function simulateRequest(country) {
  return new Promise((resolve, reject) => {
    // Create options for the HTTP request
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      headers: {
        // Simulate the country header that Next.js middleware would see
        'x-vercel-ip-country': country,
        'host': 'expohledavky.com', // Always test as if on the .com domain
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      // Check if there's a redirect
      if (res.statusCode >= 300 && res.statusCode < 400) {
        const redirectUrl = res.headers.location;
        resolve({
          statusCode: res.statusCode,
          redirectUrl,
          hasRedirect: true,
          targetDomain: url.parse(redirectUrl).hostname
        });
      } else {
        // No redirect
        resolve({
          statusCode: res.statusCode,
          redirectUrl: null,
          hasRedirect: false,
          targetDomain: 'expohledavky.com' // No redirect, stays on same domain
        });
      }
      
      // Consume response data to free up memory
      res.on('data', (chunk) => {
        data += chunk;
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Main function to run all tests
async function runTests() {
  console.log(`${colors.blue}===== Testing Domain Redirection Logic =====\n${colors.reset}`);
  console.log(`${colors.yellow}Note: Make sure your Next.js development server is running on port 3000\n${colors.reset}`);
  
  let passed = 0;
  let failed = 0;
  
  // Run each test scenario
  for (const test of testScenarios) {
    try {
      console.log(`${colors.blue}Testing: ${test.description}${colors.reset}`);
      
      const result = await simulateRequest(test.country);
      
      if (result.hasRedirect) {
        const redirectDomain = result.targetDomain;
        
        if (redirectDomain === test.expectedDomain) {
          console.log(`${colors.green}✓ SUCCESS: ${test.country} redirected to ${redirectDomain} as expected${colors.reset}\n`);
          passed++;
        } else {
          console.log(`${colors.red}✗ FAIL: ${test.country} redirected to ${redirectDomain}, but expected ${test.expectedDomain}${colors.reset}\n`);
          failed++;
        }
      } else if (test.expectedDomain === 'expohledavky.com') {
        // If we expect to stay on .com and there's no redirect, that's correct
        console.log(`${colors.green}✓ SUCCESS: ${test.country} correctly stayed on expohledavky.com${colors.reset}\n`);
        passed++;
      } else {
        // If we expect a redirect but don't get one, that's an error
        console.log(`${colors.red}✗ FAIL: ${test.country} did not redirect, but should go to ${test.expectedDomain}${colors.reset}\n`);
        failed++;
      }
    } catch (error) {
      console.error(`${colors.red}Error testing ${test.country}: ${error.message}${colors.reset}\n`);
      failed++;
    }
  }
  
  // Print summary
  console.log(`${colors.blue}===== Test Summary =====\n${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`${colors.blue}Total: ${testScenarios.length}${colors.reset}`);
  
  if (failed === 0) {
    console.log(`\n${colors.green}All tests passed! Your domain redirection is working correctly.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}Some tests failed. Please check your middleware implementation.${colors.reset}`);
  }
}

// Check if Next.js server is running
try {
  runTests().catch(error => {
    console.error(`${colors.red}Test execution failed: ${error.message}${colors.reset}`);
  });
} catch (error) {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
} 