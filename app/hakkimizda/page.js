export const metadata = {
  title: 'Hakkımızda | Baraj Nakliyat',
  description: 'Baraj Nakliyat hakkında'
}

import SiteLayout from '@/components/site/SiteLayout'
import Breadcrumb from '@/components/site/Breadcrumb'
import { Card, CardContent } from '@/components/ui/card'

async function getPageData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/pages/hakkimizda`, { cache: 'no-store' })
    return res.json()
  } catch {
    return { title: 'Hakkımızda', content: '<p>İçerik yükleniyor...</p>' }
  }
}

export default async function HakkimizdaPage() {
  const pageData = await getPageData()
  
  return (
    <SiteLayout>
      <Breadcrumb items={[{ label: 'Hakkımızda', href: '/hakkimizda' }]} />
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-primary mb-6">{pageData.title}</h1>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: pageData.content }} />
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  )
}
