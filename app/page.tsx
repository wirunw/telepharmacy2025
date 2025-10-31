'use client';

import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                ยินดีต้อนรับสู่เทเลฟาร์มาซี
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                บริการปรึกษาเภสัชกรออนไลน์ สะดวก รวดเร็ว ปลอดภัย
              </p>
              {!user ? (
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/register"
                    className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg shadow-lg"
                  >
                    ลงทะเบียนใหม่
                  </Link>
                  <Link
                    href="/login"
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition text-lg border-2 border-white"
                  >
                    เข้าสู่ระบบ
                  </Link>
                </div>
              ) : (
                <Link
                  href={user.role === 'patient' ? '/pharmacists' : '/appointments'}
                  className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg shadow-lg"
                >
                  {user.role === 'patient' ? 'นัดหมายกับเภสัชกร' : 'ดูนัดหมายของฉัน'}
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              ทำไมต้องเลือกเทเลฟาร์มาซี
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  สะดวกสบาย
                </h3>
                <p className="text-gray-600">
                  ปรึกษาเภสัชกรได้ทุกที่ทุกเวลาผ่านแอปพลิเคชัน ไม่ต้องเดินทาง
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  เภสัชกรมืออาชีพ
                </h3>
                <p className="text-gray-600">
                  เภสัชกรที่ได้รับใบอนุญาตและมีประสบการณ์พร้อมให้คำปรึกษา
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">🎥</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  วิดีโอคอลคุณภาพสูง
                </h3>
                <p className="text-gray-600">
                  ปรึกษาแบบเห็นหน้าผ่านวิดีโอคอลที่มีคุณภาพและเสถียร
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  นัดหมายง่าย
                </h3>
                <p className="text-gray-600">
                  ระบบนัดหมายที่ใช้งานง่าย เลือกเวลาที่สะดวกได้เลย
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  ปลอดภัยและเป็นส่วนตัว
                </h3>
                <p className="text-gray-600">
                  ข้อมูลของคุณได้รับการเข้ารหัสและปกป้องอย่างดี
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">💊</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  คำปรึกษาครบถ้วน
                </h3>
                <p className="text-gray-600">
                  ให้คำแนะนำเกี่ยวกับยาและสุขภาพอย่างละเอียด
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              ขั้นตอนการใช้งาน
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-700">1</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">ลงทะเบียน</h3>
                <p className="text-gray-600 text-sm">สร้างบัญชีผู้ใช้งาน</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-700">2</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">เลือกเภสัชกร</h3>
                <p className="text-gray-600 text-sm">เลือกเภสัชกรที่ต้องการ</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-700">3</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">นัดหมาย</h3>
                <p className="text-gray-600 text-sm">เลือกวันและเวลา</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-700">4</span>
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">ปรึกษา</h3>
                <p className="text-gray-600 text-sm">ปรึกษาผ่านวิดีโอคอล</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="bg-blue-700 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                พร้อมที่จะเริ่มต้นแล้วหรือยัง?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                สร้างบัญชีและเริ่มปรึกษาเภสัชกรได้เลยวันนี้
              </p>
              <Link
                href="/register"
                className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg shadow-lg"
              >
                ลงทะเบียนฟรี
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 เทเลฟาร์มาซี. สงวนลิขสิทธิ์.</p>
        </div>
      </footer>
    </div>
  );
}
