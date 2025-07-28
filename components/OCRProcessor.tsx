'use client'

import { useState } from 'react'

interface OCRProcessorProps {
  onTextExtracted: (text: string) => void
  onError: (error: string) => void
}

export default function OCRProcessor({ onTextExtracted, onError }: OCRProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const processImage = async (file: File) => {
    setIsProcessing(true)
    
    try {
      // Dynamically import Tesseract to avoid SSR issues
      const Tesseract = (await import('tesseract.js')).default
      
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: (m: any) => {
          // Only log important messages to avoid console spam
          if (m.status === 'recognizing text' || m.status === 'done') {
            console.log('OCR Status:', m.status)
          }
        }
      })
      
      onTextExtracted(text.trim() || 'No text detected')
    } catch (error) {
      console.error('OCR Error:', error)
      onError('OCR processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return { processImage, isProcessing }
} 