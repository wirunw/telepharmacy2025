# เทเลฟาร์มาซี (Telepharmacy Thailand)

แอปพลิเคชันบริการปรึกษาเภสัชกรออนไลน์สำหรับประเทศไทย พัฒนาด้วย Next.js, Firebase และ Twilio Video

## คุณสมบัติหลัก

- 🔐 **ระบบสมาชิก** - ลงทะเบียนและเข้าสู่ระบบสำหรับผู้ป่วยและเภสัชกร
- 👨‍⚕️ **รายชื่อเภสัชกร** - ดูรายชื่อและข้อมูลเภสัชกรที่ให้บริการ
- 📅 **นัดหมายออนไลน์** - จองเวลาปรึกษากับเภสัชกรได้ง่ายๆ
- 🎥 **วิดีโอคอล** - ปรึกษาเภสัชกรผ่านวิดีโอคอลแบบเรียลไทม์
- 🇹🇭 **ภาษาไทย** - อินเทอร์เฟซเป็นภาษาไทยทั้งหมด

## เทคโนโลยีที่ใช้

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Video**: Twilio Video
- **Font**: Sarabun (Thai font from Google Fonts)

## ติดตั้งและเริ่มต้นใช้งาน

### 1. Clone โปรเจกต์

```bash
cd telepharmacy-th
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Firebase

1. สร้างโปรเจกต์ใหม่ที่ [Firebase Console](https://console.firebase.google.com/)
2. เปิดใช้งาน Authentication (Email/Password)
3. สร้าง Firestore Database
4. คัดลอกค่า Configuration

### 4. ตั้งค่า Twilio

1. สร้างบัญชีที่ [Twilio](https://www.twilio.com/)
2. สร้าง API Key และ Secret จาก Console
3. คัดลอก Account SID, API Key และ API Secret

### 5. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` จาก `.env.local.example`:

```bash
cp .env.local.example .env.local
```

แก้ไขไฟล์ `.env.local` และใส่ค่าจาก Firebase และ Twilio:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_API_KEY=your_twilio_api_key
TWILIO_API_SECRET=your_twilio_api_secret
```

### 6. ตั้งค่า Firestore Rules

ไปที่ Firebase Console > Firestore Database > Rules และใส่ rules ดังนี้:

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
      allow read: if request.auth != null && (
        resource.data.patientId == request.auth.uid ||
        resource.data.pharmacistId == request.auth.uid
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.patientId == request.auth.uid ||
        resource.data.pharmacistId == request.auth.uid
      );
    }
  }
}
```

### 7. รันแอปพลิเคชัน

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

## โครงสร้างโปรเจกต์

```
telepharmacy-th/
├── app/
│   ├── api/
│   │   └── video-token/     # API endpoint สำหรับ Twilio tokens
│   ├── appointments/         # หน้ารายการนัดหมาย
│   ├── book/                 # หน้าจองนัดหมาย
│   ├── login/                # หน้าเข้าสู่ระบบ
│   ├── pharmacists/          # หน้ารายชื่อเภสัชกร
│   ├── register/             # หน้าลงทะเบียน
│   ├── video/                # หน้าวิดีโอคอล
│   ├── layout.tsx            # Layout หลัก
│   └── page.tsx              # หน้าแรก
├── components/
│   ├── Navbar.tsx            # Navigation bar
│   └── VideoRoom.tsx         # Component วิดีโอคอล
├── contexts/
│   └── AuthContext.tsx       # Context สำหรับ Authentication
├── lib/
│   └── firebase.ts           # Firebase configuration
├── types/
│   └── index.ts              # TypeScript types
└── .env.local.example        # ตัวอย่างไฟล์ environment variables
```

## การใช้งาน

### สำหรับผู้ป่วย

1. ลงทะเบียนเป็น "ผู้ป่วย"
2. เข้าสู่ระบบ
3. ดูรายชื่อเภสัชกรที่ "เภสัชกร"
4. เลือกเภสัชกรและกดปุ่ม "นัดหมาย"
5. เลือกวันที่ เวลา และกรอกรายละเอียด
6. ไปที่หน้า "นัดหมาย" เพื่อดูนัดหมายของคุณ
7. เมื่อถึงเวลานัดหมาย กดปุ่ม "เข้าร่วมวิดีโอคอล"

### สำหรับเภสัชกร

1. ลงทะเบียนเป็น "เภสัชกร" พร้อมเลขใบอนุญาต
2. เข้าสู่ระบบ
3. ไปที่หน้า "นัดหมาย" เพื่อดูนัดหมายจากผู้ป่วย
4. เมื่อถึงเวลานัดหมาย กดปุ่ม "เข้าร่วมวิดีโอคอล"

## การ Deploy

### Vercel (แนะนำ)

1. Push โค้ดไปยัง GitHub
2. Import โปรเจกต์ใน [Vercel](https://vercel.com)
3. ตั้งค่า Environment Variables ใน Vercel
4. Deploy

## ข้อควรระวัง

- Twilio Video มี [free tier](https://www.twilio.com/video/pricing) จำกัด ควรตรวจสอบ pricing
- ต้องมี HTTPS สำหรับการใช้งานกล้องและไมโครโฟนในเบราว์เซอร์
- ควรตั้งค่า Firebase Security Rules ให้เหมาะสมก่อน production

## ใบอนุญาต

MIT License

## ติดต่อ

หากมีปัญหาหรือข้อเสนอแนะ กรุณาแจ้งผ่าน Issues
