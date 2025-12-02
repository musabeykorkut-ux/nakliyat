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
import { Plus, Pencil, Trash2, FileText } from 'lucide-react'

const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function AdminBlog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', image: '',
    category: '', tags: '', meta_title: '', meta_description: '',
    meta_keywords: '', status: 'published', published_at: new Date().toISOString().split('T')[0]
  })

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog')
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Blog fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingPost ? `/api/admin/blog/${editingPost.id}` : '/api/admin/blog'
    const method = editingPost ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      })

      if (res.ok) {
        toast.success(editingPost ? 'Yazı güncellendi!' : 'Yazı eklendi!')
        setDialogOpen(false)
        resetForm()
        fetchPosts()
      } else {
        toast.error('İşlem başarısız')
      }
    } catch (error) {
      toast.error('Bir hata oluştu')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Yazı silindi!')
        fetchPosts()
      }
    } catch (error) {
      toast.error('Silme başarısız')
    }
  }

  const openEditDialog = (post) => {
    setEditingPost(post)
    setFormData({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      published_at: post.published_at?.split('T')[0] || new Date().toISOString().split('T')[0]
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingPost(null)
    setFormData({
      title: '', slug: '', excerpt: '', content: '', image: '',
      category: '', tags: '', meta_title: '', meta_description: '',
      meta_keywords: '', status: 'published', published_at: new Date().toISOString().split('T')[0]
    })
  }

  const handleTitleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: slugify(value),
      meta_title: value + ' | Baraj Nakliyat Blog'
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Yazıları</h1>
          <p className="text-muted-foreground">Blog içeriklerini yönetin</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Yeni Yazı</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Özet</Label>
                <Textarea value={formData.excerpt} onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>İçerik</Label>
                <Textarea value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} rows={8} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Input value={formData.category} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))} placeholder="Taşınma İpuçları" />
                </div>
                <div className="space-y-2">
                  <Label>Etiketler</Label>
                  <Input value={formData.tags} onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))} placeholder="etiket1, etiket2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Görsel URL</Label>
                  <Input value={formData.image} onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label>Yayın Tarihi</Label>
                  <Input type="date" value={formData.published_at} onChange={(e) => setFormData(prev => ({ ...prev, published_at: e.target.value }))} />
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">SEO Ayarları</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Meta Başlık</Label>
                    <Input value={formData.meta_title} onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Açıklama</Label>
                    <Textarea value={formData.meta_description} onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))} rows={2} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>İptal</Button>
                <Button type="submit">{editingPost ? 'Güncelle' : 'Ekle'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz blog yazısı eklenmemiş</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  {post.image && (
                    <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                    <div className="flex gap-2 mt-1">
                      {post.category && <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{post.category}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {post.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
