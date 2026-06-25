import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    return NextResponse.json({
      userName: session.metadata?.userName || session.customer_details?.name || 'Anonymous',
      userEmail: session.metadata?.userEmail || session.customer_email || '',
      amount: session.metadata?.amount || (session.amount_total / 100).toString(),
      stripeTransactionId: session.payment_intent,
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
