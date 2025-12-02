'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function FooterPage() {
  const [formData, setFormData] = useState({ about_text: '', copyright_text: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFooter()
  }, [])

  const fetchFooter = async () => {
    try {
      const res = await fetch('/api/admin/footer')
      const data = await res.json()
      setFormData(data || { about_text: '', copyright_text: '' })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Footer güncellendi')
      }
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Footer Ayarları</h1>
        <p className="text-muted-foreground">Alt bilgi alanı yönetimi</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Footer İçeriği</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Hakkımızda Metni</Label>
              <Textarea value={formData.about_text || ''} onChange={(e) => setFormData({...formData, about_text: e.target.value})} rows={5} />
            </div>
            <div>
              <Label>Copyright Metni</Label>
              <Textarea value={formData.copyright_text || ''} onChange={(e) => setFormData({...formData, copyright_text: e.target.value})} rows={2} />
            </div>
            <Button type="submit">Kaydet</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
