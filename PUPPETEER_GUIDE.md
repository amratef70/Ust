# 🚀 Puppeteer Server - الحل الواقعي والقوي

## 📖 ما هو Puppeteer؟

**Puppeteer** هي مكتبة Node.js قوية جداً تحاكي متصفح حقيقي (Headless Chrome/Chromium) وتسمح بـ:

- ✅ تحميل الصفحات بشكل حقيقي
- ✅ تنفيذ JavaScript
- ✅ التعامل مع الـ Cookies و Sessions
- ✅ تجاوز جميع قيود الأمان
- ✅ أخذ Screenshots
- ✅ ملء النماذج والتفاعل مع الصفحات

## 🎯 كيف يعمل الحل؟

```
المستخدم
    ↓
صفحة HTML (index.html)
    ↓
Puppeteer Server (Node.js)
    ↓
متصفح حقيقي (Headless Chrome)
    ↓
موقع الجامعة (portal.ust.edu.ye)
    ↓
HTML النظيف
    ↓
عرض في iframe
```

## 📋 المتطلبات

- **Node.js 18+**
- **npm** أو **yarn**
- **Express.js**
- **Puppeteer**
- **CORS**

## 🚀 التثبيت والتشغيل

### 1. تثبيت المكتبات
```bash
cd /home/ubuntu/clickjacking-lab
npm install
```

### 2. تشغيل Puppeteer Server
```bash
npm start
```

أو للتطوير:
```bash
npm run dev
```

### 3. فتح الصفحة
```
http://localhost:3000
```

## 📡 API Endpoints

### 1. تحميل صفحة
```
GET /api/load-page?url=<URL>
```

**مثال:**
```
http://localhost:3000/api/load-page?url=https://portal.ust.edu.ye
```

**الرد:**
```json
{
  "success": true,
  "html": "<html>...</html>",
  "url": "https://portal.ust.edu.ye",
  "timestamp": "2026-02-14T18:00:00.000Z"
}
```

### 2. أخذ Screenshot
```
GET /api/screenshot?url=<URL>
```

**مثال:**
```
http://localhost:3000/api/screenshot?url=https://portal.ust.edu.ye
```

**الرد:** صورة PNG

### 3. Health Check
```
GET /api/health
```

**الرد:**
```json
{
  "status": "ok",
  "browser": "initialized",
  "timestamp": "2026-02-14T18:00:00.000Z"
}
```

## 🔧 المميزات

### ✅ تحميل حقيقي
- يستخدم متصفح حقيقي
- ينفذ JavaScript
- يتعامل مع الـ Cookies

### ✅ معالجة متقدمة
- إزالة رؤوس الأمان
- إضافة Base Tag
- معالجة الأخطاء

### ✅ أداء عالي
- Timeout Management
- Connection Pooling
- Resource Cleanup

### ✅ سهولة الاستخدام
- API بسيط وواضح
- رسائل خطأ مفصلة
- Health Check

## 🌐 النشر على الإنترنت

### خيار 1: Render.com (مجاني)
1. اذهب إلى https://render.com
2. اختر "New Web Service"
3. ربط مستودع GitHub
4. اختر Node.js
5. اضغط Deploy

### خيار 2: Heroku
1. اذهب إلى https://heroku.com
2. اختر "Create New App"
3. ربط GitHub
4. اضغط Deploy

### خيار 3: Railway
1. اذهب إلى https://railway.app
2. اختر "New Project"
3. اختر GitHub
4. اضغط Deploy

## 📊 مثال عملي

### تحميل موقع الجامعة
```javascript
// في المتصفح
fetch('http://localhost:3000/api/load-page?url=https://portal.ust.edu.ye')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('frame').srcdoc = data.html;
    }
  });
```

## 🔒 الأمان

⚠️ **ملاحظة مهمة:**
- هذا مشروع تعليمي فقط
- لا تستخدمه لأغراض ضارة
- احترم سياسات الخصوصية والأمان
- لا تحاول الوصول لمواقع محمية بدون إذن

## 🐛 استكشاف الأخطاء

### المشكلة: Puppeteer لا يعمل
**الحل:**
```bash
npm install --save puppeteer
```

### المشكلة: Port 3000 مستخدم
**الحل:**
```bash
PORT=3001 npm start
```

### المشكلة: Timeout
**الحل:**
- تأكد من الاتصال بالإنترنت
- جرب URL مختلف
- زيادة timeout في الكود

## 📚 مراجع إضافية

- [Puppeteer Documentation](https://pptr.dev/)
- [Express.js Guide](https://expressjs.com/)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Clickjacking](https://owasp.org/www-community/attacks/Clickjacking)

## 🎓 الدرس التعليمي

هذا المشروع يوضح:

1. **تقنية Clickjacking** - إخفاء عناصر فوق محتوى آخر
2. **تجاوز X-Frame-Options** - باستخدام متصفح حقيقي
3. **Web Scraping** - استخراج محتوى الويب
4. **API Design** - بناء خوادم قوية
5. **Node.js** - تطوير Backend متقدم

---

**🚀 الآن لديك حل واقعي وقوي جداً!**
