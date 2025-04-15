/**
 * Hook for generating reCAPTCHA v3 tokens
 */

// Get the site key from environment variables
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

// Add type declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/**
 * Hook for generating reCAPTCHA v3 tokens
 * @param action - The action name to associate with token generation
 * @returns A function that generates and returns a reCAPTCHA token
 */
export async function generateRecaptchaToken(action: string): Promise<string> {
  try {
    // Check if reCAPTCHA is available
    if (!window.grecaptcha) {
      console.error("reCAPTCHA not loaded");
      return "";
    }

    // Generate token
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
          resolve(token);
        } catch (error) {
          console.error("reCAPTCHA execution error:", error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("reCAPTCHA error:", error);
    return "";
  }
}

export default generateRecaptchaToken; 