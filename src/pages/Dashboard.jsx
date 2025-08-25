// TalleresGrid.jsx (JS)
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

import { DATA as items } from '../constants/talleres_data'

export default function Dashboard() {
  const list = useMemo(() => items, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <section className='mx-auto max-w-7xl p-6 bg-gradient-to-b from-orange-100 to-orange-200'>
      <header className='mb-6'>
        <h1 className='text-center text-3xl font-bold text-orange-700'>Ciudadanos en acción</h1>
        <button
          onClick={handleLogout}
          className='fixed top-6 right-4 text-sm text-orange-700 underline hover:text-orange-900'
        >
          Cerrar sesión
        </button>
        <h2 className='mt-2 text-2xl font-semibold text-gray-800 text-center'>
          Talleres y cursos gratuitos
        </h2>
        <p className='mt-1 text-sm text-gray-600 text-center'>
          Formación práctica para comunidades.
        </p>
      </header>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {list.map((t) => (
          <article
            key={t.id}
            className='group relative overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-md transition hover:shadow-lg'
          >
            <div className='relative aspect-[4/3] w-full overflow-hidden'>
              <img
                src={t.img || 'https://via.placeholder.com/800x600?text=Taller'}
                alt={t.titulo}
                className='h-full w-full object-cover transition duration-300 group-hover:scale-105'
                loading='lazy'
              />
              <span className='absolute left-3 top-3 rounded-full bg-orange-600 px-2 py-1 text-[11px] font-semibold text-white'>
                GRATIS
              </span>
            </div>

            <div className='p-4'>
              <h3 className='line-clamp-2 text-base font-semibold text-orange-700'>{t.titulo}</h3>
              <p className='mt-1 line-clamp-2 text-sm text-gray-600'>{t.desc}</p>

              <div className='mt-3 text-xs text-gray-500'>
                <p className='truncate'>📅 {t.fecha}</p>
                <p className='truncate'>📍 {t.lugar}</p>
              </div>

              <div className='mt-3 flex flex-wrap gap-1.5'>
                {t.tags?.map((tag) => (
                  <span
                    key={tag}
                    className='rounded-full border border-orange-300 px-2 py-0.5 text-[11px] text-orange-700'
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className='mt-4 flex items-center gap-2'>
                <Link
                  to={`/taller/${t.id}`}
                  className='inline-flex flex-1 items-center justify-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-300'
                >
                  Ver detalles
                </Link>
                <button
                  type='button'
                  className='rounded-lg border border-orange-300 px-3 py-2 text-sm text-orange-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300'
                  onClick={() => alert('Preinscripción registrada')}
                >
                  Preinscribirme
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <footer className='mt-6 text-center text-sm text-gray-500'>
        <p>© 2025 Innova Digital Solutions. Todos los derechos reservados.</p>
      </footer>
    </section>
  )
}
