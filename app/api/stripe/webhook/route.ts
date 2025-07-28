import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const stripeSecretKey = process.env.STRIPE_SECRET_KEY!
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        
        // Update user to paid status
        await supabase
          .from('users')
          .update({ is_paid: true })
          .eq('stripe_customer_id', customerId)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        const deletedCustomerId = deletedSubscription.customer as string
        
        // Update user to unpaid status
        await supabase
          .from('users')
          .update({ is_paid: false })
          .eq('stripe_customer_id', deletedCustomerId)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
} 