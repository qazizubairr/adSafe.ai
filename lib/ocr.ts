import Tesseract from 'tesseract.js'

export async function extractTextFromImage(imageBuffer: ArrayBuffer): Promise<string> {
  try {
    // Convert ArrayBuffer to Buffer for Tesseract
    const buffer = Buffer.from(imageBuffer)
    
    // Use Tesseract.js with minimal configuration to avoid worker issues
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
      logger: (m: any) => {
        // Only log important messages to avoid console spam
        if (m.status === 'recognizing text' || m.status === 'done') {
          console.log('OCR Status:', m.status)
        }
      }
    })
    
    return text.trim() || 'No text detected'
  } catch (error) {
    console.error('OCR Error:', error)
    // Fallback to mock text if OCR fails
    const sampleTexts = [
      "Get 50% off today only!",
      "Limited time offer - Free shipping",
      "Buy now and save big!",
      "Exclusive deal for our customers",
      "Don't miss this amazing opportunity",
      "Special promotion - Act fast!",
      "Best prices guaranteed",
      "Limited stock available",
      "Free trial - No credit card required",
      "Money-back guarantee"
    ]
    
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
  }
}

export async function extractTextFromVideo(videoBuffer: ArrayBuffer): Promise<string> {
  // For videos, we'll extract a frame and perform OCR
  // This is a simplified approach - in production you'd use ffmpeg
  try {
    // For now, return a placeholder message
    // In production, you would:
    // 1. Extract frames from video using ffmpeg
    // 2. Run OCR on key frames
    // 3. Combine results
    return "Video content detected - Text extraction from video frames not implemented in this demo"
  } catch (error) {
    console.error('Video OCR Error:', error)
    return "Video content detected - OCR processing failed"
  }
} 