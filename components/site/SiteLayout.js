'use client'

import { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import FloatingButtons from './FloatingButtons'

export default function SiteLayout({ children }) {
  const [settings, setSettings] = useState(null)
  const [services, setServices] = useState([])
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, servicesRes, locationsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/services'),
          fetch('/api/locations')
        ])
        const [settingsData, servicesData, locationsData] = await Promise.all([
          settingsRes.json(),
          servicesRes.json(),
          locationsRes.json()
        ])
        if (settingsData) setSettings(settingsData)
        if (Array.isArray(servicesData)) setServices(servicesData)
        if (Array.isArray(locationsData)) setLocations(locationsData)
      } catch (error) {
        console.error('Layout data fetch error:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Header settings={settings} services={services} locations={locations} />
      <main className="flex-1">
        {children}
      </main>
      <Footer settings={settings} services={services} locations={locations} />
      <FloatingButtons settings={settings} />
    </>
  )
}
