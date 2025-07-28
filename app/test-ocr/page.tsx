'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'

export default function TestOCRPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setLoading(true)
    setResult('')

    try {
      // Test OCR directly with minimal configuration
      const Tesseract = (await import('tesseract.js')).default
      
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: (m: any) => {
          // Only log important messages to avoid console spam
          if (m.status === 'recognizing text' || m.status === 'done') {
            console.log('OCR Status:', m.status)
          }
        }
      })
      
      setResult(text.trim() || 'No text detected')
    } catch (error) {
      console.error('OCR Error:', error)
      setResult('OCR processing failed: ' + error)
    } finally {
      setLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    maxFiles: 1
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">OCR Test Page</h1>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="flex justify-center">
              {loading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              ) : (
                <Upload className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {loading ? 'Processing OCR...' : 'Drop an image here to test OCR'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports images with text
              </p>
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">OCR Result</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{result}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 