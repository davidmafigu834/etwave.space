# Mobile White Screen Troubleshooting Guide

## 🚨 IMMEDIATE DIAGNOSTIC STEPS

### 1. Check Mobile Browser Console
**On your mobile device:**
1. Open Chrome/Safari browser
2. Go to: `yourdomain.com`
3. Tap the address bar → type `view-source:yourdomain.com`
4. Look for JavaScript errors

**Alternative:**
- Use desktop Chrome → F12 → toggle device toolbar → refresh
- Check Console tab for errors

### 2. Test Asset Loading on Mobile
**Check these URLs on mobile:**
```
https://yourdomain.com/build/manifest.json
https://yourdomain.com/build/assets/app-*.css
https://yourdomain.com/build/assets/app-*.js
```

### 3. Check Network Tab on Mobile
**In mobile browser:**
1. Open DevTools (if available)
2. Go to Network tab
3. Refresh page
4. Look for failed requests (red entries)

---

## 🔍 COMMON CAUSES & SOLUTIONS

### ❌ CAUSE 1: Missing Viewport Meta Tag
**Problem:** Mobile browsers don't render properly without viewport meta tag.

**Check your HTML head:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Fix:** Add to `resources/js/pages/etwave-landing.tsx` Head section:
```jsx
<Head title="etwave.space - Your Digital Presence Platform">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
</Head>
```

### ❌ CAUSE 2: CSS Not Loading on Mobile
**Problem:** Mobile browsers might block CSS due to security policies.

**Test:** Visit `https://yourdomain.com/build/assets/app-*.css` directly on mobile.
- If it shows raw CSS: CSS loads fine
- If it shows 404/error: CSS path issue

**Fix:** Check if build files exist on server:
```bash
ls -la public/build/assets/
```

### ❌ CAUSE 3: JavaScript Errors on Mobile
**Problem:** Mobile browsers might not support certain JS features.

**Check console for errors like:**
- `SyntaxError: Unexpected token`
- `TypeError: Cannot read property`
- `ReferenceError: xyz is not defined`

**Fix:** Add error boundaries and mobile-safe code.

### ❌ CAUSE 4: Mixed Content (HTTP/HTTPS)
**Problem:** Loading HTTP assets on HTTPS page causes blocking.

**Check for mixed content:**
- All assets must be HTTPS
- No hardcoded `http://` URLs
- Check your `.env` APP_URL is HTTPS

**Fix:** Ensure all URLs are HTTPS.

### ❌ CAUSE 5: Mobile-Specific CSS Issues
**Problem:** Responsive design broken on mobile.

**Check:**
- Viewport width handling
- Flexbox/grid compatibility
- Touch event handling

### ❌ CAUSE 6: Server Configuration Issues
**Problem:** Server not serving assets to mobile devices.

**Check server config:**
- MIME types for mobile browsers
- User-agent handling
- Mobile-specific redirects

---

## 🛠️ QUICK FIXES TO TRY

### Fix 1: Add Mobile-Specific Meta Tags
**File:** `resources/js/pages/etwave-landing.tsx`

```jsx
<Head title="etwave.space - Your Digital Presence Platform">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="theme-color" content="#7c3aed" />
</Head>
```

### Fix 2: Add Mobile-Specific CSS
**File:** Add to your main CSS file:

```css
/* Mobile-specific fixes */
@media screen and (max-width: 768px) {
    body {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
    }

    * {
        -webkit-tap-highlight-color: transparent;
    }
}

/* Ensure background renders on mobile */
body {
    background-attachment: scroll !important;
}
```

### Fix 3: Check for Mobile Browser Detection
**Add to your component:**

```jsx
useEffect(() => {
    // Detect mobile browsers
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        console.log('Mobile device detected');
        // Add mobile-specific logic here
    }
}, []);
```

### Fix 4: Force HTTPS Redirect
**Add to .htaccess:**

```apache
# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 🔬 ADVANCED DIAGNOSTICS

### Test 1: Minimal HTML Test
**Create a test file:** `public/test-mobile.html`

```html
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mobile Test</title>
    <style>
        body { background: red; color: white; font-size: 24px; }
    </style>
</head>
<body>
    <h1>Mobile Test Page</h1>
    <p>If you see this, basic mobile rendering works.</p>
</body>
</html>
```

**Test:** Visit `https://yourdomain.com/test-mobile.html` on mobile.

### Test 2: Asset Loading Test
**Create:** `public/test-assets.php`

```php
<?php
$assets = [
    '/build/manifest.json',
    '/build/assets/app-*.css',
    '/build/assets/app-*.js'
];

foreach ($assets as $asset) {
    $url = 'https://' . $_SERVER['HTTP_HOST'] . $asset;
    $headers = get_headers($url, 1);
    echo "<h3>$asset</h3>";
    echo "<p>Status: " . $headers[0] . "</p>";
    echo "<p>Content-Type: " . ($headers['Content-Type'] ?? 'N/A') . "</p>";
    echo "<hr>";
}
?>
```

### Test 3: JavaScript Console Test
**Add to your component temporarily:**

```jsx
useEffect(() => {
    console.log('Component mounted on:', navigator.userAgent);
    console.log('Viewport:', window.innerWidth, 'x', window.innerHeight);
    console.log('Device pixel ratio:', window.devicePixelRatio);

    // Test asset loading
    const img = new Image();
    img.onload = () => console.log('CSS loaded successfully');
    img.onerror = () => console.log('CSS failed to load');
    img.src = '/build/assets/app-*.css';

    return () => {
        console.log('Component unmounting');
    };
}, []);
```

---

## 📱 MOBILE BROWSER SPECIFIC ISSUES

### iOS Safari Issues:
- **Problem:** Strict security policies
- **Fix:** Ensure all resources are HTTPS, no mixed content

### Android Chrome Issues:
- **Problem:** Memory limitations
- **Fix:** Reduce bundle size, implement code splitting

### Firefox Mobile Issues:
- **Problem:** CSS Grid compatibility
- **Fix:** Use Flexbox fallbacks

---

## 🆘 EMERGENCY FIXES

### If Nothing Else Works:

1. **Clear Mobile Browser Cache:**
   - iOS: Settings → Safari → Clear History and Website Data
   - Android: Chrome → Settings → Privacy → Clear browsing data

2. **Disable JavaScript Temporarily:**
   - Test if basic HTML loads
   - Confirms JS is causing the white screen

3. **Use Incognito/Private Mode:**
   - Tests if it's a cache/cookie issue

4. **Test on Different Networks:**
   - WiFi vs Mobile data
   - Confirms network-related issues

---

## 📞 WHEN TO ASK FOR HELP

**Contact support if:**
- Console shows specific JavaScript errors
- Network tab shows failed asset requests
- Basic HTML test fails
- Issue persists across multiple mobile devices
- Problem occurs on both WiFi and mobile data

**Include in your support request:**
- Mobile device model and OS version
- Browser type and version
- Exact error messages from console
- Network tab screenshots
- Whether incognito mode works

---

**Start with the immediate diagnostic steps above, then work through the fixes systematically!** 🔧📱
