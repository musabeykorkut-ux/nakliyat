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
import { CheckCircle, Phone, ArrowRight, Truck } from 'lucide-react'
import { toast } from 'sonner'

export default function ServiceDetailPage() {
  const params = useParams()
  const [service, setService] = useState(null)
  const [services, setServices] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: '', phone: '', from_district: '', to_district: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, servicesRes, settingsRes] = await Promise.all([
          fetch(`/api/services/${params.slug}`),
          fetch('/api/services'),
          fetch('/api/settings')
        ])
        const [serviceData, servicesData, settingsData] = await Promise.all([
          serviceRes.json(),
          servicesRes.json(),
          settingsRes.json()
        ])
        if (!serviceData.error) setService(serviceData)
        if (servicesData.length) setServices(servicesData.filter(s => s.slug !== params.slug).slice(0, 3))
        if (settingsData) setSettings(settingsData)
      } catch (error) {
        console.error('Data fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/quote-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Teklif talebiniz alındı! En kısa sürede sizinle iletişime geçeceğiz.')
        setFormData({ name: '', phone: '', from_district: '', to_district: '', notes: '' })
      } else {
        toast.error('Bir hata oluştu, lütfen tekrar deneyin.')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const phone = settings?.phone || '0 (536) 740 92 06'
  const phoneRaw = settings?.phone_raw || '05367409206'

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SiteLayout>
    )
  }

  if (!service) {
    return (
      <SiteLayout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Hizmet Bulunamadı</h1>
          <Link href="/hizmetler">
            <Button>Tüm Hizmetler</Button>
          </Link>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <Breadcrumb items={[
        { href: '/hizmetler', label: 'Hizmetler' },
        { label: service.title }
      ]} />

      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Hero */}
              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
                <img
                  src={service.image || 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=800'}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{service.title}</h1>
                  <p className="text-white/80">{service.short_description}</p>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-8">
                {service.content ? (
                  <div dangerouslySetInnerHTML={{ __html: service.content.replace(/\n/g, '<br/>') }} />
                ) : (
                  <>
                    <p>
                      Baraj Nakliyat olarak Adana'da <strong>{service.title.toLowerCase()}</strong> hizmeti sunuyoruz. 
                      10 yılı aşkın tecrübemizle eşyalarınızı güvenle taşıyoruz.
                    </p>
                    <h2>Hizmet Özellikleri</h2>
                    <ul>
                      <li>Sigortalı taşımacılık</li>
                      <li>Profesyonel paketleme</li>
                      <li>Deneyimli ekip</li>
                      <li>Zamanında teslimat</li>
                      <li>Ücretsiz ekspertiz</li>
                    </ul>
                  </>
                )}
              </div>

              {/* Benefits */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Neden Bizi Seçmelisiniz?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Sigortalı taşımacılık garantisi',
                      'Profesyonel paketleme hizmeti',
                      '10+ yıl deneyimli ekip',
                      'Uygun fiyat garantisi',
                      '7/24 müşteri desteği',
                      'Ücretsiz ekspertiz hizmeti'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Services */}
              {services.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Diğer Hizmetlerimiz</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.map((s) => (
                      <Link key={s.id} href={`/hizmetler/${s.slug}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4 flex items-center gap-3">
                            <Truck className="h-8 w-8 text-primary" />
                            <span className="font-medium">{s.title}</span>
                          </CardContent>
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
                    <h3 className="text-xl font-bold mb-2">Hemen Arayın</h3>
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
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefon</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label>Çıkış İlçe</Label>
                          <Input
                            value={formData.from_district}
                            onChange={(e) => setFormData(prev => ({ ...prev, from_district: e.target.value }))}
                            placeholder="Sarıçam"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Varış İlçe</Label>
                          <Input
                            value={formData.to_district}
                            onChange={(e) => setFormData(prev => ({ ...prev, to_district: e.target.value }))}
                            placeholder="Çukurova"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Not</Label>
                        <Textarea
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? 'Gönderiliyor...' : 'Teklif İste'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
