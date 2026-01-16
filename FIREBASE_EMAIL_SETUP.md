# Firebase Email Authentication Setup Guide

## Important: Configure Firebase for Password Reset Emails

For the password reset functionality to work properly, you need to configure Firebase Authentication in the Firebase Console.

### Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **n--c-3dceb**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Email/Password**
5. Enable **Email/Password** (toggle switch)
6. Click **Save**

### Step 2: Configure Email Templates

1. In Firebase Console, go to **Authentication** → **Templates**
2. Click on **Password reset** email template
3. Customize the email template (optional):
   - **From name**: Nikhil Chaudhari Dental Clinic
   - **Reply-to email**: instamine9@gmail.com
   - **Subject**: Reset your password
   - **Body**: You can customize the message
4. Click **Save**

### Step 3: Verify Authorized Domains

1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Make sure these domains are added:
   - `localhost` (for testing)
   - `127.0.0.1` (for testing)
   - Your production domain (e.g., `yourwebsite.com`)
   - Your Vercel domain (if deployed)

### Step 4: Test Password Reset

1. Create a test account with email/password
2. Click "Forgot Password?" link
3. Enter the test email
4. Check if you receive the password reset email
5. Check spam folder if not in inbox

### Common Issues & Solutions

#### Issue 1: "Email not sent" or no email received
**Solution**: 
- Verify Email/Password authentication is enabled in Firebase Console
- Check spam/junk folder
- Verify the email address is registered in Firebase Authentication
- Check Firebase Console → Authentication → Users to see registered users

#### Issue 2: "User not found" error
**Solution**:
- The email must be registered with Email/Password sign-in method
- Google sign-in users need to use "Sign in with Google" (can't reset password)
- Check Firebase Console → Authentication → Users to verify the account exists

#### Issue 3: Email takes long to arrive
**Solution**:
- Firebase emails typically arrive within 1-2 minutes
- Check spam/junk folder
- Try with a different email provider (Gmail, Outlook, etc.)
- Wait up to 5 minutes before trying again

#### Issue 4: "Too many requests" error
**Solution**:
- Firebase limits password reset attempts to prevent abuse
- Wait 15 minutes before trying again
- Use a different email address for testing

### Email Provider Recommendations

**Best for receiving Firebase emails:**
- ✅ Gmail (best compatibility)
- ✅ Outlook/Hotmail
- ✅ Yahoo Mail
- ⚠️ Custom domain emails (may go to spam)

### Firebase Security Rules

Make sure your Firebase security rules allow password reset:
```javascript
// This is handled automatically by Firebase Authentication
// No additional rules needed for password reset
```

### Testing Checklist

- [ ] Email/Password authentication enabled in Firebase Console
- [ ] Test account created with email/password
- [ ] Password reset email template configured
- [ ] Authorized domains added
- [ ] Tested with multiple email providers
- [ ] Checked spam folder
- [ ] Verified reset link works

### Support

If issues persist:
1. Check Firebase Console logs
2. Open browser console for error messages
3. Verify Firebase configuration in `firebase-config.js`
4. Contact Firebase Support if needed

### Production Deployment

Before deploying to production:
1. Add your production domain to Authorized Domains
2. Update email template with production links
3. Test password reset on production
4. Set up custom email domain (optional, requires Firebase Blaze plan)

---

**Note**: The improved password reset function now:
- ✅ Checks if user exists before sending email
- ✅ Shows clear error messages
- ✅ Validates email format
- ✅ Handles all Firebase error codes
- ✅ Provides helpful instructions
