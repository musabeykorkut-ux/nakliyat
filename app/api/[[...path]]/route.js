import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

// Supabase connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    // =====================
    // PUBLIC ROUTES
    // =====================

    // Root endpoint
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'Baraj Nakliyat API' }))
    }

    // GET /api/settings - Get site settings
    if (route === '/settings' && method === 'GET') {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Settings error:', error)
        // Return default settings if table doesn't exist
        return handleCORS(NextResponse.json({
          phone: '0 (536) 740 92 06',
          phone_raw: '05367409206',
          email: 'info@barajnakliyat.com',
          address: 'Adana, T\u00fcrkiye',
          whatsapp: '5367409206'
        }))
      }
      
      return handleCORS(NextResponse.json(data || {
        phone: '0 (536) 740 92 06',
        phone_raw: '05367409206',
        email: 'info@barajnakliyat.com',
        address: 'Adana, T\u00fcrkiye',
        whatsapp: '5367409206'
      }))
    }

    // GET /api/services - Get all services
    if (route === '/services' && method === 'GET') {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true })
      
      if (error) {
        console.error('Services error:', error)
        return handleCORS(NextResponse.json([]))
      }
      
      return handleCORS(NextResponse.json(data || []))
    }

    // GET /api/services/featured - Get featured services
    if (route === '/services/featured' && method === 'GET') {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(6)
      
      if (error) {
        console.error('Featured services error:', error)
        return handleCORS(NextResponse.json([]))
      }
      
      return handleCORS(NextResponse.json(data || []))
    }

    // GET /api/services/[slug] - Get single service
    if (route.startsWith('/services/') && method === 'GET' && path.length === 2) {
      const slug = path[1]
      if (slug === 'featured') return // Skip, handled above
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: 'Service not found' }, { status: 404 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    // GET /api/locations - Get all locations
    if (route === '/locations' && method === 'GET') {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      
      if (error) {
        console.error('Locations error:', error)
        return handleCORS(NextResponse.json([]))
      }
      
      return handleCORS(NextResponse.json(data || []))
    }

    // GET /api/blog - Get all blog posts
    if (route === '/blog' && method === 'GET') {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
      
      if (error) {
        console.error('Blog error:', error)
        return handleCORS(NextResponse.json([]))
      }
      
      return handleCORS(NextResponse.json(data || []))
    }

    // GET /api/blog/featured - Get featured blog posts
    if (route === '/blog/featured' && method === 'GET') {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3)
      
      if (error) {
        console.error('Featured blog error:', error)
        return handleCORS(NextResponse.json([]))
      }
      
      return handleCORS(NextResponse.json(data || []))
    }

    // GET /api/blog/[slug] - Get single blog post
    if (route.startsWith('/blog/') && method === 'GET' && path.length === 2) {
      const slug = path[1]
      if (slug === 'featured') return // Skip
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: 'Blog post not found' }, { status: 404 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    // GET /api/faq - Get all FAQs
    if (route === '/faq' && method === 'GET') {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      
      if (error) {
        console.error('FAQ error:', error)
        return handleCORS(NextResponse.json([]))
      }
      
      return handleCORS(NextResponse.json(data || []))
    }

    // GET /api/testimonials - Get all testimonials
    if (route === '/testimonials' && method === 'GET') {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      
      if (error) {
        console.error('Testimonials error:', error)
        return handleCORS(NextResponse.json([]))
      }
      
      return handleCORS(NextResponse.json(data || []))
    }

    // GET /api/gallery - Get all gallery items
    if (route === '/gallery' && method === 'GET') {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      
      if (error) {
        console.error('Gallery error:', error)
        return handleCORS(NextResponse.json([]))
      }
      
      return handleCORS(NextResponse.json(data || []))
    }

    // GET /api/homepage - Get homepage content
    if (route === '/homepage' && method === 'GET') {
      const { data, error } = await supabase
        .from('homepage')
        .select('*')
        .single()
      
      if (error) {
        console.error('Homepage error:', error)
        return handleCORS(NextResponse.json({}))
      }
      
      return handleCORS(NextResponse.json(data || {}))
    }

    // GET /api/seo/[page] - Get SEO settings for a page
    if (route.startsWith('/seo/') && method === 'GET') {
      const pageName = path[1]
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_name', pageName)
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({}))
      }
      
      return handleCORS(NextResponse.json(data || {}))
    }

    // POST /api/quote-request - Submit quote request
    if (route === '/quote-request' && method === 'POST') {
      const body = await request.json()
      
      const quoteRequest = {
        id: uuidv4(),
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        from_district: body.from_district,
        to_district: body.to_district,
        move_date: body.move_date || null,
        has_elevator: body.has_elevator || false,
        from_floor: body.from_floor || null,
        to_floor: body.to_floor || null,
        notes: body.notes || null,
        status: 'new',
        created_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('quote_requests')
        .insert([quoteRequest])
        .select()
        .single()
      
      if (error) {
        console.error('Quote request error:', error)
        return handleCORS(NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 }))
      }
      
      // TODO: Send email notification
      
      return handleCORS(NextResponse.json({ success: true, data }))
    }

    // POST /api/contact - Submit contact message
    if (route === '/contact' && method === 'POST') {
      const body = await request.json()
      
      const contactMessage = {
        id: uuidv4(),
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        message: body.message,
        is_read: false,
        created_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([contactMessage])
        .select()
        .single()
      
      if (error) {
        console.error('Contact message error:', error)
        return handleCORS(NextResponse.json({ error: 'Failed to submit message' }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json({ success: true, data }))
    }

    // =====================
    // ADMIN ROUTES
    // =====================

    // POST /api/admin/login - Admin login
    if (route === '/admin/login' && method === 'POST') {
      const body = await request.json()
      const { email, password } = body
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        return handleCORS(NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }))
      }
      
      return handleCORS(NextResponse.json({
        success: true,
        user: data.user,
        session: data.session
      }))
    }

    // GET /api/admin/stats - Admin dashboard stats
    if (route === '/admin/stats' && method === 'GET') {
      const [quotes, messages, services, blogs] = await Promise.all([
        supabase.from('quote_requests').select('id, status', { count: 'exact' }),
        supabase.from('contact_messages').select('id, is_read', { count: 'exact' }),
        supabase.from('services').select('id', { count: 'exact' }),
        supabase.from('blog_posts').select('id', { count: 'exact' })
      ])
      
      return handleCORS(NextResponse.json({
        total_quotes: quotes.count || 0,
        new_quotes: quotes.data?.filter(q => q.status === 'new').length || 0,
        total_messages: messages.count || 0,
        unread_messages: messages.data?.filter(m => !m.is_read).length || 0,
        total_services: services.count || 0,
        total_blogs: blogs.count || 0
      }))
    }

    // =====================
    // ADMIN CRUD - Settings
    // =====================
    if (route === '/admin/settings' && method === 'GET') {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single()
      
      return handleCORS(NextResponse.json(data || {}))
    }

    if (route === '/admin/settings' && method === 'PUT') {
      const body = await request.json()
      
      // First check if settings exist
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .single()
      
      let result
      if (existing) {
        result = await supabase
          .from('settings')
          .update(body)
          .eq('id', existing.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('settings')
          .insert([{ id: uuidv4(), ...body }])
          .select()
          .single()
      }
      
      if (result.error) {
        return handleCORS(NextResponse.json({ error: result.error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(result.data))
    }

    // =====================
    // ADMIN CRUD - Services
    // =====================
    if (route === '/admin/services' && method === 'GET') {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true })
      
      return handleCORS(NextResponse.json(data || []))
    }

    if (route === '/admin/services' && method === 'POST') {
      const body = await request.json()
      
      const service = {
        id: uuidv4(),
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/services/') && method === 'PUT') {
      const id = path[2]
      const body = await request.json()
      
      const { data, error } = await supabase
        .from('services')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/services/') && method === 'DELETE') {
      const id = path[2]
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // ADMIN CRUD - Locations
    // =====================
    if (route === '/admin/locations' && method === 'GET') {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('display_order', { ascending: true })
      
      return handleCORS(NextResponse.json(data || []))
    }

    if (route === '/admin/locations' && method === 'POST') {
      const body = await request.json()
      
      const location = {
        id: uuidv4(),
        ...body
      }
      
      const { data, error } = await supabase
        .from('locations')
        .insert([location])
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/locations/') && method === 'PUT') {
      const id = path[2]
      const body = await request.json()
      
      const { data, error } = await supabase
        .from('locations')
        .update(body)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/locations/') && method === 'DELETE') {
      const id = path[2]
      
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id)
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // ADMIN CRUD - Blog Posts
    // =====================
    if (route === '/admin/blog' && method === 'GET') {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      return handleCORS(NextResponse.json(data || []))
    }

    if (route === '/admin/blog' && method === 'POST') {
      const body = await request.json()
      
      const post = {
        id: uuidv4(),
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/blog/') && method === 'PUT') {
      const id = path[2]
      const body = await request.json()
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/blog/') && method === 'DELETE') {
      const id = path[2]
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // ADMIN CRUD - FAQs
    // =====================
    if (route === '/admin/faqs' && method === 'GET') {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true })
      
      return handleCORS(NextResponse.json(data || []))
    }

    if (route === '/admin/faqs' && method === 'POST') {
      const body = await request.json()
      
      const faq = {
        id: uuidv4(),
        ...body
      }
      
      const { data, error } = await supabase
        .from('faqs')
        .insert([faq])
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/faqs/') && method === 'PUT') {
      const id = path[2]
      const body = await request.json()
      
      const { data, error } = await supabase
        .from('faqs')
        .update(body)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/faqs/') && method === 'DELETE') {
      const id = path[2]
      
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id)
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // ADMIN CRUD - Testimonials
    // =====================
    if (route === '/admin/testimonials' && method === 'GET') {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true })
      
      return handleCORS(NextResponse.json(data || []))
    }

    if (route === '/admin/testimonials' && method === 'POST') {
      const body = await request.json()
      
      const testimonial = {
        id: uuidv4(),
        ...body
      }
      
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonial])
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/testimonials/') && method === 'PUT') {
      const id = path[2]
      const body = await request.json()
      
      const { data, error } = await supabase
        .from('testimonials')
        .update(body)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/testimonials/') && method === 'DELETE') {
      const id = path[2]
      
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // ADMIN - Quote Requests
    // =====================
    if (route === '/admin/quote-requests' && method === 'GET') {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false })
      
      return handleCORS(NextResponse.json(data || []))
    }

    if (route.startsWith('/admin/quote-requests/') && method === 'PUT') {
      const id = path[2]
      const body = await request.json()
      
      const { data, error } = await supabase
        .from('quote_requests')
        .update(body)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/quote-requests/') && method === 'DELETE') {
      const id = path[2]
      
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', id)
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // ADMIN - Contact Messages
    // =====================
    if (route === '/admin/contact-messages' && method === 'GET') {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
      
      return handleCORS(NextResponse.json(data || []))
    }

    if (route.startsWith('/admin/contact-messages/') && method === 'PUT') {
      const id = path[2]
      const body = await request.json()
      
      const { data, error } = await supabase
        .from('contact_messages')
        .update(body)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/contact-messages/') && method === 'DELETE') {
      const id = path[2]
      
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // ADMIN CRUD - Gallery
    // =====================
    if (route === '/admin/gallery' && method === 'GET') {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true })
      
      return handleCORS(NextResponse.json(data || []))
    }

    if (route === '/admin/gallery' && method === 'POST') {
      const body = await request.json()
      
      const item = {
        id: uuidv4(),
        ...body
      }
      
      const { data, error } = await supabase
        .from('gallery')
        .insert([item])
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/gallery/') && method === 'PUT') {
      const id = path[2]
      const body = await request.json()
      
      const { data, error } = await supabase
        .from('gallery')
        .update(body)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/gallery/') && method === 'DELETE') {
      const id = path[2]
      
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id)
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // ADMIN - SEO Settings
    // =====================
    if (route === '/admin/seo' && method === 'GET') {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('page_name', { ascending: true })
      
      return handleCORS(NextResponse.json(data || []))
    }

    if (route === '/admin/seo' && method === 'POST') {
      const body = await request.json()
      
      // Check if page already exists
      const { data: existing } = await supabase
        .from('seo_settings')
        .select('id')
        .eq('page_name', body.page_name)
        .single()
      
      let result
      if (existing) {
        result = await supabase
          .from('seo_settings')
          .update(body)
          .eq('id', existing.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('seo_settings')
          .insert([{ id: uuidv4(), ...body }])
          .select()
          .single()
      }
      
      if (result.error) {
        return handleCORS(NextResponse.json({ error: result.error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(result.data))
    }

    if (route.startsWith('/admin/seo/') && method === 'PUT') {
      const id = path[2]
      const body = await request.json()
      
      const { data, error } = await supabase
        .from('seo_settings')
        .update(body)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(data))
    }

    // =====================
    // ADMIN - Homepage Settings
    // =====================
    if (route === '/admin/homepage' && method === 'GET') {
      const { data, error } = await supabase
        .from('homepage')
        .select('*')
        .single()
      
      return handleCORS(NextResponse.json(data || {}))
    }

    if (route === '/admin/homepage' && method === 'PUT') {
      const body = await request.json()
      
      const { data: existing } = await supabase
        .from('homepage')
        .select('id')
        .single()
      
      let result
      if (existing) {
        result = await supabase
          .from('homepage')
          .update(body)
          .eq('id', existing.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('homepage')
          .insert([{ id: uuidv4(), ...body }])
          .select()
          .single()
      }
      
      if (result.error) {
        return handleCORS(NextResponse.json({ error: result.error.message }, { status: 500 }))
      }
      
      return handleCORS(NextResponse.json(result.data))
    }

    // =====================
    // ADMIN - File Upload
    // =====================
    if (route === '/admin/upload' && method === 'POST') {
      const formData = await request.formData()
      const file = formData.get('file')
      
      if (!file) {
        return handleCORS(NextResponse.json({ error: 'No file provided' }, { status: 400 }))
      }
      
      const fileName = `${Date.now()}-${file.name}`
      const buffer = Buffer.from(await file.arrayBuffer())
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true
        })
      
      if (error) {
        console.error('Upload error:', error)
        return handleCORS(NextResponse.json({ error: error.message }, { status: 500 }))
      }
      
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(data.path)
      
      return handleCORS(NextResponse.json({ url: urlData.publicUrl }))
    }

    // =====================
    // SLIDER ROUTES
    // =====================
    if (route === '/admin/sliders' && method === 'GET') {
      const { data, error } = await supabase.from('sliders').select('*').order('display_order')
      return handleCORS(NextResponse.json(data || []))
    }

    if (route === '/admin/sliders' && method === 'POST') {
      const body = await request.json()
      const { data, error } = await supabase.from('sliders').insert({ id: uuidv4(), ...body }).select().single()
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/sliders/') && method === 'PATCH') {
      const id = route.split('/').pop()
      const body = await request.json()
      const { data, error } = await supabase.from('sliders').update(body).eq('id', id).select().single()
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/sliders/') && method === 'DELETE') {
      const id = route.split('/').pop()
      await supabase.from('sliders').delete().eq('id', id)
      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // TABS ROUTES
    // =====================
    if (route === '/admin/tabs' && method === 'GET') {
      const { data } = await supabase.from('tabs').select('*').order('display_order')
      return handleCORS(NextResponse.json(data || []))
    }

    if (route === '/admin/tabs' && method === 'POST') {
      const body = await request.json()
      const { data } = await supabase.from('tabs').insert({ id: uuidv4(), ...body }).select().single()
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/tabs/') && method === 'PATCH') {
      const id = route.split('/').pop()
      const body = await request.json()
      const { data } = await supabase.from('tabs').update(body).eq('id', id).select().single()
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/tabs/') && method === 'DELETE') {
      const id = route.split('/').pop()
      await supabase.from('tabs').delete().eq('id', id)
      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // HERO CONTENT
    // =====================
    if (route === '/admin/hero-content' && method === 'GET') {
      const { data } = await supabase.from('hero_content').select('*').single()
      return handleCORS(NextResponse.json(data || {}))
    }

    if (route === '/admin/hero-content' && method === 'PUT') {
      const body = await request.json()
      const { data } = await supabase.from('hero_content').update(body).eq('id', 'default').select().single()
      return handleCORS(NextResponse.json(data))
    }

    // =====================
    // PAGES ROUTES
    // =====================
    if (route === '/admin/pages' && method === 'GET') {
      const { data } = await supabase.from('pages').select('*')
      return handleCORS(NextResponse.json(data || []))
    }

    if (route.startsWith('/admin/pages/') && method === 'GET') {
      const pageKey = route.split('/').pop()
      const { data } = await supabase.from('pages').select('*').eq('page_key', pageKey).single()
      return handleCORS(NextResponse.json(data || {}))
    }

    if (route.startsWith('/admin/pages/') && method === 'PATCH') {
      const pageKey = route.split('/').pop()
      const body = await request.json()
      const { data } = await supabase.from('pages').update(body).eq('page_key', pageKey).select().single()
      return handleCORS(NextResponse.json(data))
    }

    // =====================
    // MENU ROUTES
    // =====================
    if (route === '/admin/menu' && method === 'GET') {
      const { data } = await supabase.from('menu_items').select('*').order('display_order')
      return handleCORS(NextResponse.json(data || []))
    }

    if (route === '/admin/menu' && method === 'POST') {
      const body = await request.json()
      const { data } = await supabase.from('menu_items').insert({ id: uuidv4(), ...body }).select().single()
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/menu/') && method === 'PATCH') {
      const id = route.split('/').pop()
      const body = await request.json()
      const { data } = await supabase.from('menu_items').update(body).eq('id', id).select().single()
      return handleCORS(NextResponse.json(data))
    }

    if (route.startsWith('/admin/menu/') && method === 'DELETE') {
      const id = route.split('/').pop()
      await supabase.from('menu_items').delete().eq('id', id)
      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // FOOTER ROUTES
    // =====================
    if (route === '/admin/footer' && method === 'GET') {
      const { data } = await supabase.from('footer_settings').select('*').single()
      return handleCORS(NextResponse.json(data || {}))
    }

    if (route === '/admin/footer' && method === 'PUT') {
      const body = await request.json()
      const { data } = await supabase.from('footer_settings').update(body).eq('id', 'default').select().single()
      return handleCORS(NextResponse.json(data))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` },
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
