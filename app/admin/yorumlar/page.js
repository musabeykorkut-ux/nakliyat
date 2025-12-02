'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Star, Users } from 'lucide-react'

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '', district: '', rating: 5, comment: '', display_order: 0, is_active: true
  })

  useEffect(() => { fetchTestimonials() }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      setTestimonials(data)
    } catch (error) {
      console.error('Testimonials fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingItem ? `/api/admin/testimonials/${editingItem.id}` : '/api/admin/testimonials'
    const method = editingItem ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(editingItem ? 'Yorum güncellendi!' : 'Yorum eklendi!')
        setDialogOpen(false)
        resetForm()
        fetchTestimonials()
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Yorum silindi!')
        fetchTestimonials()
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
    setFormData({ name: '', district: '', rating: 5, comment: '', display_order: 0, is_active: true })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Müşteri Yorumları</h1>
          <p className="text-muted-foreground">Müşteri yorumlarını yönetin</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Yeni Yorum</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Yorumu Düzenle' : 'Yeni Yorum'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ad Soyad</Label>
                  <Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Semt / İlçe</Label>
                  <Input value={formData.district} onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))} placeholder="Sarıçam" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Puan (1-5)</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className="p-1"
                    >
                      <Star className={`h-6 w-6 ${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Yorum</Label>
                <Textarea value={formData.comment} onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))} rows={4} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sıra</Label>
                  <Input type="number" value={formData.display_order} onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))} />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))} />
                  <Label>Aktif</Label>
                </div>
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
      ) : testimonials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz yorum eklenmemiş</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((item) => (
            <Card key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">{item.name[0]}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.district}</p>
                      </div>
                      <div className="flex gap-0.5 ml-2">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{item.comment}"</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
