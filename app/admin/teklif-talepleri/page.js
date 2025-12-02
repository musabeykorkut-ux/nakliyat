'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Phone, Mail, MapPin, Calendar, Trash2, Eye, ClipboardList } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function AdminQuoteRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/quote-requests')
      const data = await res.json()
      setRequests(data)
    } catch (error) {
      console.error('Requests fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/quote-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (res.ok) {
        toast.success('Durum güncellendi!')
        fetchRequests()
      }
    } catch (error) {
      toast.error('Güncelleme başarısız')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bu talebi silmek istediğinize emin misiniz?')) return

    try {
      const res = await fetch(`/api/admin/quote-requests/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Talep silindi!')
        fetchRequests()
      }
    } catch (error) {
      toast.error('Silme başarısız')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700'
      case 'in_progress': return 'bg-yellow-100 text-yellow-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'Yeni'
      case 'in_progress': return 'İşlemde'
      case 'completed': return 'Tamamlandı'
      case 'cancelled': return 'İptal'
      default: return status
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Teklif Talepleri</h1>
        <p className="text-muted-foreground">Gelen teklif taleplerini yönetin</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Henüz teklif talebi yok</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className={request.status === 'new' ? 'border-l-4 border-l-blue-500' : ''}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{request.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${request.phone}`} className="hover:text-primary">{request.phone}</a>
                      </div>
                      {request.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${request.email}`} className="hover:text-primary">{request.email}</a>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {request.from_district} → {request.to_district}
                      </div>
                      {request.move_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(request.move_date), 'dd MMMM yyyy', { locale: tr })}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(request.created_at), 'dd.MM.yyyy HH:mm', { locale: tr })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={request.status}
                      onValueChange={(value) => handleStatusChange(request.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Yeni</SelectItem>
                        <SelectItem value="in_progress">İşlemde</SelectItem>
                        <SelectItem value="completed">Tamamlandı</SelectItem>
                        <SelectItem value="cancelled">İptal</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => { setSelectedRequest(request); setDialogOpen(true); }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(request.id)}
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
            <DialogTitle>Teklif Talebi Detayı</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ad Soyad</p>
                  <p className="font-medium">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <p className="font-medium">{selectedRequest.phone}</p>
                </div>
                {selectedRequest.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">E-posta</p>
                    <p className="font-medium">{selectedRequest.email}</p>
                  </div>
                )}
                {selectedRequest.move_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Taşınma Tarihi</p>
                    <p className="font-medium">{format(new Date(selectedRequest.move_date), 'dd MMMM yyyy', { locale: tr })}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Çıkış İlçesi</p>
                  <p className="font-medium">{selectedRequest.from_district}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Varış İlçesi</p>
                  <p className="font-medium">{selectedRequest.to_district}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Çıkış Kat</p>
                  <p className="font-medium">{selectedRequest.from_floor || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Varış Kat</p>
                  <p className="font-medium">{selectedRequest.to_floor || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Asansör İhtiyacı</p>
                <p className="font-medium">{selectedRequest.has_elevator ? 'Evet' : 'Hayır'}</p>
              </div>
              {selectedRequest.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notlar</p>
                  <p className="font-medium">{selectedRequest.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
