# AdSafe.ai - Meta Ads Policy Compliance Checker

A full-stack SaaS application that helps advertisers check their ad content for Meta Ads Policy compliance using AI-powered analysis.

## 🚀 Features

- **User Authentication** - Secure email/password login with Supabase Auth
- **File Upload** - Drag & drop interface for images and videos
- **OCR Integration** - Extract text from images using Tesseract.js
- **AI Compliance Analysis** - Free AI-powered analysis using Hugging Face
- **Stripe Integration** - Subscription billing with 5 free scans, then $9/month
- **User Dashboard** - Track scan history and compliance results
- **Real-time Notifications** - Toast alerts for success/failure states

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **AI Analysis**: Hugging Face Inference API (Free)
- **OCR**: Tesseract.js (Client-side)
- **Payments**: Stripe
- **UI Components**: Lucide React Icons, React Hot Toast

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)
- Hugging Face account (free)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd adSafe.ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# AI Service (Free Alternative to OpenAI)
HUGGING_FACE_API_KEY=your_hugging_face_api_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Supabase Database
Run the SQL script in `database-setup.sql` in your Supabase SQL editor:

```sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  scan_count INTEGER DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scans table
CREATE TABLE public.scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  file_url TEXT NOT NULL,
  ocr_text TEXT,
  gpt_feedback TEXT,
  violation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own scans" ON public.scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans" ON public.scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger to create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Set Up Supabase Storage
Create a storage bucket named `uploads` in your Supabase dashboard with public access.

### 6. Get Free AI API Key
1. Go to [Hugging Face](https://huggingface.co/)
2. Create a free account
3. Go to Settings → Access Tokens
4. Create a new token
5. Add it to your `.env.local` as `HUGGING_FACE_API_KEY`

### 7. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
adSafe.ai/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── scan/          # File upload & analysis
│   │   ├── scans/         # Get user scans
│   │   ├── user/stats/    # User statistics
│   │   └── stripe/        # Stripe integration
│   ├── dashboard/         # User dashboard
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── test-ocr/         # OCR testing page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── FileUpload.tsx    # File upload component
│   └── Dashboard.tsx     # Dashboard component
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── utils.ts          # Utility functions
│   └── ocr.ts           # OCR utilities
└── public/              # Static assets
```

## 🔌 API Routes

### POST /api/scan
Upload and analyze a file for compliance.

**Request:**
- `file`: Image/video file
- `ocrText`: Extracted text from client-side OCR
- `Authorization`: Bearer token

**Response:**
```json
{
  "id": "scan-id",
  "file_url": "https://...",
  "ocr_text": "extracted text",
  "gpt_feedback": "AI analysis",
  "violation": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### GET /api/scans
Get user's scan history.

**Headers:**
- `Authorization`: Bearer token

**Response:**
```json
[
  {
    "id": "scan-id",
    "file_url": "https://...",
    "ocr_text": "extracted text",
    "gpt_feedback": "AI analysis",
    "violation": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/user/stats
Get user statistics.

**Headers:**
- `Authorization`: Bearer token

**Response:**
```json
{
  "scan_count": 5,
  "is_paid": false,
  "remaining_scans": 0
}
```

## 🔐 Security Features

- **Row Level Security (RLS)** - Database-level security
- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Client and server-side protection
- **File Type Validation** - Secure file uploads
- **Rate Limiting** - Scan limits per user

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Dark/Light Mode** - CSS variables for theming
- **Loading States** - Smooth user feedback
- **Error Handling** - Graceful error messages
- **Toast Notifications** - Real-time feedback
- **Drag & Drop** - Intuitive file upload

## 💳 Billing Model

- **Free Tier**: 5 scans per user
- **Premium Plan**: $9/month for 100 scans
- **Stripe Integration**: Secure payment processing
- **Webhook Handling**: Automatic subscription management

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
HUGGING_FACE_API_KEY=your_hugging_face_api_key
STRIPE_SECRET_KEY=your_production_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_production_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_production_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔧 Configuration

### Hugging Face API Setup
1. **Free Account**: Sign up at [Hugging Face](https://huggingface.co/)
2. **API Token**: Get your token from Settings → Access Tokens
3. **Model**: Uses FinBERT for sentiment analysis
4. **Fallback**: Custom compliance analysis if API fails

### Supabase Setup
1. **Project**: Create new Supabase project
2. **Database**: Run the SQL setup script
3. **Storage**: Create `uploads` bucket
4. **Auth**: Configure email/password auth
5. **RLS**: Enable Row Level Security

### Stripe Setup
1. **Account**: Create Stripe account
2. **Products**: Create subscription product
3. **Webhooks**: Configure webhook endpoints
4. **Keys**: Get API keys from dashboard

## 🧪 Testing

### OCR Testing
Visit `/test-ocr` to test OCR functionality independently.

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test scan upload
curl -X POST http://localhost:3000/api/scan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image.jpg" \
  -F "ocrText=Sample text"
```

## 🐛 Troubleshooting

### Common Issues

1. **OCR Worker Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Restart dev server: `npm run dev`

2. **Authentication Issues**
   - Check Supabase configuration
   - Verify JWT token in browser dev tools

3. **File Upload Errors**
   - Check Supabase Storage bucket permissions
   - Verify file size limits

4. **AI Analysis Failures**
   - Check Hugging Face API key
   - Verify internet connection
   - Check API rate limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README
- **Issues**: Create GitHub issues
- **Discussions**: Use GitHub discussions
- **Email**: Contact maintainers

## 🔄 Updates

### Recent Changes
- ✅ Replaced OpenAI with Hugging Face (Free)
- ✅ Fixed OCR worker script errors
- ✅ Improved client-side OCR processing
- ✅ Added comprehensive error handling
- ✅ Enhanced UI/UX with better feedback

### Roadmap
- [ ] Video frame extraction
- [ ] Multi-language OCR support
- [ ] Advanced compliance rules
- [ ] Batch processing
- [ ] API rate limiting
- [ ] Advanced analytics dashboard

---

**Built with ❤️ using Next.js, Supabase, and Hugging Face** 