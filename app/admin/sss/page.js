'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react'

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [formData, setFormData] = useState({
    question: '', answer: '', category: 'Genel', display_order: 0, is_active: true
  })

  useEffect(() => { fetchFaqs() }, [])

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/admin/faqs')
      const data = await res.json()
      setFaqs(data)
    } catch (error) {
      console.error('FAQs fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingFaq ? `/api/admin/faqs/${editingFaq.id}` : '/api/admin/faqs'
    const method = editingFaq ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(editingFaq ? 'SSS güncellendi!' : 'SSS eklendi!')
        setDialogOpen(false)
        resetForm()
        fetchFaqs()
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('SSS silindi!')
        fetchFaqs()
      }
    } catch (error) {
      toast.error('Silme başarısız')
    }
  }

  const openEditDialog = (faq) => {
    setEditingFaq(faq)
    setFormData(faq)
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingFaq(null)
    setFormData({ question: '', answer: '', category: 'Genel', display_order: 0, is_active: true })
  }

  const categories = ['Genel', 'Fiyatlandırma', 'Asansörlü Taşımacılık', 'Şehirlerarası', 'Paketleme']

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sık Sorulan Sorular</h1>
          <p className="text-muted-foreground">SSS içeriklerini yönetin</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Yeni Soru</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFaq ? 'Soruyu Düzenle' : 'Yeni Soru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Soru</Label>
                <Input value={formData.question} onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Cevap</Label>
                <Textarea value={formData.answer} onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))} rows={4} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sıra</Label>
                  <Input type="number" value={formData.display_order} onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))} />
                <Label>Aktif</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
                <Button type="submit">{editingFaq ? 'Güncelle' : 'Ekle'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : faqs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz SSS eklenmemiş</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className={!faq.is_active ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{faq.category}</span>
                      {!faq.is_active && <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">Pasif</span>}
                    </div>
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(faq)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(faq.id)}><Trash2 className="h-4 w-4" /></Button>
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
