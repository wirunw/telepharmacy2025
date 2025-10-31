# คู่มือการ Deploy Telepharmacy Application

แอปพลิเคชันนี้สามารถ deploy ได้หลาย platform โดยแนะนำ **Vercel** เป็นอันดับแรก

---

## ตัวเลือกที่ 1: Vercel (แนะนำที่สุด) ⭐

Vercel เป็น platform ที่ดีที่สุดสำหรับ Next.js เพราะทำโดยทีมเดียวกัน

### ขั้นตอนการ Deploy:

1. **สร้างบัญชี Vercel**
   - ไปที่ https://vercel.com/signup
   - Sign up ด้วย GitHub account

2. **Import Project**
   - คลิก "Add New..." → "Project"
   - เลือก repository: `wirunw/telepharmacy2025`
   - คลิก "Import"

3. **ตั้งค่า Environment Variables**

   คลิกที่ "Environment Variables" และเพิ่มค่าต่อไปนี้:

   ```
   # Firebase Configuration (คัดลอกจากไฟล์ .env.local ของคุณ)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Twilio Configuration (คัดลอกจากไฟล์ .env.local ของคุณ)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_API_KEY=your_twilio_api_key
   TWILIO_API_SECRET=your_twilio_api_secret
   ```

   > **หมายเหตุ:** คัดลอกค่าจริงจากไฟล์ `.env.local` ในเครื่องของคุณ

4. **Deploy**
   - คลิก "Deploy"
   - รอ 2-3 นาที
   - เสร็จแล้ว! 🎉

5. **ตั้งค่า Domain (ถ้าต้องการ)**
   - ไปที่ Settings → Domains
   - เพิ่ม custom domain ของคุณ

### ข้อดีของ Vercel:
- ✅ รองรับ Next.js App Router เต็มรูปแบบ
- ✅ รองรับ API Routes โดยอัตโนมัติ
- ✅ Free tier ใช้งานได้ดีมาก
- ✅ Auto deploy เมื่อ push code ใหม่
- ✅ HTTPS ฟรี
- ✅ Global CDN

---

## ตัวเลือกที่ 2: Railway

Railway เหมาะสำหรับ full-stack applications และมีความยืดหยุ่นสูง

### ขั้นตอนการ Deploy:

1. **สร้างบัญชี Railway**
   - ไปที่ https://railway.app/
   - Sign up ด้วย GitHub account

2. **สร้าง New Project**
   - คลิก "New Project"
   - เลือก "Deploy from GitHub repo"
   - เลือก repository: `wirunw/telepharmacy2025`

3. **ตั้งค่า Environment Variables**

   ไปที่ Variables tab และเพิ่ม:

   ```
   NODE_VERSION=18

   # Firebase Configuration (คัดลอกจากไฟล์ .env.local ของคุณ)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Twilio Configuration (คัดลอกจากไฟล์ .env.local ของคุณ)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_API_KEY=your_twilio_api_key
   TWILIO_API_SECRET=your_twilio_api_secret
   ```

   > **หมายเหตุ:** คัดลอกค่าจริงจากไฟล์ `.env.local` ในเครื่องของคุณ

4. **Deploy**
   - Railway จะ build และ deploy อัตโนมัติ
   - รอ 3-5 นาที
   - คัดลอก URL ที่ได้มา

### ข้อดีของ Railway:
- ✅ รองรับ Node.js เต็มรูปแบบ
- ✅ ความยืดหยุ่นสูง
- ✅ มี free tier $5/month credit
- ✅ มี database hosting (ถ้าต้องการ)

---

## ตัวเลือกที่ 3: Netlify

Netlify รองรับ Next.js แต่อาจมีข้อจำกัดบางอย่าง

### ขั้นตอนการ Deploy:

1. **สร้างบัญชี Netlify**
   - ไปที่ https://app.netlify.com/signup
   - Sign up ด้วย GitHub account

2. **Import Project**
   - คลิก "Add new site" → "Import an existing project"
   - เลือก GitHub และ repository: `wirunw/telepharmacy2025`

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **ตั้งค่า Environment Variables**

   ไปที่ Site settings → Environment variables และเพิ่มค่าเดียวกับด้านบน

5. **Deploy**
   - คลิก "Deploy site"
   - รอ 3-5 นาที

### หมายเหตุสำหรับ Netlify:
- ⚠️ API Routes อาจต้อง configure เพิ่มเติม
- ⚠️ อาจต้องใช้ `next export` หรือ Netlify Functions
- ✅ Free tier ใช้งานได้ดี

---

## การตั้งค่าเพิ่มเติมหลัง Deploy

### 1. อัปเดต Firebase Authorized Domains

1. ไปที่ [Firebase Console](https://console.firebase.com/)
2. เลือก project: **telepharmacy-th**
3. ไปที่ Authentication → Settings → Authorized domains
4. คลิก "Add domain"
5. เพิ่ม domain ของคุณ เช่น:
   - `your-app.vercel.app`
   - `your-domain.com`

### 2. ตรวจสอบ Firestore Security Rules

ตรวจสอบว่า Security Rules ยอมให้เข้าถึงจาก production domain:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Appointments collection
    match /appointments/{appointmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

### 3. Upgrade Twilio Account (สำหรับ Video Call)

เนื่องจาก Trial Account มีข้อจำกัด:

1. ไปที่ [Twilio Console](https://console.twilio.com/)
2. คลิก "Upgrade"
3. เติมเงิน $20-50 (จะได้ free credit เพิ่ม)
4. Video call จะสามารถใช้งานได้ทันที

---

## การทดสอบหลัง Deploy

1. **ทดสอบการลงทะเบียน**
   - ลงทะเบียนเป็น Patient
   - ลงทะเบียนเป็น Pharmacist

2. **ทดสอบการจองนัดหมาย**
   - เข้าสู่ระบบเป็น Patient
   - เลือกเภสัชกรและจองนัดหมาย

3. **ทดสอบการยืนยันนัดหมาย**
   - เข้าสู่ระบบเป็น Pharmacist
   - ยืนยันหรือปฏิเสธนัดหมาย

4. **ทดสอบ Video Call**
   - ทดสอบเข้าร่วมวิดีโอคอล (ต้อง upgrade Twilio ก่อน)

---

## การแก้ปัญหาที่พบบ่อย

### Build Failed บน Vercel/Railway

ตรวจสอบว่า:
- `package.json` มี dependencies ครบ
- Node.js version ถูกต้อง (18+)

### Environment Variables ไม่ทำงาน

ตรวจสอบว่า:
- ตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_` สำหรับ client-side
- Deploy ใหม่หลังจากเพิ่ม environment variables

### Firebase Authentication Error

ตรวจสอบว่า:
- เพิ่ม domain ใน Authorized domains แล้ว
- Firebase config ถูกต้อง

---

## ราคาโดยประมาณ

### Vercel (แนะนำ)
- **Hobby Plan**: ฟรี
  - 100 GB bandwidth/month
  - Unlimited requests
  - เหมาะสำหรับ development และ small production

- **Pro Plan**: $20/month
  - Unlimited bandwidth
  - Advanced analytics
  - เหมาะสำหรับ production

### Railway
- **Free Tier**: $5 credit/month (ใช้ได้ประมาณ 500 hours)
- **Developer Plan**: $5/month + usage
- เหมาะสำหรับ small to medium apps

### Netlify
- **Starter Plan**: ฟรี
  - 100 GB bandwidth/month
  - 300 build minutes/month

---

## สรุป

**แนะนำใช้ Vercel** เพราะ:
1. ใช้งานง่ายที่สุด
2. รองรับ Next.js เต็มรูปแบบ
3. Free tier เพียงพอสำหรับการใช้งานจริง
4. Deploy ไว, Auto deploy จาก GitHub
5. มี analytics และ monitoring ฟรี

**ขั้นตอนย่อ:**
1. Sign up Vercel → Import จาก GitHub
2. ใส่ Environment Variables
3. Deploy (2-3 นาที)
4. เพิ่ม domain ใน Firebase Authorized domains
5. ทดสอบแอปพลิเคชัน
6. (Optional) Upgrade Twilio สำหรับ Video Call

มีคำถามเพิ่มเติมตรงไหนไหม ครับ?
