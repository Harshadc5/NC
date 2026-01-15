# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter project name: "nikhil-chaudhari-dental" (or any name you prefer)
4. Disable Google Analytics (optional) or keep it enabled
5. Click "Create project"

## Step 2: Set up Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left menu
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location closest to you (e.g., "asia-south1" for India)
5. Click "Enable"

## Step 3: Configure Firestore Rules

1. Go to the "Rules" tab in Firestore
2. Replace the existing rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to enquiries collection
    match /enquiries/{document=**} {
      // Allow anyone to create enquiries
      allow create: if true;
      // Only allow reading and deleting by authenticated users
      allow read, delete: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

## Step 4: Get Firebase Configuration

1. Click on the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter app nickname: "Dental Website"
6. Click "Register app"
7. You'll see your Firebase configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza....",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 5: Add Configuration to Your Project

1. Open `firebase-config.js` in your project
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
    projectId: "YOUR_ACTUAL_PROJECT_ID",
    storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
    messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
    appId: "YOUR_ACTUAL_APP_ID"
};
```

3. Also update the same configuration in `admin.html` (around line 130)

## Step 6: Enable Google Authentication

1. In Firebase Console, go to "Authentication" in the left menu
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Google"
5. Toggle "Enable"
6. Select a support email
7. Click "Save"

## Step 7: Test Your Setup

1. Go to your website: http://127.0.0.1:8080/index.html
2. Fill out the contact form and submit
3. Open admin page: http://127.0.0.1:8080/admin.html
4. Sign in with your Google account (instamine9@gmail.com)
5. You should see the enquiry in the dashboard!

## Troubleshooting

If you see errors:
- Check browser console (F12)
- Verify your Firebase config is correct
- Make sure Firestore rules are published
- Ensure Google Sign-In is enabled in Firebase Authentication

## Admin Access

Current admin email: instamine9@gmail.com

To add more admins, edit the ADMIN_EMAILS array in admin.html:
```javascript
const ADMIN_EMAILS = ['instamine9@gmail.com', 'another-admin@gmail.com'];
```

## Features

✅ Contact form saves to Firebase Firestore
✅ Opens WhatsApp with enquiry details
✅ Separate admin dashboard (admin.html)
✅ Google Sign-In authentication
✅ Real-time enquiry updates
✅ Search functionality
✅ Export to CSV
✅ Delete enquiries
✅ Reply via WhatsApp directly from dashboard
✅ Statistics (Total, Today, Last 7 days)
