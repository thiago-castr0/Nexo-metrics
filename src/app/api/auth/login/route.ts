import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    let user = null;

    if (username === 'admin_master' && password === 'admin123') {
      user = { username, role: 'admin', name: 'Admin User' };
    } else if (username === 'prometheus' && password === 'prometheus123') {
      user = { username, role: 'prometheus', name: 'Prometheus' };
    }

    if (user) {
      const response = NextResponse.json({ success: true, user });
      response.cookies.set({
        name: 'auth_user',
        value: JSON.stringify(user),
        httpOnly: false,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return response;
    }

    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
