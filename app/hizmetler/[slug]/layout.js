export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/services/${params.slug}`, { cache: 'no-store' })
    const service = await res.json()
    
    return {
      title: service?.meta_title || service?.title || 'Hizmet',
      description: service?.meta_description || service?.short_description,
      keywords: service?.meta_keywords,
      alternates: {
        canonical: service?.canonical_url || `${process.env.NEXT_PUBLIC_BASE_URL}/hizmetler/${params.slug}`
      },
      openGraph: {
        title: service?.meta_title || service?.title,
        description: service?.meta_description || service?.short_description,
        images: service?.og_image ? [{ url: service.og_image }] : service?.image ? [{ url: service.image }] : []
      }
    }
  } catch {
    return { title: 'Hizmet' }
  }
}

export default function Layout({ children }) {
  return children
}
