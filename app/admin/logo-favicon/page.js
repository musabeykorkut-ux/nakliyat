'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'

export default function LogoFaviconPage() {
  const [settings, setSettings] = useState({ logo: '', favicon: '' })
  const [uploading, setUploading] = useState({ logo: false, favicon: false })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setSettings(data || { logo: '', favicon: '' })
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpload = async (type, file) => {
    if (!file) return

    setUploading(prev => ({ ...prev, [type]: true }))
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.url) {
        await updateSetting(type, data.url)
        toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} yüklendi`)
      }
    } catch (error) {
      toast.error('Yükleme hatası')
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  const updateSetting = async (key, value) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      })
      if (res.ok) {
        fetchSettings()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Logo & Favicon</h1>
        <p className="text-muted-foreground">Site logo ve favicon yönetimi</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.logo && (
              <div className="border rounded p-4 bg-muted">
                <img src={settings.logo} alt="Logo" className="h-16 object-contain" />
              </div>
            )}
            <div>
              <Label>Yeni Logo Yükle</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleUpload('logo', e.target.files?.[0])} 
                disabled={uploading.logo}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favicon</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.favicon && (
              <div className="border rounded p-4 bg-muted">
                <img src={settings.favicon} alt="Favicon" className="h-8 object-contain" />
              </div>
            )}
            <div>
              <Label>Yeni Favicon Yükle</Label>
              <Input 
                type="file" 
                accept="image/x-icon,image/png" 
                onChange={(e) => handleUpload('favicon', e.target.files?.[0])} 
                disabled={uploading.favicon}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
