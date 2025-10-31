# คู่มือการตั้งค่าระบบเทเลฟาร์มาซี

## 📋 สิ่งที่ต้องเตรียม

1. บัญชี Google สำหรับ Firebase
2. บัญชี Twilio (มี Free Trial)
3. เวลาประมาณ 15-20 นาที

---

## 🔥 ขั้นตอนที่ 1: ตั้งค่า Firebase

### 1.1 สร้าง Firebase Project

1. ไปที่ https://console.firebase.google.com/
2. คลิก **"Add project"** หรือ **"เพิ่มโปรเจกต์"**
3. ตั้งชื่อโปรเจกต์: `telepharmacy-th` (หรือชื่อที่คุณต้องการ)
4. คลิก **Continue**
5. ปิด Google Analytics (ไม่จำเป็นสำหรับ demo) หรือเปิดก็ได้
6. คลิก **Create project**
7. รอสักครู่จนโปรเจกต์ถูกสร้างเสร็จ

### 1.2 เพิ่ม Web App

1. ที่หน้า Project Overview คลิกไอคอน **</> (Web)**
2. ตั้งชื่อแอป: `Telepharmacy Web`
3. ✅ เลือก **"Also set up Firebase Hosting"** (optional)
4. คลิก **Register app**
5. **คัดลอกค่า Config** ที่แสดงออกมา จะได้ code คล้ายๆ นี้:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "telepharmacy-th.firebaseapp.com",
  projectId: "telepharmacy-th",
  storageBucket: "telepharmacy-th.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

6. คลิก **Continue to console**

### 1.3 เปิดใช้งาน Authentication

1. ที่เมนูด้านซ้าย คลิก **Authentication**
2. คลิก **Get started**
3. ที่แท็บ **Sign-in method**
4. คลิกที่ **Email/Password**
5. เปิดสวิตช์ **Enable** (แค่ตัวแรก ไม่ต้องเปิด Email link)
6. คลิก **Save**

### 1.4 สร้าง Firestore Database

1. ที่เมนูด้านซ้าย คลิก **Firestore Database**
2. คลิก **Create database**
3. เลือก **Start in test mode** (สำหรับ development)
4. คลิก **Next**
5. เลือก location: **asia-southeast1 (Singapore)** (ใกล้ไทยที่สุด)
6. คลิก **Enable**
7. รอสักครู่จน Database ถูกสร้างเสร็จ

### 1.5 ตั้งค่า Security Rules

1. ที่ Firestore Database คลิกแท็บ **Rules**
2. แทนที่ rules ด้วยโค้ดนี้:

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

3. คลิก **Publish**

---

## 📹 ขั้นตอนที่ 2: ตั้งค่า Twilio Video

### 2.1 สร้างบัญชี Twilio

1. ไปที่ https://www.twilio.com/try-twilio
2. กรอกข้อมูลสมัครสมาชิก (จะได้ Free credit $15 USD)
3. ยืนยันอีเมลและเบอร์โทรศัพท์

### 2.2 หา Account SID

1. ที่ Dashboard คุณจะเห็น **Account SID** และ **Auth Token**
2. **คัดลอก Account SID** เก็บไว้

### 2.3 สร้าง API Key

1. ที่เมนูด้านซ้าย ไปที่ **Account** > **API keys & tokens**
2. คลิก **Create API key**
3. ตั้งชื่อ: `Telepharmacy Video`
4. Key Type: **Standard**
5. คลิก **Create API Key**
6. **คัดลอก SID และ Secret ทันที** (จะไม่แสดงอีกครั้ง!)
   - API Key SID: `SKxxxxxxxxx`
   - API Key Secret: `xxxxxxxxxxxx`

---

## ⚙️ ขั้นตอนที่ 3: ใส่ Configuration ลงในแอป

### 3.1 แก้ไขไฟล์ .env.local

1. เปิดไฟล์ `C:\Users\USER\telepharmacy-th\.env.local`
2. แทนที่ค่าทั้งหมดด้วยค่าจริงที่คุณได้มา:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...คัดลอกจาก Firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=telepharmacy-th.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=telepharmacy-th
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=telepharmacy-th.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxx...คัดลอกจาก Twilio Dashboard
TWILIO_API_KEY=SKxxxxxxxxx...คัดลอกจาก Twilio API Key
TWILIO_API_SECRET=xxxxxxxxx...คัดลอกจาก Twilio API Secret
```

3. **Save ไฟล์**

### 3.2 Restart Development Server

1. ที่ Terminal หรือ Command Prompt
2. กด `Ctrl+C` เพื่อหยุด server
3. รันคำสั่ง:
```bash
cd telepharmacy-th
npm run dev
```

---

## ✅ ขั้นตอนที่ 4: ทดสอบระบบ

### 4.1 ทดสอบลงทะเบียน

1. เปิด http://localhost:3000
2. คลิก **ลงทะเบียนใหม่**
3. กรอกข้อมูล:
   - ชื่อ-นามสกุล: `ทดสอบ ผู้ป่วย`
   - อีเมล: `patient@test.com`
   - รหัสผ่าน: `123456` (อย่างน้อย 6 ตัว)
   - ประเภทผู้ใช้: **ผู้ป่วย**
4. คลิก **ลงทะเบียน**
5. ถ้าสำเร็จจะพาไปหน้าแรก

### 4.2 สร้างบัญชีเภสัชกร

1. เปิด tab ใหม่หรือออกจากระบบ
2. ลงทะเบียนใหม่:
   - ชื่อ-นามสกุล: `ดร.สมชาย ใจดี`
   - อีเมล: `pharmacist@test.com`
   - ประเภทผู้ใช้: **เภสัชกร**
   - เลขใบอนุญาตเภสัชกร: `PH-12345`
   - รหัสผ่าน: `123456`

### 4.3 ตรวจสอบใน Firebase Console

1. ไปที่ Firebase Console > Authentication
2. คุณควรเห็นผู้ใช้ 2 คน
3. ไปที่ Firestore Database
4. คุณควรเห็น collection `users` มี 2 documents

### 4.4 ทดสอบจองนัดหมาย

1. Login เป็น **patient@test.com**
2. คลิก **เภสัชกร** ที่ Navbar
3. คุณควรเห็น **ดร.สมชาย ใจดี** ในรายการ
4. คลิก **นัดหมาย**
5. เลือกวันที่และเวลา
6. กรอกเหตุผล: `ปรึกษาเรื่องยา`
7. คลิก **ยืนยันนัดหมาย**

### 4.5 ทดสอบวิดีโอคอล (ต้องมี 2 devices)

1. เปิด browser 2 tabs หรือ 2 devices
2. Tab 1: Login เป็น **patient@test.com**
3. Tab 2: Login เป็น **pharmacist@test.com**
4. ทั้งสองฝ่ายไปที่ **นัดหมาย**
5. คลิก **เข้าร่วมวิดีโอคอล** (ปุ่มจะแสดงเมื่อใกล้เวลานัดหมาย ±10 นาที)
6. ทดสอบวิดีโอคอล

---

## 🐛 แก้ปัญหาที่พบบ่อย

### ❌ "Firebase: Error (auth/invalid-api-key)"
- ตรวจสอบว่าคัดลอก API Key ถูกต้องใน `.env.local`
- ตรวจสอบว่าไฟล์ `.env.local` อยู่ใน root folder

### ❌ "Permission denied" ใน Firestore
- ตรวจสอบ Security Rules ใน Firestore
- ตรวจสอบว่า Login สำเร็จแล้ว

### ❌ ไม่เห็นเภสัชกรในรายการ
- ตรวจสอบว่าสร้างบัญชีเภสัชกรแล้ว
- ตรวจสอบใน Firestore Database ว่ามี user ที่ role = "pharmacist"

### ❌ วิดีโอคอลไม่ทำงาน
- ตรวจสอบ Twilio credentials ใน `.env.local`
- ตรวจสอบว่า browser อนุญาตให้ใช้กล้องและไมโครโฟน
- ต้องใช้ HTTPS หรือ localhost เท่านั้น (ไม่สามารถใช้ IP address ได้)

---

## 🎉 เสร็จสิ้น!

ตอนนี้คุณมีระบบ Telepharmacy ที่ใช้งานได้จริงแล้ว! 🎊

### ฟีเจอร์ที่ใช้งานได้:
✅ ลงทะเบียนและเข้าสู่ระบบ (ผู้ป่วย + เภสัชกร)
✅ ดูรายชื่อเภสัชกร
✅ จองนัดหมาย
✅ ดูรายการนัดหมาย
✅ วิดีโอคอลระหว่างผู้ป่วยและเภสัชกร

### ขั้นตอนต่อไป:
- Deploy ขึ้น Vercel หรือ hosting อื่นๆ
- เพิ่มฟีเจอร์ notification
- เพิ่มระบบรีวิวและคะแนนเภสัชกร
- เพิ่มการอัพโหลดรูปภาพ
- เพิ่มระบบชำระเงิน

---

## 📞 ต้องการความช่วยเหลือ?

หากมีปัญหาในการตั้งค่า กรุณาตรวจสอบ:
1. Console ใน Browser (F12 > Console)
2. Terminal ที่รัน npm run dev
3. Firebase Console > Authentication และ Firestore
