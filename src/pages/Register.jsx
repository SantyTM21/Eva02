import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const validate = () => {
    if (!fullName.trim()) return 'Ingresa tu nombre completo.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Correo inválido.'
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
    return null
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const v = validate()
    if (v) {
      setError(v)
      return
    }

    try {
      setLoading(true)
      const { data, error: authErr } = await supabase.auth.signUp({ email, password })
      if (authErr) {
        setError(authErr.message)
        return
      }
      if (data.user) {
        const { error: profileErr } = await supabase
          .from('profiles')
          .upsert({ id: data.user.id, full_name: fullName })
        if (profileErr) {
          // No bloquea la navegación, solo informa
          console.warn(profileErr)
        }
      }
      nav('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-100 to-orange-200'>
      <form
        onSubmit={onSubmit}
        className='w-full max-w-md rounded-2xl border border-orange-200 bg-white p-8 shadow-xl'
        noValidate
      >
        <h1 className='text-2xl font-semibold text-orange-700 text-center'>Crear cuenta</h1>
        <p className='mt-1 text-sm text-gray-600 text-center'>
          ¿Ya tienes una?{' '}
          <Link className='font-medium text-orange-600 hover:underline' to='/login'>
            Entrar
          </Link>
        </p>

        {error && (
          <div
            role='alert'
            aria-live='polite'
            className='mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700'
          >
            {error}
          </div>
        )}

        <div className='mt-6 space-y-4'>
          <div>
            <label htmlFor='fullName' className='mb-1 block text-sm font-medium text-orange-700'>
              Nombre completo
            </label>
            <input
              id='fullName'
              name='fullName'
              autoComplete='name'
              className='w-full rounded-lg border border-orange-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor='email' className='mb-1 block text-sm font-medium text-orange-700'>
              Correo
            </label>
            <input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              inputMode='email'
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
                name='password'
                type={showPwd ? 'text' : 'password'}
                autoComplete='new-password'
                className='w-full rounded-lg border border-orange-300 bg-white px-3 py-2 pr-10 text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <button
                type='button'
                onClick={() => setShowPwd((s) => !s)}
                className='absolute inset-y-0 right-2 my-auto text-xs text-orange-600 hover:text-orange-700'
                aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPwd ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            <p className='mt-1 text-xs text-gray-500'>
              Mínimo 8 caracteres. Evita usar datos obvios.
            </p>
          </div>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='mt-6 w-full rounded-lg bg-orange-600 px-4 py-2.5 font-medium text-white transition hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:opacity-60'
        >
          {loading ? 'Creando…' : 'Registrarme'}
        </button>

        <p className='mt-4 text-center text-sm text-gray-600'>
          Al registrarte, aceptas nuestros{' '}
          <a
            href='/terms'
            className='text-orange-600 underline underline-offset-2 hover:opacity-80'
          >
            Términos
          </a>
          .
        </p>
      </form>
    </div>
  )
}
