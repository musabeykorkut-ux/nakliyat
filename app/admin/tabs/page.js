'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function TabsPage() {
  const [tabs, setTabs] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTab, setEditingTab] = useState(null)
  const [formData, setFormData] = useState({ tab_id: '', title: '', content: '', display_order: 0 })

  useEffect(() => {
    fetchTabs()
  }, [])

  const fetchTabs = async () => {
    try {
      const res = await fetch('/api/admin/tabs')
      const data = await res.json()
      setTabs(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = editingTab ? 'PATCH' : 'POST'
    const url = editingTab ? `/api/admin/tabs/${editingTab.id}` : '/api/admin/tabs'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success(editingTab ? 'Tab güncellendi' : 'Tab eklendi')
        setDialogOpen(false)
        fetchTabs()
        resetForm()
      }
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    try {
      await fetch(`/api/admin/tabs/${id}`, { method: 'DELETE' })
      toast.success('Tab silindi')
      fetchTabs()
    } catch (error) {
      toast.error('Hata')
    }
  }

  const resetForm = () => {
    setFormData({ tab_id: '', title: '', content: '', display_order: 0 })
    setEditingTab(null)
  }

  const openEditDialog = (tab) => {
    setEditingTab(tab)
    setFormData(tab)
    setDialogOpen(true)
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tab Yönetimi</h1>
          <p className="text-muted-foreground">Ana sayfa tab içerikleri</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Tab
        </Button>
      </div>

      <div className="grid gap-4">
        {tabs.map((tab) => (
          <Card key={tab.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{tab.title}</h3>
                <p className="text-sm text-muted-foreground">Tab ID: {tab.tab_id}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(tab)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(tab.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTab ? 'Tab Düzenle' : 'Yeni Tab'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Tab ID (tab1, tab2, tab3) *</Label>
              <Input value={formData.tab_id} onChange={(e) => setFormData({...formData, tab_id: e.target.value})} required />
            </div>
            <div>
              <Label>Başlık *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label>İçerik *</Label>
              <ReactQuill theme="snow" value={formData.content} onChange={(content) => setFormData({...formData, content})} className="bg-white" />
            </div>
            <div>
              <Label>Sıra</Label>
              <Input type="number" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
              <Button type="submit">{editingTab ? 'Güncelle' : 'Ekle'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
