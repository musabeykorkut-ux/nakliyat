'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function HeroContentPage() {
  const [formData, setFormData] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/hero-content')
      const data = await res.json()
      setFormData(data || { title: '', content: '' })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/hero-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Hero içerik güncellendi')
      }
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hero İçerik</h1>
        <p className="text-muted-foreground">Slider altı makale alanı (h1 başlık)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adana Evden Eve Nakliyat</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Başlık (H1) *</Label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <Label>Makale İçeriği *</Label>
              <ReactQuill theme="snow" value={formData.content} onChange={(content) => setFormData({...formData, content})} className="bg-white" />
            </div>
            <Button type="submit">Kaydet</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
