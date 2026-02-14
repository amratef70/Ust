const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let browser = null;

// تهيئة Puppeteer
async function initBrowser() {
    if (!browser) {
        try {
            browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--single-process'
                ],
                timeout: 30000
            });
            console.log('✅ Puppeteer Browser Initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Puppeteer:', error);
            throw error;
        }
    }
    return browser;
}

// Endpoint لتحميل الموقع
app.get('/api/load-page', async (req, res) => {
    const url = req.query.url || 'https://portal.ust.edu.ye';
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    let page = null;
    try {
        const browser = await initBrowser();
        page = await browser.newPage();

        // تعيين User Agent
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        // تعيين Viewport
        await page.setViewport({ width: 1920, height: 1080 });

        // تعيين Headers
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'ar-SA,ar;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Referer': 'https://www.google.com/'
        });

        // تحميل الصفحة
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // الانتظار قليلاً لتحميل JavaScript
        await page.waitForTimeout(2000);

        // الحصول على HTML
        let html = await page.content();

        // معالجة HTML
        html = html.replace(/X-Frame-Options/gi, '');
        html = html.replace(/Content-Security-Policy/gi, '');
        html = html.replace(/frame-ancestors/gi, '');

        // إضافة Base Tag
        if (!html.includes('<base')) {
            html = html.replace('<head>', `<head><base href="${url}">`);
        }

        res.json({
            success: true,
            html: html,
            url: url,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error loading page:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            url: url
        });
    } finally {
        if (page) {
            await page.close();
        }
    }
});

// Endpoint لأخذ Screenshot
app.get('/api/screenshot', async (req, res) => {
    const url = req.query.url || 'https://portal.ust.edu.ye';
    
    let page = null;
    try {
        const browser = await initBrowser();
        page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );

        await page.setViewport({ width: 1920, height: 1080 });

        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        const screenshot = await page.screenshot({ type: 'png' });

        res.type('image/png');
        res.send(screenshot);

    } catch (error) {
        console.error('❌ Error taking screenshot:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    } finally {
        if (page) {
            await page.close();
        }
    }
});

// Endpoint للـ Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        browser: browser ? 'initialized' : 'not initialized',
        timestamp: new Date().toISOString()
    });
});

// Endpoint الرئيسي
app.get('/', (req, res) => {
    res.json({
        name: 'Puppeteer Proxy Server',
        version: '1.0.0',
        endpoints: {
            'GET /api/load-page?url=<URL>': 'Load a webpage and return HTML',
            'GET /api/screenshot?url=<URL>': 'Take a screenshot of a webpage',
            'GET /api/health': 'Health check'
        }
    });
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`🚀 Puppeteer Proxy Server running on port ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔗 Load page: http://localhost:${PORT}/api/load-page?url=https://portal.ust.edu.ye`);
});

// معالجة الإغلاق
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    if (browser) {
        await browser.close();
    }
    process.exit(0);
});
