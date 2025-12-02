'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Image as ImageIcon, Upload } from 'lucide-react'

export default function AdminGallery() {
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    title: '', image: '', category: '', description: '', display_order: 0, is_active: true
  })

  useEffect(() => { fetchGallery() }, [])

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/admin/gallery')
      const data = await res.json()
      setGallery(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Gallery fetch error:', error)
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
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload
      })
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
    const url = editingItem ? `/api/admin/gallery/${editingItem.id}` : '/api/admin/gallery'
    const method = editingItem ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(editingItem ? 'Görsel güncellendi!' : 'Görsel eklendi!')
        setDialogOpen(false)
        resetForm()
        fetchGallery()
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu görseli silmek istediğinize emin misiniz?')) return
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Görsel silindi!')
        fetchGallery()
      }
    } catch (error) {
      toast.error('Silme başarısız')
    }
  }

  const openEditDialog = (item) => {
    setEditingItem(item)
    setFormData(item)
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({ title: '', image: '', category: '', description: '', display_order: 0, is_active: true })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Galeri</h1>
          <p className="text-muted-foreground">Galeri görsellerini yönetin</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Görsel Ekle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Görseli Düzenle' : 'Yeni Görsel'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Başlık</Label>
                <Input value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required />
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
                {formData.image && <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Input value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} placeholder="Nakliyat" />
                </div>
                <div className="space-y-2">
                  <Label>Sıra</Label>
                  <Input type="number" value={formData.display_order} onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Textarea value={formData.description || ''} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={2} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))} />
                <Label>Aktif</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
                <Button type="submit">{editingItem ? 'Güncelle' : 'Ekle'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : gallery.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz görsel eklenmemiş</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <Card key={item.id} className={`overflow-hidden ${!item.is_active ? 'opacity-50' : ''}`}>
              <div className="relative h-40">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => openEditDialog(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="font-medium truncate">{item.title}</p>
                {item.category && <span className="text-xs text-muted-foreground">{item.category}</span>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
