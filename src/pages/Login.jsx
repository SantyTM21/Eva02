import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!email || !password) return setError('Completa todos los campos.')

    try {
      setLoading(true)
      const { error: signErr } = await supabase.auth.signInWithPassword({ email, password })
      if (signErr) return setError(signErr.message)
      nav('/dashboard')
    } catch {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-100 to-orange-200'>
      <form
        onSubmit={onSubmit}
        noValidate
        className='w-full max-w-md rounded-2xl border border-orange-200 bg-white p-8 shadow-xl'
      >
        <h1 className='text-2xl font-semibold text-orange-700 text-center'>Iniciar sesión</h1>
        <p className='mt-1 text-sm text-gray-600 text-center'>
          ¿No tienes cuenta?{' '}
          <Link className='font-medium text-orange-600 hover:underline' to='/register'>
            Regístrate
          </Link>
        </p>

        {error && (
          <div className='mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </div>
        )}

        <div className='mt-6 space-y-4'>
          <div>
            <label htmlFor='email' className='mb-1 block text-sm font-medium text-orange-700'>
              Correo
            </label>
            <input
              id='email'
              type='email'
              className='w-full rounded-lg border border-orange-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor='password' className='mb-1 block text-sm font-medium text-orange-700'>
              Contraseña
            </label>
            <div className='relative'>
              <input
                id='password'
                type={showPwd ? 'text' : 'password'}
                className='w-full rounded-lg border border-orange-300 bg-white px-3 py-2 pr-10 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type='button'
                onClick={() => setShowPwd((s) => !s)}
                className='absolute inset-y-0 right-2 my-auto text-xs text-orange-600 hover:text-orange-700'
              >
                {showPwd ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='mt-6 w-full rounded-lg bg-orange-600 px-4 py-2.5 font-medium text-white transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:opacity-60'
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>

        <div className='mt-4 text-center'>
          <Link to='/forgot-password' className='text-sm text-orange-600 hover:underline'>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
    </div>
  )
}
