# AdSafe.ai - AI-Powered Ad Compliance Checker

A full-stack SaaS application that uses AI to check ad images and videos for Meta Ads Policy compliance.
 
## 🚀 Features

- **User Authentication**: Email/password login and registration using Supabase Auth
- **File Upload**: Drag & drop interface for images and videos (up to 10MB)
- **OCR Processing**: Text extraction from images using Tesseract.js
- **AI Analysis**: GPT-4 powered compliance checking against Meta Ads Policy
- **Stripe Integration**: Subscription billing with $9/month premium plan
- **Dashboard**: Complete scan history with detailed results
- **Free Tier**: 5 free scans for new users
- **Premium Tier**: 100 scans per month for paid users

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router & TypeScript
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI GPT-4
- **OCR**: Tesseract.js
- **Payments**: Stripe
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account
- OpenAI API key
- Stripe account
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd adsafe-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

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
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up Supabase Database

Create the following tables in your Supabase project:

#### Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  scan_count INTEGER DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

#### Scans Table
```sql
CREATE TABLE scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  file_url TEXT NOT NULL,
  ocr_text TEXT,
  gpt_feedback TEXT NOT NULL,
  violation BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own scans" ON scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans" ON scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### Storage Bucket
Create a storage bucket named `uploads` with public access for file uploads.

### 5. Set up Stripe

1. Create a Stripe account and get your API keys
2. Create a product and price for the $9/month subscription
3. Set up webhook endpoints for subscription events
4. Add the price ID to your environment variables

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
adsafe-ai/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── register/         # Register page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── Dashboard.tsx     # Dashboard component
│   └── FileUpload.tsx    # File upload component
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
├── middleware.ts         # Next.js middleware
└── package.json          # Dependencies
```

## 🔧 API Routes

- `POST /api/scan` - Upload and analyze files
- `GET /api/scans` - Fetch user's scan history
- `GET /api/user/stats` - Get user statistics
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Backend (Supabase)

1. Set up your Supabase project
2. Run the SQL commands to create tables
3. Configure storage buckets
4. Set up authentication providers

### Stripe Webhook

1. Create a webhook endpoint in Stripe dashboard
2. Point it to `https://your-domain.com/api/stripe/webhook`
3. Add the webhook secret to your environment variables

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- Protected API routes with authentication
- Secure file uploads with size limits
- Environment variable protection
- Stripe webhook signature verification

## 🎨 UI/UX Features

- Responsive design with TailwindCSS
- Dark/light mode support
- Loading states and error handling
- Toast notifications
- Drag & drop file upload
- Interactive dashboard with scan history

## 📊 Database Schema

### Users Table
- `id` (UUID) - Primary key, references auth.users
- `email` (TEXT) - User email
- `scan_count` (INTEGER) - Number of scans used
- `is_paid` (BOOLEAN) - Premium subscription status
- `stripe_customer_id` (TEXT) - Stripe customer ID
- `created_at` (TIMESTAMP) - Account creation date

### Scans Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `file_url` (TEXT) - Supabase storage URL
- `ocr_text` (TEXT) - Extracted text from file
- `gpt_feedback` (TEXT) - AI analysis result
- `violation` (BOOLEAN) - Compliance violation flag
- `created_at` (TIMESTAMP) - Scan creation date

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@adsafe.ai or create an issue in the repository. 