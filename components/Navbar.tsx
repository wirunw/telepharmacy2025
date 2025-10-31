'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-12 w-12 rounded-full" />
            <span className="text-2xl font-bold text-blue-700">
              เทเลฟาร์มาซี
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  หน้าแรก
                </Link>
                {user.role === 'patient' && (
                  <Link
                    href="/pharmacists"
                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    เภสัชกร
                  </Link>
                )}
                <Link
                  href="/appointments"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  นัดหมาย
                </Link>
                {user.role === 'pharmacist' && (
                  <Link
                    href="/settings"
                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    ตั้งค่า
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {user.displayName}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md"
                >
                  ลงทะเบียน
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
