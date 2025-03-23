import crypto from 'crypto';

// Secret key for CSRF token generation (use environment variable in production)
const SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-at-least-32-chars-long';

/**
 * Generate a CSRF token that includes a timestamp and is signed with HMAC
 * @returns {string} The generated CSRF token
 */
export function generateCSRFToken(): string {
  // Create a timestamp (valid for 1 hour)
  const timestamp = Date.now() + 60 * 60 * 1000; // 1 hour from now
  
  // Create a random string
  const random = crypto.randomBytes(16).toString('hex');
  
  // Combine timestamp and random string
  const payload = `${timestamp}.${random}`;
  
  // Create HMAC signature
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  
  // Return token as payload.signature
  return `${payload}.${signature}`;
}

/**
 * Validate a CSRF token
 * @param {string} token - The token to validate
 * @returns {boolean} True if the token is valid, false otherwise
 */
export function validateCSRFToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Split the token into parts
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  
  const [timestampStr, random, receivedSignature] = parts;
  
  try {
    // Check if token is expired
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp) || timestamp < Date.now()) {
      return false; // Token expired
    }
    
    // Recreate the signature
    const payload = `${timestampStr}.${random}`;
    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    
    // Compare signatures (timing-safe comparison)
    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (err) {
    console.error('CSRF validation error:', err);
    return false;
  }
} 