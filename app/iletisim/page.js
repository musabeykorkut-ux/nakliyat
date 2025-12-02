'use client'

import { useState, useEffect } from 'react'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [settings, setSettings] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Mesajınız alındı! En kısa sürede sizinle iletişime geçeceğiz.')
        setFormData({ name: '', phone: '', email: '', message: '' })
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
  const email = settings?.email || 'info@barajnakliyat.com'
  const address = settings?.address || 'Adana, Türkiye'

  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: 'İletişim' }]} />

      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Bizimle İletişime Geçin</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sorularınız için bize ulaşın, ücretsiz teklif alın
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telefon</h3>
                    <a href={`tel:${phoneRaw}`} className="text-muted-foreground hover:text-primary">{phone}</a>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">E-posta</h3>
                    <a href={`mailto:${email}`} className="text-muted-foreground hover:text-primary">{email}</a>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Adres</h3>
                    <p className="text-muted-foreground">{address}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Çalışma Saatleri</h3>
                    <p className="text-muted-foreground">7/24 Hizmetinizdeyiz</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mesaj Gönderin</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Ad Soyad *</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon *</Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mesajınız *</Label>
                      <Textarea id="message" rows={5} value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} required />
                    </div>
                    <Button type="submit" size="lg" disabled={submitting}>
                      <Send className="mr-2 h-4 w-4" />
                      {submitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="mt-12">
            <Card>
              <CardContent className="p-0">
                <div className="h-80 bg-muted flex items-center justify-center rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4" />
                    <p>Harita için Google Maps API entegrasyonu gerekli</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
