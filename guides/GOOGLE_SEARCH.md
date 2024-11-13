# Getting Google Verification Token

## Step 1: Access Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click "Add Property" button

## Step 2: Add Your Property
1. Choose property type:
   - For entire domain: Choose "Domain" property
   - For specific URL: Choose "URL-prefix" property
2. Enter your website URL
   - Format: `https://yourdomain.com`
3. Click "Continue"

## Step 3: Verify Ownership
You'll be presented with several verification methods. The HTML meta tag method is recommended:

1. Choose "HTML tag" verification method
2. You'll receive a meta tag that looks like this:
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_TOKEN" />
```

## Step 4: Implementation
There are two ways to implement this:

### Method 1: Using Next.js Metadata (Recommended)
```typescript
// src/app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  verification: {
    google: 'YOUR_VERIFICATION_TOKEN', // Just the token part, not the entire meta tag
  },
  // ... other metadata
};
```

### Method 2: Direct HTML (Alternative)
```typescript
// src/app/layout.tsx
return (
  <html lang="en">
    <head>
      <meta name="google-site-verification" content="YOUR_VERIFICATION_TOKEN" />
    </head>
    <body>{children}</body>
  </html>
);
```

## Step 5: Verify and Wait
1. Deploy your changes to production
2. Go back to Search Console
3. Click "Verify" button
4. Wait for verification to complete (usually instant)

## Additional Steps After Verification

### Submit Sitemap
1. In Search Console, select your property
2. Go to "Sitemaps" in the left menu
3. Enter your sitemap URL: `https://yourdomain.com/sitemap.xml`
4. Click "Submit"

### Set Up Property Settings
1. Set your preferred domain version (www or non-www)
2. Set geographic targeting if needed
3. Set up users and permissions if needed

### Monitor Search Performance
1. Check "Performance" report regularly
2. Monitor "Coverage" for indexing issues
3. Check "Mobile Usability" for mobile-related issues
4. Set up email notifications for critical issues