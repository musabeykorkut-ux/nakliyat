'use client'

import { useState, useEffect } from 'react'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { X, ChevronLeft, ChevronRight, Phone } from 'lucide-react'
import Link from 'next/link'

const defaultGallery = [
  { id: '1', image: 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=600', title: 'Ev Taşıma', category: 'Nakliyat' },
  { id: '2', image: 'https://images.unsplash.com/photo-1585541571714-01aa54eaf7c2?w=600', title: 'Nakliye Aracı', category: 'Araçlar' },
  { id: '3', image: 'https://images.unsplash.com/photo-1577075473292-5f62dfae5522?w=600', title: 'Paketleme', category: 'Hizmetler' },
  { id: '4', image: 'https://images.unsplash.com/photo-1587149185211-28a2ef4c9a10?w=600', title: 'Yük Taşıma', category: 'Nakliyat' },
  { id: '5', image: 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=600', title: 'Ofis Taşıma', category: 'Hizmetler' },
  { id: '6', image: 'https://images.unsplash.com/photo-1585541571714-01aa54eaf7c2?w=600', title: 'Asansörlü Taşıma', category: 'Hizmetler' },
]

export default function GalleryPage() {
  const [gallery, setGallery] = useState(defaultGallery)
  const [settings, setSettings] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryRes, settingsRes] = await Promise.all([
          fetch('/api/gallery'),
          fetch('/api/settings')
        ])
        const [galleryData, settingsData] = await Promise.all([
          galleryRes.json(),
          settingsRes.json()
        ])
        if (Array.isArray(galleryData) && galleryData.length) setGallery(galleryData)
        if (settingsData) setSettings(settingsData)
      } catch (error) {
        console.error('Data fetch error:', error)
      }
    }
    fetchData()
  }, [])

  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'

  const openLightbox = (index) => {
    setSelectedIndex(index)
    setLightboxOpen(true)
  }

  const nextImage = () => setSelectedIndex((prev) => (prev + 1) % gallery.length)
  const prevImage = () => setSelectedIndex((prev) => (prev - 1 + gallery.length) % gallery.length)

  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: 'Galeri' }]} />

      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Galeri</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Çalışmalarımızdan kareler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, index) => (
              <Card key={item.id} className="group overflow-hidden cursor-pointer" onClick={() => openLightbox(index)}>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Büyüt
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.category && <span className="text-sm text-muted-foreground">{item.category}</span>}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Lightbox */}
          <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
            <DialogContent className="max-w-4xl p-0 bg-black border-none">
              <div className="relative">
                <img
                  src={gallery[selectedIndex]?.image}
                  alt={gallery[selectedIndex]?.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg">
                  {gallery[selectedIndex]?.title}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* CTA */}
          <div className="mt-16 bg-primary rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Profesyonel Nakliyat Hizmeti</h2>
            <p className="text-white/80 mb-6">Ücretsiz teklif için hemen arayın!</p>
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
