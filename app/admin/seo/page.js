'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Save, Globe, Search } from 'lucide-react'

const defaultPages = [
  { page_name: 'anasayfa', title: 'Ana Sayfa', path: '/' },
  { page_name: 'hizmetler', title: 'Hizmetler', path: '/hizmetler' },
  { page_name: 'blog', title: 'Blog', path: '/blog' },
  { page_name: 'hakkimizda', title: 'Hakkımızda', path: '/hakkimizda' },
  { page_name: 'iletisim', title: 'İletişim', path: '/iletisim' },
  { page_name: 'sss', title: 'SSS', path: '/sss' },
  { page_name: 'galeri', title: 'Galeri', path: '/galeri' },
  { page_name: 'teklif-al', title: 'Teklif Al', path: '/teklif-al' },
]

export default function AdminSEO() {
  const [seoSettings, setSeoSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedPage, setSelectedPage] = useState('anasayfa')
  const [formData, setFormData] = useState({
    meta_title: '', meta_description: '', meta_keywords: '',
    canonical_url: '', og_title: '', og_description: '', og_image: '',
    twitter_title: '', twitter_description: '', twitter_image: ''
  })

  useEffect(() => { fetchSEO() }, [])

  useEffect(() => {
    const pageData = seoSettings.find(s => s.page_name === selectedPage)
    if (pageData) {
      setFormData(pageData)
    } else {
      const defaultPage = defaultPages.find(p => p.page_name === selectedPage)
      setFormData({
        page_name: selectedPage,
        meta_title: defaultPage?.title ? `${defaultPage.title} | Baraj Nakliyat` : '',
        meta_description: '', meta_keywords: '',
        canonical_url: '', og_title: '', og_description: '', og_image: '',
        twitter_title: '', twitter_description: '', twitter_image: ''
      })
    }
  }, [selectedPage, seoSettings])

  const fetchSEO = async () => {
    try {
      const res = await fetch('/api/admin/seo')
      const data = await res.json()
      setSeoSettings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('SEO fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, page_name: selectedPage })
      })

      if (res.ok) {
        toast.success('SEO ayarları kaydedildi!')
        fetchSEO()
      } else {
        toast.error('Kaydetme başarısız')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Search className="h-8 w-8" /> SEO Ayarları
        </h1>
        <p className="text-muted-foreground">Tüm sayfaların SEO ayarlarını yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sayfalar</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {defaultPages.map((page) => {
                  const hasSeo = seoSettings.some(s => s.page_name === page.page_name)
                  return (
                    <button
                      key={page.page_name}
                      onClick={() => setSelectedPage(page.page_name)}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted transition-colors ${
                        selectedPage === page.page_name ? 'bg-primary/10 border-l-4 border-primary' : ''
                      }`}
                    >
                      <span className="font-medium">{page.title}</span>
                      {hasSeo && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Ayarlı</span>}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SEO Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>{defaultPages.find(p => p.page_name === selectedPage)?.title} SEO Ayarları</CardTitle>
                <CardDescription>Bu sayfanın arama motoru optimizasyonu ayarları</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic">
                  <TabsList className="mb-4">
                    <TabsTrigger value="basic">Temel SEO</TabsTrigger>
                    <TabsTrigger value="og">Open Graph</TabsTrigger>
                    <TabsTrigger value="twitter">Twitter</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Meta Başlık</Label>
                      <Input
                        value={formData.meta_title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                        placeholder="Sayfa Başlığı | Baraj Nakliyat"
                      />
                      <p className="text-xs text-muted-foreground">{(formData.meta_title || '').length}/60 karakter</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Meta Açıklama</Label>
                      <Textarea
                        value={formData.meta_description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                        placeholder="Bu sayfa hakkında kısa açıklama..."
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">{(formData.meta_description || '').length}/160 karakter</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Anahtar Kelimeler</Label>
                      <Input
                        value={formData.meta_keywords || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
                        placeholder="nakliyat, ev taşıma, adana"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Canonical URL</Label>
                      <Input
                        value={formData.canonical_url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                        placeholder="https://barajnakliyat.com/sayfa"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="og" className="space-y-4">
                    <div className="space-y-2">
                      <Label>OG Başlık</Label>
                      <Input
                        value={formData.og_title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                        placeholder="Sosyal medya başlığı"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>OG Açıklama</Label>
                      <Textarea
                        value={formData.og_description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>OG Görsel URL</Label>
                      <Input
                        value={formData.og_image || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))}
                        placeholder="https://..."
                      />
                      {formData.og_image && <img src={formData.og_image} alt="OG Preview" className="w-full h-32 object-cover rounded mt-2" />}
                    </div>
                  </TabsContent>

                  <TabsContent value="twitter" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Twitter Başlık</Label>
                      <Input
                        value={formData.twitter_title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, twitter_title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Twitter Açıklama</Label>
                      <Textarea
                        value={formData.twitter_description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, twitter_description: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Twitter Görsel URL</Label>
                      <Input
                        value={formData.twitter_image || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, twitter_image: e.target.value }))}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end mt-6">
                  <Button type="submit" disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
