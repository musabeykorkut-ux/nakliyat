'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ title: '', url: '', parent_id: null, is_dropdown: false, display_order: 0 })

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/admin/menu')
      const data = await res.json()
      setMenuItems(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingItem ? 'PATCH' : 'POST'
    const url = editingItem ? `/api/admin/menu/${editingItem.id}` : '/api/admin/menu'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success(editingItem ? 'Menü güncellendi' : 'Menü eklendi')
        setDialogOpen(false)
        fetchMenu()
        resetForm()
      }
    } catch (error) {
      toast.error('Hata')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    try {
      await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' })
      toast.success('Menü silindi')
      fetchMenu()
    } catch (error) {
      toast.error('Hata')
    }
  }

  const resetForm = () => {
    setFormData({ title: '', url: '', parent_id: null, is_dropdown: false, display_order: 0 })
    setEditingItem(null)
  }

  const openEditDialog = (item) => {
    setEditingItem(item)
    setFormData(item)
    setDialogOpen(true)
  }

  const parentMenus = menuItems.filter(item => !item.parent_id)

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Menü Yönetimi</h1>
          <p className="text-muted-foreground">Site menüsü ve dropdown ayarları</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Menü
        </Button>
      </div>

      <div className="grid gap-4">
        {parentMenus.map((item) => {
          const children = menuItems.filter(child => child.parent_id === item.id)
          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.url}</p>
                    {item.is_dropdown && <span className="text-xs text-primary">Dropdown</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {children.length > 0 && (
                  <div className="ml-6 mt-2 space-y-2">
                    {children.map(child => (
                      <div key={child.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{child.title}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(child)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(child.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Menü Düzenle' : 'Yeni Menü'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Başlık *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label>URL</Label>
              <Input value={formData.url || ''} onChange={(e) => setFormData({...formData, url: e.target.value})} placeholder="/hizmetler" />
            </div>
            <div>
              <Label>Üst Menü</Label>
              <select className="w-full border rounded p-2" value={formData.parent_id || ''} onChange={(e) => setFormData({...formData, parent_id: e.target.value || null})}>
                <option value="">Ana Menü</option>
                {parentMenus.map(parent => (
                  <option key={parent.id} value={parent.id}>{parent.title}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.is_dropdown} onCheckedChange={(checked) => setFormData({...formData, is_dropdown: checked})} />
              <Label>Dropdown Menü</Label>
            </div>
            <div>
              <Label>Sıra</Label>
              <Input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
              <Button type="submit">{editingItem ? 'Güncelle' : 'Ekle'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
