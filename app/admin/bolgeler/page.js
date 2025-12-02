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
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'

const slugify = (text) => {
  return text.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function AdminLocations() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '', slug: '', short_description: '', meta_title: '', meta_description: '', display_order: 0, is_active: true
  })

  useEffect(() => { fetchLocations() }, [])

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/admin/locations')
      const data = await res.json()
      setLocations(data)
    } catch (error) {
      console.error('Locations fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingItem ? `/api/admin/locations/${editingItem.id}` : '/api/admin/locations'
    const method = editingItem ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(editingItem ? 'Bölge güncellendi!' : 'Bölge eklendi!')
        setDialogOpen(false)
        resetForm()
        fetchLocations()
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu bölgeyi silmek istediğinize emin misiniz?')) return
    try {
      const res = await fetch(`/api/admin/locations/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Bölge silindi!')
        fetchLocations()
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
    setFormData({ name: '', slug: '', short_description: '', meta_title: '', meta_description: '', display_order: 0, is_active: true })
  }

  const handleNameChange = (value) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: slugify(value),
      meta_title: value + ' Nakliyat | Baraj Nakliyat'
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hizmet Bölgeleri</h1>
          <p className="text-muted-foreground">Hizmet verdiğiniz bölgeleri yönetin</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Yeni Bölge</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Bölgeyi Düzenle' : 'Yeni Bölge'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bölge Adı</Label>
                  <Input value={formData.name} onChange={(e) => handleNameChange(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Kısa Açıklama</Label>
                <Textarea value={formData.short_description} onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Meta Başlık</Label>
                <Input value={formData.meta_title} onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Meta Açıklama</Label>
                <Textarea value={formData.meta_description} onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))} rows={2} />
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
      ) : locations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz bölge eklenmemiş</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {locations.map((item) => (
            <Card key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.short_description || item.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
