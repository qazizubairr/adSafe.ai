import Link from 'next/link'
import { Shield, Zap, BarChart3, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AdSafe.ai</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered
            <span className="text-blue-600"> Ad Compliance</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your ad images and videos to instantly check for Meta Ads Policy violations. 
            Our advanced AI analyzes text, imagery, and content to ensure your ads meet compliance standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose AdSafe.ai?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced AI technology combined with comprehensive policy knowledge to keep your ads compliant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Analysis</h3>
            <p className="text-gray-600">
              Get compliance results in seconds with our advanced OCR and AI analysis technology.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Policy Compliance</h3>
            <p className="text-gray-600">
              Comprehensive coverage of Meta Ads Policy including text, imagery, and content guidelines.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Reports</h3>
            <p className="text-gray-600">
              Get detailed analysis reports with specific violation explanations and recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple three-step process to ensure your ads are compliant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4">
              <span className="text-white text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload</h3>
            <p className="text-gray-600">
              Upload your ad image or video file (up to 10MB)
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4">
              <span className="text-white text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyze</h3>
            <p className="text-gray-600">
              Our AI extracts text and analyzes content for policy violations
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4">
              <span className="text-white text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Review</h3>
            <p className="text-gray-600">
              Get instant results with detailed compliance feedback
            </p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you need more scans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
            <p className="text-gray-600 mb-6">Perfect for getting started</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                5 free scans
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Basic compliance check
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Email support
              </li>
            </ul>
            <Link
              href="/register"
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors block text-center"
            >
              Get Started Free
            </Link>
          </div>

          <div className="bg-white rounded-lg border-2 border-blue-600 p-8 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
            <p className="text-gray-600 mb-6">For serious advertisers</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$9</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                100 scans per month
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Advanced AI analysis
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Priority support
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Detailed reports
              </li>
            </ul>
            <Link
              href="/register"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors block text-center"
            >
              Start Premium Trial
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">AdSafe.ai</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered ad compliance checking for Meta Ads Policy
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 