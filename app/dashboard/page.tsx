'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Shield, Upload, BarChart3, LogOut } from 'lucide-react'
import FileUpload from '@/components/FileUpload'
import Dashboard from '@/components/Dashboard'
import { useState } from 'react'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload')

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AdSafe.ai</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload & Scan
                </div>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Scan History
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'upload' ? (
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload & Scan
                </h1>
                <p className="text-gray-600">
                  Upload your ad images or videos to check for Meta Ads Policy compliance.
                </p>
              </div>
              <FileUpload />
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Scan History
                </h1>
                <p className="text-gray-600">
                  View your previous scans and compliance results.
                </p>
              </div>
              <Dashboard />
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 