'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Truck, Building2, MapPin, ArrowRight, Phone } from 'lucide-react'

const iconMap = { Truck, Building2, MapPin }

const defaultServices = [
  { id: '1', title: 'Asansörlü Taşımacılık', slug: 'asansorlu-tasimacilik', short_description: 'Yüksek katlara güvenli ve hızlı taşımacılık', icon: 'Building2', image: 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=400' },
  { id: '2', title: 'Şehir İçi Nakliyat', slug: 'sehir-ici-nakliyat', short_description: 'Adana içi hızlı ve ekonomik taşımacılık', icon: 'Truck', image: 'https://images.unsplash.com/photo-1585541571714-01aa54eaf7c2?w=400' },
  { id: '3', title: 'Şehirler Arası Nakliyat', slug: 'sehirler-arasi-nakliyat', short_description: 'Türkiye geneli güvenli taşımacılık', icon: 'MapPin', image: 'https://images.unsplash.com/photo-1577075473292-5f62dfae5522?w=400' },
  { id: '4', title: 'Sarıçam Nakliyat', slug: 'saricam-nakliyat', short_description: 'Sarıçam bölgesi özel hizmet', icon: 'Truck', image: 'https://images.unsplash.com/photo-1587149185211-28a2ef4c9a10?w=400' },
  { id: '5', title: 'Çukurova Nakliyat', slug: 'cukurova-nakliyat', short_description: 'Çukurova bölgesi özel hizmet', icon: 'Truck', image: 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=400' },
]

export default function ServicesPage() {
  const [services, setServices] = useState(defaultServices)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, settingsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/settings')
        ])
        const [servicesData, settingsData] = await Promise.all([
          servicesRes.json(),
          settingsRes.json()
        ])
        if (servicesData.length) setServices(servicesData)
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
      <Breadcrumb items={[{ label: 'Hizmetler' }]} />
      
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Hizmetlerimiz</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Adana'da evden eve nakliyat, asansörlü taşımacılık ve şehirler arası nakliyat hizmetleri sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Truck
              return (
                <Card key={service.id} className="group hover:shadow-xl transition-all overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image || 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=400'}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-secondary-foreground" />
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.short_description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/hizmetler/${service.slug}`}>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                        Detaylı Bilgi <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Hizmetlerimiz Hakkında Bilgi Alın</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Ücretsiz ekspertiz ve fiyat teklifi için hemen arayın!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${phoneRaw}`}>
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Phone className="mr-2 h-5 w-5" /> {phone}
                </Button>
              </a>
              <Link href="/teklif-al">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Ücretsiz Teklif Al
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
