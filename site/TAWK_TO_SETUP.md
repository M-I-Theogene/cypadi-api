# Tawk.to Integration Guide

## Step-by-Step Instructions to Get Your Tawk.to Widget ID

### Step 1: Create a Tawk.to Account

1. Go to [https://www.tawk.to/](https://www.tawk.to/)
2. Click on **"Sign Up Free"** or **"Login"** if you already have an account
3. Complete the registration process

### Step 2: Create a Property

1. After logging in, you'll be prompted to create a **Property**
2. Enter your website name (e.g., "Cypadi Website")
3. Enter your website URL (e.g., "https://cypadi.com")
4. Click **"Continue"**

### Step 3: Create a Chat Widget

1. After creating a property, you'll be asked to create a **Chat Widget**
2. Choose a name for your widget (e.g., "Main Chat Widget")
3. Select the language for your chat widget
4. Click **"Create Widget"**

### Step 4: Get Your Widget IDs

1. Once the widget is created, you'll be redirected to the **Dashboard**
2. Click on **"Administration"** (gear icon) in the left sidebar
3. Click on **"Channels"** → **"Chat Widget"**
4. You should see your widget listed
5. Click on the widget name or **"Setup"** button
6. You'll see a page with installation instructions
7. Look for the embed code that looks like this:

   ```html
   <script type="text/javascript">
     var Tawk_API = Tawk_API || {},
       Tawk_LoadStart = new Date();
     (function () {
       var s1 = document.createElement("script"),
         s0 = document.getElementsByTagName("script")[0];
       s1.async = true;
       s1.src = "https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID";
       s1.charset = "UTF-8";
       s1.setAttribute("crossorigin", "*");
       s0.parentNode.insertBefore(s1, s0);
     })();
   </script>
   ```

8. From this code, extract:
   - **Property ID**: The first part after `tawk.to/` (e.g., `1234567890abcdef`)
   - **Widget ID**: The second part after the slash (e.g., `1a2b3c4d5e6f7g8h`)

### Step 5: Update Your Code

1. Open `src/components/TawkTo.tsx`
2. Find these lines:
   ```typescript
   const TAWK_TO_PROPERTY_ID = "YOUR_PROPERTY_ID";
   const TAWK_TO_WIDGET_ID = "YOUR_WIDGET_ID";
   ```
3. Replace `YOUR_PROPERTY_ID` with your actual Property ID
4. Replace `YOUR_WIDGET_ID` with your actual Widget ID
5. Save the file

### Example:

```typescript
const TAWK_TO_PROPERTY_ID = "1234567890abcdef";
const TAWK_TO_WIDGET_ID = "1a2b3c4d5e6f7g8h";
```

### Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Open your website in a browser
3. You should see the Tawk.to chat widget in the bottom-right corner
4. Click on it to open the chat window

## Alternative Method: Get IDs from Dashboard URL

If you can't find the embed code:

1. Go to your Tawk.to **Dashboard**
2. Click on **"Administration"** → **"Channels"** → **"Chat Widget"**
3. Click on your widget
4. Look at the browser URL - it should contain your IDs:
   ```
   https://dashboard.tawk.to/#/admin/chat-widget/YOUR_PROPERTY_ID/YOUR_WIDGET_ID
   ```

## Change Widget Icon to Default Chat Icon

To change the widget icon from a user avatar to the default chat icon:

1. Go to your **Tawk.to Dashboard**: [https://dashboard.tawk.to/](https://dashboard.tawk.to/)
2. Click on **"Administration"** (gear icon) in the left sidebar
3. Click on **"Channels"** → **"Chat Widget"**
4. Click on your widget name or **"Setup"** button
5. Look for **"Widget Icon"** or **"Icon"** section
6. Select **"Default Chat Icon"** or **"Chat Bubble Icon"** instead of **"User Avatar"** or **"Profile Icon"**
7. Click **"Save"** or **"Update"**
8. The changes should appear on your website immediately (you may need to refresh the page)

**Alternative path:**

- Go to **"Widget"** tab → **"Appearance"** → **"Icon"**
- Select **"Default Chat Icon"**

**Note:** The widget icon cannot be changed programmatically through the API - it must be changed in the Tawk.to dashboard.

## Customization Options

You can customize the Tawk.to widget behavior by modifying the `TawkTo.tsx` component:

### Hide Widget Initially

```typescript
window.Tawk_API.onLoad = function () {
  window.Tawk_API.hideWidget();
};
```

### Show Widget Programmatically

```typescript
window.Tawk_API.showWidget();
```

### Toggle Widget

```typescript
window.Tawk_API.toggle();
```

### Maximize/Minimize Widget

```typescript
window.Tawk_API.maximize();
window.Tawk_API.minimize();
```

## Troubleshooting

### Widget Not Appearing

1. Check that you've replaced both IDs correctly
2. Clear your browser cache and reload
3. Check browser console for any errors
4. Ensure your Property ID and Widget ID are correct (no extra spaces or characters)

### Widget Appearing but Not Working

1. Check your internet connection
2. Verify the IDs are correct in `TawkTo.tsx`
3. Check Tawk.to dashboard to ensure the widget is active

### Need Help?

- Visit Tawk.to documentation: [https://developer.tawk.to/](https://developer.tawk.to/)
- Contact Tawk.to support: [https://www.tawk.to/support/](https://www.tawk.to/support/)
