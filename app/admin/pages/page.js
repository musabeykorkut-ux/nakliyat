'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function PagesManagement() {
  const [pages, setPages] = useState([])
  const [activePageKey, setActivePageKey] = useState('hakkimizda')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    canonical_url: ''
  })

  useEffect(() => {
    fetchPages()
  }, [])

  useEffect(() => {
    if (activePageKey) {
      fetchPage(activePageKey)
    }
  }, [activePageKey])

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/admin/pages')
      const data = await res.json()
      setPages(data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const fetchPage = async (pageKey) => {
    try {
      const res = await fetch(`/api/admin/pages/${pageKey}`)
      const data = await res.json()
      setFormData(data || {})
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/admin/pages/${activePageKey}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Sayfa güncellendi')
      }
    } catch (error) {
      toast.error('Hata oluştu')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sayfa Yönetimi</h1>
        <p className="text-muted-foreground">Hakkımızda ve İletişim sayfalarını düzenleyin</p>
      </div>

      <Tabs value={activePageKey} onValueChange={setActivePageKey}>
        <TabsList>
          <TabsTrigger value="hakkimizda">Hakkımızda</TabsTrigger>
          <TabsTrigger value="iletisim">İletişim</TabsTrigger>
        </TabsList>

        <TabsContent value={activePageKey} className="mt-6">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Başlık *</Label>
                  <Input 
                    value={formData.title || ''} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <Label>İçerik *</Label>
                  <ReactQuill 
                    theme="snow" 
                    value={formData.content || ''} 
                    onChange={(content) => setFormData({...formData, content})} 
                    className="bg-white"
                  />
                </div>
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-3">SEO Ayarları</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Meta Title</Label>
                      <Input 
                        value={formData.meta_title || ''} 
                        onChange={(e) => setFormData({...formData, meta_title: e.target.value})} 
                      />
                    </div>
                    <div>
                      <Label>Meta Description</Label>
                      <Input 
                        value={formData.meta_description || ''} 
                        onChange={(e) => setFormData({...formData, meta_description: e.target.value})} 
                      />
                    </div>
                    <div>
                      <Label>Meta Keywords</Label>
                      <Input 
                        value={formData.meta_keywords || ''} 
                        onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})} 
                      />
                    </div>
                    <div>
                      <Label>Canonical URL</Label>
                      <Input 
                        value={formData.canonical_url || ''} 
                        onChange={(e) => setFormData({...formData, canonical_url: e.target.value})} 
                        placeholder="https://barajnakliyat.com/hakkimizda"
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit">Kaydet</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
