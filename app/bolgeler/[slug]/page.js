'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Phone, ArrowRight, Truck, MapPin, Shield, Clock } from 'lucide-react'
import { toast } from 'sonner'

const defaultLocations = {
  'saricam': { name: 'Sarıçam', title: 'Sarıçam Evden Eve Nakliyat' },
  'cukurova': { name: 'Çukurova', title: 'Çukurova Evden Eve Nakliyat' },
  'seyhan': { name: 'Seyhan', title: 'Seyhan Evden Eve Nakliyat' },
  'yuregir': { name: 'Yüreğir', title: 'Yüreğir Evden Eve Nakliyat' },
  'ceyhan': { name: 'Ceyhan', title: 'Ceyhan Evden Eve Nakliyat' },
}

export default function LocationDetailPage() {
  const params = useParams()
  const slug = params.slug
  const [location, setLocation] = useState(null)
  const [locations, setLocations] = useState([])
  const [services, setServices] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', phone: '', from_district: '', to_district: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, servicesRes, settingsRes] = await Promise.all([
          fetch('/api/locations'),
          fetch('/api/services'),
          fetch('/api/settings')
        ])
        const [locationsData, servicesData, settingsData] = await Promise.all([
          locationsRes.json(),
          servicesRes.json(),
          settingsRes.json()
        ])
        
        if (Array.isArray(locationsData)) {
          setLocations(locationsData.filter(l => l.slug !== slug))
          const found = locationsData.find(l => l.slug === slug)
          if (found) setLocation(found)
        }
        if (!location && defaultLocations[slug]) {
          setLocation({ ...defaultLocations[slug], slug })
        }
        if (Array.isArray(servicesData)) setServices(servicesData.slice(0, 5))
        if (settingsData) setSettings(settingsData)
      } catch (error) {
        console.error('Data fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, from_district: formData.from_district || location?.name })
      })
      if (res.ok) {
        toast.success('Teklif talebiniz alındı!')
        setFormData({ name: '', phone: '', from_district: '', to_district: '', notes: '' })
      } else {
        toast.error('Bir hata oluştu')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'
  const locationName = location?.name || defaultLocations[slug]?.name || slug
  const pageTitle = location?.title || `${locationName} Evden Eve Nakliyat`

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <Breadcrumb items={[
        { href: '/bolgeler', label: 'Bölgeler' },
        { label: `${locationName} Nakliyat` }
      ]} />

      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Hero */}
              <div className="bg-primary rounded-xl p-8 mb-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-8 w-8 text-secondary" />
                  <h1 className="text-3xl md:text-4xl font-bold">{pageTitle}</h1>
                </div>
                <p className="text-white/80 text-lg">
                  {locationName} bölgesinde profesyonel evden eve nakliyat hizmeti. Sigortalı, güvenli ve ekonomik taşımacılık.
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <p>
                  Baraj Nakliyat olarak <strong>{locationName}</strong> bölgesinde evden eve nakliyat hizmeti sunuyoruz. 
                  10 yılı aşkın tecrübemizle {locationName} ve çevresinde güvenli taşımacılık gerçekleştiriyoruz.
                </p>
                
                <h2>{locationName}'da Nakliyat Hizmetlerimiz</h2>
                <ul>
                  <li><strong>Evden Eve Nakliyat:</strong> {locationName} içinde ve dışında ev taşıma</li>
                  <li><strong>Asansörlü Taşımacılık:</strong> Yüksek katlara güvenli taşıma</li>
                  <li><strong>Ofis Taşımacılığı:</strong> İşyeri ve ofis taşıma</li>
                  <li><strong>Paketleme Hizmeti:</strong> Profesyonel paketleme</li>
                  <li><strong>Eşya Depolama:</strong> Güvenli depolama hizmeti</li>
                </ul>

                <h2>Neden {locationName}'da Bizi Seçmelisiniz?</h2>
                <p>
                  {locationName} bölgesini ve çevresini çok iyi tanıyoruz. Yerel bilgimiz sayesinde en hızlı 
                  ve güvenli rotaları kullanarak taşınmanızı gerçekleştiriyoruz.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: Shield, title: 'Sigortalı Taşıma', desc: 'Tüm eşyalar sigorta kapsamında' },
                  { icon: Clock, title: 'Zamanında Teslim', desc: 'Söz verilen saatte teslim' },
                  { icon: Truck, title: 'Modern Araçlar', desc: 'Donanımlı araç filosu' },
                  { icon: CheckCircle, title: 'Ücretsiz Ekspertiz', desc: 'Ücretsiz kesin fiyat teklifi' },
                ].map((item, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <item.icon className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Other Locations */}
              {locations.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Diğer Bölgeler</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {locations.slice(0, 4).map((loc) => (
                      <Link key={loc.id || loc.slug} href={`/bolgeler/${loc.slug}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer text-center p-4">
                          <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                          <span className="font-medium text-sm">{loc.name}</span>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Contact */}
                <Card className="bg-primary text-white">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{locationName} Nakliyat</h3>
                    <p className="text-white/80 mb-4">Ücretsiz teklif alın</p>
                    <a href={`tel:${phoneRaw}`}>
                      <Button size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        {phone}
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* Quick Quote Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Hızlı Teklif Al</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Ad Soyad</Label>
                        <Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefon</Label>
                        <Input type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} required />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Çıkış</Label>
                          <Input value={formData.from_district} onChange={(e) => setFormData(prev => ({ ...prev, from_district: e.target.value }))} placeholder={locationName} />
                        </div>
                        <div className="space-y-2">
                          <Label>Varış</Label>
                          <Input value={formData.to_district} onChange={(e) => setFormData(prev => ({ ...prev, to_district: e.target.value }))} />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? 'Gönderiliyor...' : 'Teklif İste'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Services */}
                {services.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Hizmetlerimiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {services.map((service) => (
                          <Link key={service.id} href={`/hizmetler/${service.slug}`}>
                            <div className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors">
                              <ArrowRight className="h-4 w-4 text-primary" />
                              <span className="text-sm">{service.title}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
