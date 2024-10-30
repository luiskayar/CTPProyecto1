import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    console.log('Credenciales recibidas:', { username, password }) // Para depuración

    // Verifica las credenciales
    if (username === 'Supervisor!' && password === 'Supervisor!') {
      // Login exitoso
      cookies().set('auth', 'true', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      console.log('Login exitoso') // Para depuración
      return NextResponse.json({ success: true, message: 'Login exitoso' })
    } else {
      // Credenciales incorrectas
      console.log('Credenciales incorrectas') // Para depuración
      return NextResponse.json(
        { success: false, message: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Error en el servidor durante el login:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}