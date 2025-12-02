'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Save, Upload, Home, Image as ImageIcon } from 'lucide-react'

export default function AdminHomepage() {
  const [homepage, setHomepage] = useState({
    hero_title: 'Adana Evden Eve Nakliyat',
    hero_subtitle: 'Sarıçam ve Çukurova\'da Profesyonel Taşımacılık',
    hero_description: '10+ yıllık tecrübemizle sigortalı, güvenli ve ekonomik evden eve nakliyat hizmeti sunuyoruz.',
    hero_image: 'https://images.unsplash.com/photo-1602750766769-8db8d49cc369?w=1920',
    cta_title: 'Adana\'da Güvenilir Evden Eve Nakliyat',
    cta_description: 'Hemen arayın, ücretsiz ekspertiz ve fiyat teklifi alın!',
    why_us_title: 'Neden Baraj Nakliyat?',
    why_us_subtitle: 'Yılların tecrübesi ve binlerce mutlu müşteri',
    process_title: 'Nasıl Çalışırız?',
    process_subtitle: '5 kolay adımda taşınma süreci'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const res = await fetch('/api/admin/homepage')
        const data = await res.json()
        if (data && Object.keys(data).length > 0) {
          setHomepage(prev => ({ ...prev, ...data }))
        }
      } catch (error) {
        console.error('Homepage fetch error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHomepage()
  }, [])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.url) {
        setHomepage(prev => ({ ...prev, hero_image: data.url }))
        toast.success('Görsel yüklendi!')
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
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homepage)
      })

      if (res.ok) {
        toast.success('Anasayfa ayarları kaydedildi!')
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
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Home className="h-8 w-8" /> Anasayfa Yönetimi
        </h1>
        <p className="text-muted-foreground">Anasayfa içeriklerini düzenleyin</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="hero">
          <TabsList className="mb-6">
            <TabsTrigger value="hero">Hero Bölümü</TabsTrigger>
            <TabsTrigger value="sections">Diğer Bölümler</TabsTrigger>
            <TabsTrigger value="cta">CTA</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Bölümü</CardTitle>
                <CardDescription>Ana sayfa üst kısmı ayarları</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Ana Başlık</Label>
                  <Input
                    value={homepage.hero_title}
                    onChange={(e) => setHomepage(prev => ({ ...prev, hero_title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alt Başlık</Label>
                  <Input
                    value={homepage.hero_subtitle}
                    onChange={(e) => setHomepage(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <Textarea
                    value={homepage.hero_description}
                    onChange={(e) => setHomepage(prev => ({ ...prev, hero_description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Görseli</Label>
                  <div className="flex gap-2">
                    <Input
                      value={homepage.hero_image}
                      onChange={(e) => setHomepage(prev => ({ ...prev, hero_image: e.target.value }))}
                      placeholder="URL veya yükle"
                    />
                    <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {homepage.hero_image && (
                    <img src={homepage.hero_image} alt="Hero Preview" className="w-full h-48 object-cover rounded mt-2" />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sections">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Neden Biz Bölümü</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Başlık</Label>
                    <Input
                      value={homepage.why_us_title}
                      onChange={(e) => setHomepage(prev => ({ ...prev, why_us_title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alt Başlık</Label>
                    <Input
                      value={homepage.why_us_subtitle}
                      onChange={(e) => setHomepage(prev => ({ ...prev, why_us_subtitle: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Süreç Bölümü</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Başlık</Label>
                    <Input
                      value={homepage.process_title}
                      onChange={(e) => setHomepage(prev => ({ ...prev, process_title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alt Başlık</Label>
                    <Input
                      value={homepage.process_subtitle}
                      onChange={(e) => setHomepage(prev => ({ ...prev, process_subtitle: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cta">
            <Card>
              <CardHeader>
                <CardTitle>CTA (Call to Action)</CardTitle>
                <CardDescription>Sayfa sonundaki çağrı alanı</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input
                    value={homepage.cta_title}
                    onChange={(e) => setHomepage(prev => ({ ...prev, cta_title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Açıklama</Label>
                  <Textarea
                    value={homepage.cta_description}
                    onChange={(e) => setHomepage(prev => ({ ...prev, cta_description: e.target.value }))}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button type="submit" size="lg" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </div>
  )
}
