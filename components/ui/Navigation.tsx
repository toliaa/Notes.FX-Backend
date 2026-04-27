'use client'

import { useState, useEffect } from 'react'

const sections = [
  { id: 'overview', title: 'Огляд системи' },
  { id: 'high-level', title: 'Архітектура високого рівня' },
  { id: 'modules', title: 'Модульна архітектура' },
  { id: 'users-module', title: 'Модуль Users' },
  { id: 'notes-module', title: 'Модуль Notes' },
  { id: 'community-module', title: 'Модуль Community' },
  { id: 'er-diagram', title: 'ER-Діаграма' },
  { id: 'data-flow', title: 'Потік даних' },
  { id: 'auth-flow', title: 'JWT Автентифікація' },
  { id: 'ai-integration', title: 'AI Інтеграція' },
  { id: 'api-endpoints', title: 'API Endpoints' },
  { id: 'technologies', title: 'Технології' },
]

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('overview')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1e293b] rounded-lg border border-[#27272a]"
        aria-label="Toggle navigation"
      >
        <svg className="w-6 h-6 text-[#fafafa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Navigation sidebar */}
      <nav className={`
        fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] border-r border-[#27272a] z-40
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-[#27272a]">
          <h1 className="text-lg font-bold text-[#fafafa]">Notes.FX</h1>
          <p className="text-sm text-[#64748b]">Архітектура системи</p>
        </div>
        
        <div className="p-4 overflow-y-auto h-[calc(100vh-100px)]">
          <ul className="space-y-1">
            {sections.map(({ id, title }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setIsOpen(false)}
                  className={`
                    block px-3 py-2 rounded-lg text-sm transition-colors
                    ${activeSection === id 
                      ? 'bg-[#3b82f6]/10 text-[#3b82f6] font-medium' 
                      : 'text-[#94a3b8] hover:text-[#fafafa] hover:bg-[#1e293b]'
                    }
                  `}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
