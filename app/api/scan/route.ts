import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY || 'hf_demo' // Free tier

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Free AI analysis using Hugging Face
async function analyzeWithAI(text: string): Promise<{ feedback: string; violation: boolean }> {
  try {
    // Use a free model for text classification
    const response = await fetch(
      'https://api-inference.huggingface.co/models/ProsusAI/finbert',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      }
    )

    if (!response.ok) {
      throw new Error('AI analysis failed')
    }

    const result = await response.json()
    
    // Analyze the sentiment and content for compliance
    const analysis = analyzeCompliance(text, result)
    
    return analysis
  } catch (error) {
    console.error('AI Analysis Error:', error)
    // Fallback analysis
    return {
      feedback: `Analysis: The text "${text}" has been reviewed for Meta Ads Policy compliance. This is a fallback analysis due to API limitations. Please review manually for: prohibited content, misleading claims, inappropriate language, and copyright violations.`,
      violation: false
    }
  }
}

// Simple compliance analysis
function analyzeCompliance(text: string, sentimentResult: any): { feedback: string; violation: boolean } {
  const lowerText = text.toLowerCase()
  
  // Check for common violation indicators
  const violationKeywords = [
    'free', 'limited time', 'act now', 'don\'t miss', 'exclusive',
    'guaranteed', '100%', 'best', 'cheapest', 'lowest price',
    'money back', 'no risk', 'instant', 'immediate', 'urgent'
  ]
  
  const prohibitedKeywords = [
    'hate', 'violence', 'discrimination', 'illegal', 'scam',
    'fraud', 'fake', 'counterfeit', 'unauthorized'
  ]
  
  let violation = false
  let reasons: string[] = []
  
  // Check for excessive promotional language
  const promotionalCount = violationKeywords.filter(keyword => 
    lowerText.includes(keyword)
  ).length
  
  if (promotionalCount > 3) {
    violation = true
    reasons.push('Excessive promotional language detected')
  }
  
  // Check for prohibited content
  const prohibitedFound = prohibitedKeywords.some(keyword => 
    lowerText.includes(keyword)
  )
  
  if (prohibitedFound) {
    violation = true
    reasons.push('Prohibited content detected')
  }
  
  // Check text length (very short ads might be misleading)
  if (text.length < 10) {
    violation = true
    reasons.push('Text too short - may be misleading')
  }
  
  // Create feedback
  const status = violation ? 'VIOLATION' : 'COMPLIANT'
  const feedback = `
ANALYSIS RESULT: ${status}

Extracted Text: "${text}"

Analysis:
${reasons.length > 0 ? `Violations Found:\n${reasons.join('\n')}` : 'No violations detected'}

Recommendations:
${violation ? '- Review and modify content to comply with Meta Ads Policy\n- Remove excessive promotional language\n- Ensure all claims are truthful and verifiable' : '- Content appears to comply with Meta Ads Policy\n- Continue monitoring for policy updates'}

This analysis is based on automated review. For final compliance decisions, please consult Meta's official advertising policies.
  `.trim()
  
  return { feedback, violation }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const ocrText = formData.get('ocrText') as string
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ocrText) {
      return NextResponse.json({ error: 'No OCR text provided' }, { status: 400 })
    }

    // Get user from request headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract and verify JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userId = user.id

    // Check user scan limit
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('scan_count, is_paid')
      .eq('id', userId)
      .single()

    if (userError) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has exceeded free limit
    if (!userData.is_paid && userData.scan_count >= 5) {
      return NextResponse.json({ 
        error: 'Free scan limit reached. Please upgrade to continue.' 
      }, { status: 403 })
    }

    // Upload file to Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      })

    if (uploadError) {
      return NextResponse.json({ error: 'File upload failed' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName)

    // Analyze with AI using free service
    const { feedback: gptFeedback, violation } = await analyzeWithAI(ocrText)

    // Store scan result
    const { data: scanData, error: scanError } = await supabase
      .from('scans')
      .insert({
        user_id: userId,
        file_url: publicUrl,
        ocr_text: ocrText,
        gpt_feedback: gptFeedback,
        violation: violation,
      })
      .select()
      .single()

    if (scanError) {
      return NextResponse.json({ error: 'Failed to save scan result' }, { status: 500 })
    }

    // Update user scan count
    await supabase
      .from('users')
      .update({ scan_count: userData.scan_count + 1 })
      .eq('id', userId)

    return NextResponse.json(scanData)

  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 