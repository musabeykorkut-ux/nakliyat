'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Phone, Mail, Trash2, Eye, Inbox, Check } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/contact-messages')
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('Messages fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`/api/admin/contact-messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: true })
      })

      if (res.ok) {
        toast.success('Okundu olarak işaretlendi!')
        fetchMessages()
      }
    } catch (error) {
      toast.error('İşlem başarısız')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/admin/contact-messages/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Mesaj silindi!')
        fetchMessages()
      }
    } catch (error) {
      toast.error('Silme başarısız')
    }
  }

  const openMessage = (message) => {
    setSelectedMessage(message)
    setDialogOpen(true)
    if (!message.is_read) {
      handleMarkAsRead(message.id)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Gelen Mesajlar</h1>
        <p className="text-muted-foreground">İletişim formundan gelen mesajları yönetin</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz mesaj yok</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${!message.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''}`}
              onClick={() => openMessage(message)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`font-semibold ${!message.is_read ? 'text-primary' : ''}`}>
                        {message.name}
                      </h3>
                      {!message.is_read && (
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">Yeni</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {message.phone}
                      </div>
                      {message.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {message.email}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(message.created_at), 'dd.MM.yyyy HH:mm', { locale: tr })}
                    </p>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {!message.is_read && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMarkAsRead(message.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mesaj Detayı</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ad Soyad</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <a href={`tel:${selectedMessage.phone}`} className="font-medium text-primary hover:underline">
                    {selectedMessage.phone}
                  </a>
                </div>
                {selectedMessage.email && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">E-posta</p>
                    <a href={`mailto:${selectedMessage.email}`} className="font-medium text-primary hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Mesaj</p>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Gönderilme: {format(new Date(selectedMessage.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
