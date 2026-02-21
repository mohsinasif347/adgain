import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname

  // 1. Log start of request
  console.log(`\n--- [Middleware Start] Path: ${path} ---`)

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 2. Session check karein
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) {
    console.log(`[Middleware] Auth Error: ${authError.message}`)
  }

  const isLoginPage = path === '/'
  const isAdminPage = path.startsWith('/admin')
  const isUserDashboard = path.startsWith('/dashboard')

  // Case A: User logged in nahi hai
  if (!user) {
    console.log(`[Middleware] No user found.`)
    if (isAdminPage || isUserDashboard) {
      console.log(`[Middleware] Unauthorized access to ${path}. Redirecting to /`)
      return NextResponse.redirect(new URL('/', request.url))
    }
    return response
  }

  console.log(`[Middleware] User Logged In: ${user.email} (ID: ${user.id})`)

  // Case B: User logged in hai, role fetch karein
  try {
    console.log(`[Middleware] Fetching profile from DB for ID: ${user.id}...`)
    
    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (dbError) {
      console.log(`[Middleware] Database Error: ${dbError.message}`)
      console.log(`[Middleware] Full DB Error Object:`, JSON.stringify(dbError))
    }

    const isAdmin = !dbError && profile?.is_admin === true
    console.log(`[Middleware] Profile Found:`, profile)
    console.log(`[Middleware] Result -> isAdmin: ${isAdmin}`)

    // 3. Logic Checks
    if (isAdminPage && !isAdmin) {
      console.log(`[Middleware] Restricted! User is NOT admin. Redirecting to /dashboard`)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (isLoginPage) {
      const targetPath = isAdmin ? '/admin' : '/dashboard'
      console.log(`[Middleware] User is on login page. Auto-redirecting to: ${targetPath}`)
      return NextResponse.redirect(new URL(targetPath, request.url))
    }

    console.log(`[Middleware] Access Granted for path: ${path}`)

  } catch (err) {
    console.error("[Middleware Exception]:", err)
    if (isAdminPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  console.log(`--- [Middleware End] ---\n`)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}