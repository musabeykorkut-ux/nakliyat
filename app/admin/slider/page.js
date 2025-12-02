'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pencil, Trash2, Plus, Upload } from 'lucide-react'
import { toast } from 'sonner'

export default function SliderPage() {
  const [sliders, setSliders] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSlider, setEditingSlider] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    button_text: '',
    button_link: '',
    display_order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchSliders()
  }, [])

  const fetchSliders = async () => {
    try {
      const res = await fetch('/api/admin/sliders')
      const data = await res.json()
      setSliders(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
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
        setFormData(prev => ({ ...prev, image: data.url }))
        toast.success('Resim yüklendi')
      }
    } catch (error) {
      toast.error('Resim yükleme hatası')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const method = editingSlider ? 'PATCH' : 'POST'
    const url = editingSlider ? `/api/admin/sliders/${editingSlider.id}` : '/api/admin/sliders'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        toast.success(editingSlider ? 'Slider güncellendi' : 'Slider eklendi')
        setDialogOpen(false)
        fetchSliders()
        resetForm()
      }
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    
    try {
      const res = await fetch(`/api/admin/sliders/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Slider silindi')
        fetchSliders()
      }
    } catch (error) {
      toast.error('Silme hatası')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      button_text: '',
      button_link: '',
      display_order: 0,
      is_active: true
    })
    setEditingSlider(null)
  }

  const openEditDialog = (slider) => {
    setEditingSlider(slider)
    setFormData(slider)
    setDialogOpen(true)
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Slider Yönetimi</h1>
          <p className="text-muted-foreground">Ana sayfa slider görselleri</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Slider
        </Button>
      </div>

      <div className="grid gap-4">
        {sliders.map((slider) => (
          <Card key={slider.id}>
            <CardContent className="flex items-center gap-4 p-4">
              {slider.image && (
                <img src={slider.image} alt={slider.title} className="w-32 h-20 object-cover rounded" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{slider.title}</h3>
                <p className="text-sm text-muted-foreground">{slider.subtitle}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(slider)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(slider.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSlider ? 'Slider Düzenle' : 'Yeni Slider'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Başlık *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label>Alt Başlık</Label>
              <Input value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} />
            </div>
            <div>
              <Label>Açıklama</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} />
            </div>
            <div>
              <Label>Görsel *</Label>
              <div className="flex gap-2">
                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </div>
              {formData.image && <img src={formData.image} alt="Preview" className="mt-2 w-full h-40 object-cover rounded" />}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Buton Metni</Label>
                <Input value={formData.button_text} onChange={(e) => setFormData({...formData, button_text: e.target.value})} />
              </div>
              <div>
                <Label>Buton Linki</Label>
                <Input value={formData.button_link} onChange={(e) => setFormData({...formData, button_link: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
              <Button type="submit">{editingSlider ? 'Güncelle' : 'Ekle'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
