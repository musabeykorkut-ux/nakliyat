export async function generateMetadata({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blog/${params.slug}`, { cache: 'no-store' })
    const post = await res.json()
    
    return {
      title: post?.meta_title || post?.title || 'Blog',
      description: post?.meta_description || post?.excerpt,
      keywords: post?.meta_keywords,
      alternates: {
        canonical: post?.canonical_url || `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${params.slug}`
      },
      openGraph: {
        title: post?.meta_title || post?.title,
        description: post?.meta_description || post?.excerpt,
        images: post?.og_image ? [{ url: post.og_image }] : post?.image ? [{ url: post.image }] : []
      }
    }
  } catch {
    return { title: 'Blog' }
  }
}

export default function Layout({ children }) {
  return children
}
