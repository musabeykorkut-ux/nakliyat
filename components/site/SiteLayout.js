'use client'

import { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import FloatingButtons from './FloatingButtons'

export default function SiteLayout({ children }) {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Settings fetch error:', error)
      }
    }
    fetchSettings()
  }, [])

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
      <FloatingButtons settings={settings} />
    </>
  )
}
