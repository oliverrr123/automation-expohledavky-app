# Fixing reCAPTCHA Enterprise API 403 Error

If you're encountering a `403 Forbidden` error when trying to verify reCAPTCHA tokens, follow these steps to fix the issue:

## Common Causes for 403 Errors

1. **Incorrect API Key**: The API key might be invalid or doesn't have permission to access the reCAPTCHA Enterprise API
2. **Project Configuration**: The Google Cloud project might not be properly set up for reCAPTCHA Enterprise
3. **Billing Issues**: Your Google Cloud account might need to have billing enabled
4. **Domain Restrictions**: The API key might be restricted to certain domains or IPs

## Setup Steps

### 1. Create a Google Cloud Project (if you haven't already)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" at the top and then "New Project"
3. Name your project and click "Create"

### 2. Enable the reCAPTCHA Enterprise API

1. In your Google Cloud Project, go to "APIs & Services" > "Library"
2. Search for "reCAPTCHA Enterprise API"
3. Click on it and press "Enable"

### 3. Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key that is generated
4. Click on the edit pencil icon for the new key to restrict its usage:
   - Under "API restrictions", select "reCAPTCHA Enterprise API"
   - Under "Application restrictions", you can limit to your domains if desired

### 4. Set up a reCAPTCHA Enterprise Site Key

1. Go to "Security" > "reCAPTCHA Enterprise" in the left menu
2. Click "Create Key"
3. Choose "Web" as the platform
4. Select "Score-based key" for invisible reCAPTCHA
5. Enter your domains where the reCAPTCHA will be used
6. Complete the setup and note the site key

### 5. Update Your Environment Variables

In your `.env.local` file:

```
RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_API_KEY=your_api_key
```

### 6. Check Project ID

In your code, you're using:
```
https://recaptchaenterprise.googleapis.com/v1/projects/ex-pohledavky/assessments?key=${process.env.RECAPTCHA_API_KEY}
```

Make sure `ex-pohledavky` is actually your Google Cloud project ID. Replace it with your real project ID.

## Temporary Development Workaround

During development, you can bypass reCAPTCHA verification by setting:

```
SKIP_RECAPTCHA_VERIFICATION=true
```

This will allow your forms to work while you're setting up the proper Google Cloud configuration.

## Additional Troubleshooting

If you're still experiencing issues:

1. Check the Google Cloud Console for any error messages or alerts
2. Verify that billing is enabled for your project
3. Make sure you're using the correct project ID in your API calls
4. Test with a tool like Postman to directly call the API and see detailed error responses
5. Check Google Cloud's [reCAPTCHA Enterprise documentation](https://cloud.google.com/recaptcha-enterprise/docs) for specific requirements 