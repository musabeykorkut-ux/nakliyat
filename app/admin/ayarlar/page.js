'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Save, Phone, Mail, MapPin, Upload, Image as ImageIcon } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    phone: '', phone_raw: '', email: '', address: '', whatsapp: '',
    company_name: 'Baraj Nakliyat', slogan: "Adana'da Güvenilir Evden Eve Nakliyat",
    about_short: '', facebook: '', instagram: '', twitter: '',
    logo: '', favicon: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const logoInputRef = useRef(null)
  const faviconInputRef = useRef(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings')
        const data = await res.json()
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }))
        }
      } catch (error) {
        console.error('Settings fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleUpload = async (e, field) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        setSettings(prev => ({ ...prev, [field]: data.url }))
        toast.success('Yüklendi!')
      }
    } catch (error) {
      toast.error('Yükleme hatası')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        toast.success('Ayarlar kaydedildi!')
      } else {
        toast.error('Kaydetme başarısız')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Site Ayarları</h1>
        <p className="text-muted-foreground">Genel site ayarlarını yönetin - Telefon değişince tüm sitede güncellenir</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo & Favicon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Logo & Favicon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex gap-2">
                  <Input value={settings.logo || ''} onChange={(e) => setSettings(prev => ({ ...prev, logo: e.target.value }))} placeholder="URL veya yükle" />
                  <input type="file" ref={logoInputRef} onChange={(e) => handleUpload(e, 'logo')} accept="image/*" className="hidden" />
                  <Button type="button" variant="outline" onClick={() => logoInputRef.current?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {settings.logo && <img src={settings.logo} alt="Logo" className="h-16 object-contain mt-2" />}
              </div>
              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="flex gap-2">
                  <Input value={settings.favicon || ''} onChange={(e) => setSettings(prev => ({ ...prev, favicon: e.target.value }))} placeholder="URL veya yükle" />
                  <input type="file" ref={faviconInputRef} onChange={(e) => handleUpload(e, 'favicon')} accept="image/*" className="hidden" />
                  <Button type="button" variant="outline" onClick={() => faviconInputRef.current?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {settings.favicon && <img src={settings.favicon} alt="Favicon" className="h-8 w-8 object-contain mt-2" />}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" /> İletişim Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefon (Görünen)</Label>
                <Input value={settings.phone} onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))} placeholder="0 (536) 740 92 06" />
                <p className="text-xs text-muted-foreground">Sitede görünecek formatlı numara</p>
              </div>
              <div className="space-y-2">
                <Label>Telefon (Ham)</Label>
                <Input value={settings.phone_raw} onChange={(e) => setSettings(prev => ({ ...prev, phone_raw: e.target.value }))} placeholder="05367409206" />
                <p className="text-xs text-muted-foreground">Arama linklerinde kullanılacak</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input value={settings.whatsapp} onChange={(e) => setSettings(prev => ({ ...prev, whatsapp: e.target.value }))} placeholder="5367409206" />
              </div>
              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input type="email" value={settings.email} onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Adres</Label>
              <Textarea value={settings.address} onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))} rows={2} />
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle>Firma Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Firma Adı</Label>
                <Input value={settings.company_name} onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Slogan</Label>
                <Input value={settings.slogan} onChange={(e) => setSettings(prev => ({ ...prev, slogan: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Kısa Tanıtım</Label>
              <Textarea value={settings.about_short} onChange={(e) => setSettings(prev => ({ ...prev, about_short: e.target.value }))} rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Sosyal Medya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input value={settings.facebook} onChange={(e) => setSettings(prev => ({ ...prev, facebook: e.target.value }))} placeholder="https://facebook.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input value={settings.instagram} onChange={(e) => setSettings(prev => ({ ...prev, instagram: e.target.value }))} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Twitter</Label>
                <Input value={settings.twitter} onChange={(e) => setSettings(prev => ({ ...prev, twitter: e.target.value }))} placeholder="https://twitter.com/..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg">
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </div>
  )
}
