'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Truck, Upload } from 'lucide-react'

const slugify = (text) => {
  return text.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    title: '', slug: '', short_description: '', content: '', category: '',
    is_featured: true, icon: 'Truck', image: '', meta_title: '', meta_description: '',
    meta_keywords: '', og_image: '', canonical_url: '', status: 'published', display_order: 0
  })

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services')
      const data = await res.json()
      setServices(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Services fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formDataUpload })
      const data = await res.json()
      if (data.url) {
        setFormData(prev => ({ ...prev, image: data.url }))
        toast.success('Görsel yüklendi!')
      } else {
        toast.error('Yükleme başarısız')
      }
    } catch (error) {
      toast.error('Yükleme hatası')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services'
    const method = editingService ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success(editingService ? 'Hizmet güncellendi!' : 'Hizmet eklendi!')
        setDialogOpen(false)
        resetForm()
        fetchServices()
      } else {
        toast.error('İşlem başarısız')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Hizmet silindi!')
        fetchServices()
      }
    } catch (error) {
      toast.error('Silme başarısız')
    }
  }

  const openEditDialog = (service) => {
    setEditingService(service)
    setFormData(service)
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingService(null)
    setFormData({
      title: '', slug: '', short_description: '', content: '', category: '',
      is_featured: true, icon: 'Truck', image: '', meta_title: '', meta_description: '',
      meta_keywords: '', og_image: '', canonical_url: '', status: 'published', display_order: 0
    })
  }

  const handleTitleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: slugify(value),
      meta_title: value + ' | Baraj Nakliyat'
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hizmetler</h1>
          <p className="text-muted-foreground">Hizmetleri yönetin - Eklenen hizmetler menüye ve sidebar'a otomatik eklenir</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Yeni Hizmet</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="general">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">Genel</TabsTrigger>
                  <TabsTrigger value="content">İçerik</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Başlık *</Label>
                      <Input value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug *</Label>
                      <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Kısa Açıklama</Label>
                    <Input value={formData.short_description} onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Görsel</Label>
                    <div className="flex gap-2">
                      <Input value={formData.image} onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} placeholder="URL veya yükle" />
                      <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.image && <img src={formData.image} alt="Preview" className="w-full h-40 object-cover rounded mt-2" />}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Kategori</Label>
                      <Input value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>İkon</Label>
                      <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Truck">Truck</SelectItem>
                          <SelectItem value="Building2">Building2</SelectItem>
                          <SelectItem value="MapPin">MapPin</SelectItem>
                          <SelectItem value="Shield">Shield</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Sıra</Label>
                      <Input type="number" value={formData.display_order} onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Durum</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Yayında</SelectItem>
                          <SelectItem value="draft">Taslak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 pt-8">
                      <Switch checked={formData.is_featured} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))} />
                      <Label>Öne Çıkan</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label>İçerik (HTML destekler)</Label>
                    <Textarea value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} rows={12} placeholder="Hizmet detaylarını yazın..." />
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Meta Başlık</Label>
                    <Input value={formData.meta_title} onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))} />
                    <p className="text-xs text-muted-foreground">{(formData.meta_title || '').length}/60 karakter</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Açıklama</Label>
                    <Textarea value={formData.meta_description} onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))} rows={2} />
                    <p className="text-xs text-muted-foreground">{(formData.meta_description || '').length}/160 karakter</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Anahtar Kelimeler</Label>
                    <Input value={formData.meta_keywords} onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))} placeholder="kelime1, kelime2" />
                  </div>
                  <div className="space-y-2">
                    <Label>Canonical URL</Label>
                    <Input value={formData.canonical_url || ''} onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label>OG Image URL</Label>
                    <Input value={formData.og_image || ''} onChange={(e) => setFormData(prev => ({ ...prev, og_image: e.target.value }))} placeholder="https://..." />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
                <Button type="submit">{editingService ? 'Güncelle' : 'Ekle'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz hizmet eklenmemiş</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  {service.image ? (
                    <img src={service.image} alt={service.title} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center">
                      <Truck className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.short_description}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${service.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {service.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                      {service.is_featured && <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">Öne Çıkan</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(service)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(service.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
