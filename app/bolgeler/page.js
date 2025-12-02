'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, ArrowRight, Phone } from 'lucide-react'

const defaultLocations = [
  { id: '1', name: 'Sarıçam', slug: 'saricam', short_description: 'Sarıçam ilçesinde evden eve nakliyat hizmeti' },
  { id: '2', name: 'Çukurova', slug: 'cukurova', short_description: 'Çukurova ilçesinde evden eve nakliyat hizmeti' },
  { id: '3', name: 'Seyhan', slug: 'seyhan', short_description: 'Seyhan ilçesinde evden eve nakliyat hizmeti' },
  { id: '4', name: 'Yüreğir', slug: 'yuregir', short_description: 'Yüreğir ilçesinde evden eve nakliyat hizmeti' },
  { id: '5', name: 'Ceyhan', slug: 'ceyhan', short_description: 'Ceyhan ilçesinde evden eve nakliyat hizmeti' },
]

export default function LocationsPage() {
  const [locations, setLocations] = useState(defaultLocations)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, settingsRes] = await Promise.all([
          fetch('/api/locations'),
          fetch('/api/settings')
        ])
        const [locationsData, settingsData] = await Promise.all([
          locationsRes.json(),
          settingsRes.json()
        ])
        if (Array.isArray(locationsData) && locationsData.length) setLocations(locationsData)
        if (settingsData) setSettings(settingsData)
      } catch (error) {
        console.error('Data fetch error:', error)
      }
    }
    fetchData()
  }, [])

  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'

  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: 'Hizmet Bölgeleri' }]} />

      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Hizmet Bölgelerimiz</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Adana ve çevresinde evden eve nakliyat hizmeti verdiğimiz bölgeler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <Card key={location.id || location.slug} className="group hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <MapPin className="h-7 w-7 text-primary group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl">{location.name} Nakliyat</CardTitle>
                  <CardDescription>{location.short_description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/bolgeler/${location.slug}`}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white">
                      Detaylı Bilgi <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Bölgenizde Hizmet Alın</h2>
            <p className="text-white/80 mb-6">Ücretsiz ekspertiz için hemen arayın!</p>
            <a href={`tel:${phoneRaw}`}>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Phone className="mr-2 h-5 w-5" /> {phone}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
