'use client'

import { useState, useEffect } from 'react'
import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Phone } from 'lucide-react'
import { toast } from 'sonner'

const districts = ['Sarıçam', 'Çukurova', 'Seyhan', 'Yüreğir', 'Ceyhan', 'Kozan', 'Karısalağaç', 'Pozantı', 'Tufanbeyli', 'Aladatag', 'İmamoatglu', 'Sarıçam', 'Feke', 'Saimbeyli']

export default function QuotePage() {
  const [settings, setSettings] = useState(null)
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', from_district: '', to_district: '',
    move_date: '', has_elevator: false, from_floor: '', to_floor: '', notes: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error)
  }, [])

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
        setSubmitted(true)
        toast.success('Teklif talebiniz başarıyla alındı!')
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

  if (submitted) {
    return (
      <SiteLayout>
        <Breadcrumb items={[{ label: 'Ücretsiz Teklif Al' }]} />
        <section className="py-20">
          <div className="container max-w-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Talebiniz Alındı!</h1>
            <p className="text-muted-foreground mb-8">
              En kısa sürede sizinle iletişime geçeceğiz. Acil durumlar için bizi arayın.
            </p>
            <a href={`tel:${phoneRaw}`}>
              <Button size="lg" className="bg-primary">
                <Phone className="mr-2 h-5 w-5" /> {phone}
              </Button>
            </a>
          </div>
        </section>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: 'Ücretsiz Teklif Al' }]} />

      <section className="py-16">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Ücretsiz Teklif Alın</h1>
            <p className="text-lg text-muted-foreground">
              Formu doldurun, size özel fiyat teklifi hazırlayalım
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Teklif Formu</CardTitle>
              <CardDescription>* işaretli alanlar zorunludur</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Ad Soyad *</Label>
                    <Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon *</Label>
                    <Input type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} required placeholder="05XX XXX XX XX" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>E-posta</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} />
                </div>

                {/* Address Info */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Adres Bilgileri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Çıkış İlçesi *</Label>
                      <Select value={formData.from_district} onValueChange={(value) => setFormData(prev => ({ ...prev, from_district: value }))}>
                        <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                        <SelectContent>
                          {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Varış İlçesi *</Label>
                      <Select value={formData.to_district} onValueChange={(value) => setFormData(prev => ({ ...prev, to_district: value }))}>
                        <SelectTrigger><SelectValue placeholder="Seçin" /></SelectTrigger>
                        <SelectContent>
                          {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <Label>Çıkış Kat</Label>
                      <Input type="number" value={formData.from_floor} onChange={(e) => setFormData(prev => ({ ...prev, from_floor: e.target.value }))} placeholder="Örn: 3" />
                    </div>
                    <div className="space-y-2">
                      <Label>Varış Kat</Label>
                      <Input type="number" value={formData.to_floor} onChange={(e) => setFormData(prev => ({ ...prev, to_floor: e.target.value }))} placeholder="Örn: 5" />
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Ek Bilgiler</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Taşınma Tarihi</Label>
                      <Input type="date" value={formData.move_date} onChange={(e) => setFormData(prev => ({ ...prev, move_date: e.target.value }))} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={formData.has_elevator} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_elevator: checked }))} />
                      <Label>Asansörlü Taşımacılık İstiyorum</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Notlar</Label>
                      <Textarea rows={4} value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Eklemek istediğiniz bilgiler..." />
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? 'Gönderiliyor...' : 'Ücretsiz Teklif İste'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Hemen bilgi almak için bizi arayın</p>
            <a href={`tel:${phoneRaw}`}>
              <Button variant="outline" size="lg">
                <Phone className="mr-2 h-5 w-5" /> {phone}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
