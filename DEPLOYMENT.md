# AdSafe.ai Deployment Guide

This guide will walk you through deploying AdSafe.ai to production using Vercel for the frontend and Supabase for the backend.

## 🚀 Prerequisites

- GitHub account
- Vercel account
- Supabase account
- Stripe account
- OpenAI API key

## 📋 Step 1: Set up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and API keys

### 1.2 Set up Database

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the contents of `database-setup.sql` file
4. This will create all necessary tables and policies

### 1.3 Configure Storage

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `uploads`
3. Set the bucket to public access
4. Configure CORS if needed

### 1.4 Set up Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your site URL (your Vercel domain)
3. Add redirect URLs for authentication

## 📋 Step 2: Set up Stripe

### 2.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from the dashboard

### 2.2 Create Product and Price

1. Go to Products in your Stripe dashboard
2. Create a new product called "AdSafe.ai Premium"
3. Add a recurring price of $9/month
4. Note down the price ID

### 2.3 Set up Webhooks

1. Go to Webhooks in your Stripe dashboard
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret

## 📋 Step 3: Deploy to Vercel

### 3.1 Prepare Repository

1. Push your code to GitHub
2. Make sure all environment variables are documented in `.env.local.example`

### 3.2 Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and create an account
2. Import your GitHub repository
3. Configure the project settings

### 3.3 Add Environment Variables

Add these environment variables in your Vercel project settings:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 3.4 Deploy

1. Vercel will automatically deploy your application
2. Check the deployment logs for any errors
3. Test the application functionality

## 📋 Step 4: Configure Domains

### 4.1 Custom Domain (Optional)

1. In your Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Update your Supabase authentication settings with the new domain
4. Update your Stripe webhook endpoint with the new domain

### 4.2 Update Environment Variables

After setting up your custom domain, update the `NEXT_PUBLIC_APP_URL` environment variable in Vercel.

## 📋 Step 5: Testing

### 5.1 Test Authentication

1. Visit your deployed application
2. Try to register a new account
3. Verify email confirmation works
4. Test login functionality

### 5.2 Test File Upload

1. Log in to your application
2. Upload an image file
3. Verify OCR and AI analysis work
4. Check that results are saved to the database

### 5.3 Test Stripe Integration

1. Try to upgrade to premium (use Stripe test cards)
2. Verify webhook events are received
3. Check that user status updates correctly

## 📋 Step 6: Monitoring and Maintenance

### 6.1 Set up Monitoring

1. Enable Vercel Analytics
2. Set up error tracking (e.g., Sentry)
3. Monitor Supabase usage and limits

### 6.2 Regular Maintenance

1. Keep dependencies updated
2. Monitor API usage and costs
3. Backup database regularly
4. Review and update security policies

## 🔧 Troubleshooting

### Common Issues

1. **Authentication not working**: Check Supabase URL and API keys
2. **File uploads failing**: Verify storage bucket configuration
3. **Stripe webhooks not working**: Check webhook endpoint URL and secret
4. **OCR not working**: Verify OpenAI API key and usage limits

### Debug Steps

1. Check Vercel deployment logs
2. Monitor Supabase logs
3. Test API endpoints directly
4. Verify environment variables are set correctly

## 🚀 Production Checklist

- [ ] Supabase project configured
- [ ] Database tables created
- [ ] Storage bucket set up
- [ ] Authentication configured
- [ ] Stripe account set up
- [ ] Webhooks configured
- [ ] Vercel deployment successful
- [ ] Environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] All features tested
- [ ] Monitoring set up
- [ ] SSL certificate active
- [ ] Error tracking configured

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review Vercel and Supabase documentation
3. Check the application logs
4. Create an issue in the repository

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive keys to version control
2. **Row Level Security**: Ensure RLS policies are properly configured
3. **API Rate Limiting**: Consider implementing rate limiting for API routes
4. **File Upload Security**: Validate file types and sizes
5. **Webhook Security**: Verify Stripe webhook signatures

## 📊 Performance Optimization

1. **Image Optimization**: Use Next.js Image component
2. **Database Indexing**: Ensure proper indexes are created
3. **CDN**: Vercel provides global CDN automatically
4. **Caching**: Implement appropriate caching strategies
5. **Bundle Size**: Monitor and optimize JavaScript bundle size 