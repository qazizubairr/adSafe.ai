'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate, truncateText } from '@/lib/utils'
import { CheckCircle, AlertCircle, Eye, Download } from 'lucide-react'
import toast from 'react-hot-toast'

interface Scan {
  id: string
  file_url: string
  ocr_text: string
  gpt_feedback: string
  violation: boolean
  created_at: string
}

interface UserStats {
  scan_count: number
  is_paid: boolean
}

export default function Dashboard() {
  const [scans, setScans] = useState<Scan[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, getSessionToken } = useAuth()

  useEffect(() => {
    if (user) {
      fetchScans()
      fetchUserStats()
    }
  }, [user])

  const fetchScans = async () => {
    try {
      const token = getSessionToken()
      const response = await fetch('/api/scans', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setScans(data)
      }
    } catch (error) {
      toast.error('Failed to load scans')
    }
  }

  const fetchUserStats = async () => {
    try {
      const token = getSessionToken()
      const response = await fetch('/api/user/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUserStats(data)
      }
    } catch (error) {
      toast.error('Failed to load user stats')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      const token = getSessionToken()
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        toast.error('Failed to create checkout session')
      }
    } catch (error) {
      toast.error('Failed to upgrade account')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Scans</h3>
          <p className="text-2xl font-bold text-gray-900">{userStats?.scan_count || 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
          <p className="text-2xl font-bold text-gray-900">
            {userStats?.is_paid ? 'Premium' : 'Free'}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Remaining Scans</h3>
          <p className="text-2xl font-bold text-gray-900">
            {userStats?.is_paid ? 'Unlimited' : Math.max(0, 5 - (userStats?.scan_count || 0))}
          </p>
        </div>
      </div>

      {/* Upgrade Banner */}
      {!userStats?.is_paid && userStats?.scan_count >= 5 && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
              <p className="text-blue-100">Get unlimited scans for just $9/month</p>
            </div>
            <button
              onClick={handleUpgrade}
              className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Scans Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Scan History</h2>
        </div>
        
        {scans.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No scans yet. Upload your first file to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Extracted Text
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden">
                          {scan.file_url.includes('image') ? (
                            <img
                              src={scan.file_url}
                              alt="File preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <span className="text-gray-400 text-xs">VIDEO</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900">
                          {truncateText(scan.ocr_text, 50)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center space-x-2 ${
                        scan.violation ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {scan.violation ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {scan.violation ? 'Violation' : 'Compliant'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(scan.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(scan.file_url, '_blank')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <a
                          href={scan.file_url}
                          download
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 