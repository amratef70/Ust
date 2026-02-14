/**
 * Cloudflare Worker - Advanced Proxy for Portal UST
 * This worker acts as a powerful proxy to bypass all security restrictions
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // إذا كان الطلب للـ proxy endpoint
  if (url.pathname === '/proxy') {
    const targetUrl = url.searchParams.get('url')
    
    if (!targetUrl) {
      return new Response('Missing URL parameter', { status: 400 })
    }
    
    try {
      // جلب الموقع المستهدف
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        },
        cf: {
          cacheTtl: 0,
          mirage: false,
          polish: 'off'
        }
      })
      
      // معالجة المحتوى
      let html = await response.text()
      
      // إزالة رؤوس الحماية
      html = html.replace(/X-Frame-Options/gi, 'X-Frame-Options-Disabled')
      html = html.replace(/Content-Security-Policy/gi, 'CSP-Disabled')
      html = html.replace(/frame-ancestors/gi, 'frame-ancestors-disabled')
      
      // إضافة base tag
      const baseTag = `<base href="${targetUrl}">`
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${baseTag}</head>`)
      } else {
        html = `<head>${baseTag}</head>${html}`
      }
      
      // إرجاع المحتوى مع رؤوس CORS
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Proxy': 'Cloudflare-Worker'
        }
      })
    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message,
        status: 'failed'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  }
  
  // الصفحة الرئيسية
  return new Response(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>Cloudflare Worker Proxy</title>
      <style>
        body { font-family: Arial; text-align: center; padding: 50px; }
        h1 { color: #FF6B00; }
      </style>
    </head>
    <body>
      <h1>✅ Cloudflare Worker Proxy يعمل</h1>
      <p>استخدم: /proxy?url=https://example.com</p>
    </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
}
