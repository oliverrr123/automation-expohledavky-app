# reCAPTCHA Enterprise Setup

This project uses Google reCAPTCHA Enterprise to protect form submissions. Follow these steps to set up the required environment variables:

## Environment Variables

Add the following variables to your `.env.local` file:

```
RECAPTCHA_SITE_KEY=6LfecQArAAAAAHY4AdWeBS3Ubx5lFH6hI342ZmO8
RECAPTCHA_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Google API key for reCAPTCHA Enterprise.

For development/testing purposes, you can skip the actual verification:

```
SKIP_RECAPTCHA_VERIFICATION=true
```

## Implementation

This project implements reCAPTCHA Enterprise v1 with the following features:

1. **Invisible reCAPTCHA** - Users don't need to click checkboxes or solve puzzles
2. **Action-based verification** - Different form actions are tracked separately
3. **Risk score analysis** - Backend checks risk scores to prevent spam

## How it Works

1. When a form is submitted, reCAPTCHA Enterprise runs in the background to generate a token
2. The token is sent along with the form data to the server
3. The server verifies the token with Google's reCAPTCHA Enterprise API
4. The form submission is only processed if the token is valid and the risk score is acceptable

## Troubleshooting

If you encounter issues with reCAPTCHA:

1. Check browser console for JavaScript errors
2. Make sure your API key is properly set up in the Google Cloud Console
3. Verify your API key and site key in the environment variables
4. Make sure the Content Security Policy (CSP) allows the necessary reCAPTCHA domains
5. Check server logs for API response errors

## Debug Mode

For testing in development:

1. Set `SKIP_RECAPTCHA_VERIFICATION=true` to bypass actual verification
2. Check the server logs to see detailed information about token generation and verification
3. Use browser developer tools to check for any errors in the console

Note that the site key in the code must match a valid site key registered in your Google Cloud project. 