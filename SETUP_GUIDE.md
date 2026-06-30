# CourseNet Learning Platform - Setup Guide

## 🚀 Quick Setup for Your Friend

### 1. Install Dependencies
```bash
npm install
```

### 2. Required Environment Variables (.env file)
Create `.env` file with these keys:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/LMS

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SECRET=whsec_your_key_here

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Mux Video Streaming
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret

# UploadThing File Upload
UPLOADTHING_TOKEN=your_uploadthing_token
UPLOADTHING_APP_ID=your_app_id
UPLOADTHING_SECRET=your_secret

# AI Chatbot
GROQ_API_KEY=gsk_your_groq_api_key

# Admin User (SINGLE ADMIN ONLY)
NEXT_PUBLIC_ADMIN_ID=user_your_admin_user_id
```

### 3. External Services Setup

#### Clerk Authentication
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application
3. Get keys from API Keys section
4. Configure webhook URL: `http://localhost:3000/api/webhook`

#### MongoDB Database
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create cluster
3. Get connection string
4. Replace username/password in DATABASE_URL

#### Stripe Payment
1. Account at [Stripe Dashboard](https://dashboard.stripe.com)
2. Get API keys
3. Configure webhook endpoint: `http://localhost:3000/api/webhook`

#### Mux Video
1. Account at [Mux Dashboard](https://dashboard.mux.com)
2. Get access tokens
3. Enable webhooks if needed

#### UploadThing
1. Account at [UploadThing](https://uploadthing.com)
2. Create app
3. Get keys and configure

#### Groq AI (Chatbot)
1. Account at [Groq](https://console.groq.com)
2. Get API key for chatbot

### 4. Run the Project
```bash
npm run dev
```
Visit: http://localhost:3000

### 5. Admin Setup (SINGLE ADMIN ONLY)
1. Create first user account
2. Get user ID from Clerk Dashboard
3. Add to NEXT_PUBLIC_ADMIN_ID in .env (ONLY ONE ID)
4. Restart server
5. Only this specific user will have admin powers

## 📱 What's Included
- ✅ User authentication (Clerk)
- ✅ Course management
- ✅ Payment processing (Stripe)
- ✅ Video streaming (Mux)
- ✅ File uploads (UploadThing)
- ✅ AI chatbot (Groq)
- ✅ Admin panel
- ✅ Responsive design

## 🔧 Troubleshooting
- **MongoDB connection**: Check DATABASE_URL format
- **Clerk auth**: Verify webhook setup
- **Stripe payments**: Test webhook endpoint
- **Chatbot**: Verify GROQ_API_KEY

## 📞 Support
For issues, check console logs and verify all environment variables are correct.
