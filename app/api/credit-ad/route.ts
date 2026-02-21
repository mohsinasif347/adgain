import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  // 1. Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rewardAmount = 0.005; // Per ad reward

  // 2. Update Profile Balance (RPC use karna behtar hai, lekin yahan simple update kar rahe hain)
  const { data: profile } = await supabase.from('profiles').select('balance, total_earned').eq('id', user.id).single()
  
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
        balance: (profile?.balance || 0) + rewardAmount,
        total_earned: (profile?.total_earned || 0) + rewardAmount 
    })
    .eq('id', user.id)

  if (updateError) return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 })

  // 3. Log the activity
  await supabase.from('ad_logs').insert({
    user_id: user.id,
    earned_amount: rewardAmount,
    ip_address: '0.0.0.0' // Yahan real IP fetch kar sakte hain
  })

  return NextResponse.json({ success: true, newBalance: (profile?.balance || 0) + rewardAmount })
}