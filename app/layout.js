import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/seo-settings/anasayfa`, { cache: 'no-store' })
    const seoData = await res.json()
    
    return {
      title: seoData?.meta_title || 'Baraj Nakliyat | Adana Evden Eve Nakliyat',
      description: seoData?.meta_description || 'Adana evden eve nakliyat hizmetleri',
      keywords: seoData?.meta_keywords || 'adana nakliyat, evden eve nakliyat',
      alternates: {
        canonical: seoData?.canonical_url || process.env.NEXT_PUBLIC_BASE_URL
      },
      openGraph: {
        title: seoData?.og_title || seoData?.meta_title,
        description: seoData?.og_description || seoData?.meta_description,
        images: seoData?.og_image ? [{ url: seoData.og_image }] : []
      }
    }
  } catch {
    return {
      title: 'Baraj Nakliyat | Adana Evden Eve Nakliyat',
      description: 'Adana evden eve nakliyat hizmetleri'
    }
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
