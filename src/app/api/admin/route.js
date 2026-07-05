import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    // The actual password should be set in Vercel Environment Variables as ADMIN_PASSWORD
    const actualPassword = process.env.ADMIN_PASSWORD;
    
    // Fallback protection: if ENV is not set, deny access to be safe
    if (!actualPassword) {
      console.error("ADMIN_PASSWORD environment variable is missing!");
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }
    
    if (password === actualPassword) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
