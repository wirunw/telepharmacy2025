'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Pharmacist } from '@/types';
import Link from 'next/link';

export default function PharmacistsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([]);
  const [loadingPharmacists, setLoadingPharmacists] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (user && user.role !== 'patient') {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchPharmacists = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'pharmacist'));
        const querySnapshot = await getDocs(q);
        const pharmacistsData: Pharmacist[] = [];

        querySnapshot.forEach((doc) => {
          pharmacistsData.push({ ...doc.data() } as Pharmacist);
        });

        setPharmacists(pharmacistsData);
      } catch (error) {
        console.error('Error fetching pharmacists:', error);
      } finally {
        setLoadingPharmacists(false);
      }
    };

    if (user && user.role === 'patient') {
      fetchPharmacists();
    }
  }, [user]);

  if (loading || (user && user.role !== 'patient')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            เภสัชกรของเรา
          </h1>
          <p className="text-gray-600">
            เลือกเภสัชกรที่คุณต้องการปรึกษาและนัดหมายเวลา
          </p>
        </div>

        {loadingPharmacists ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">กำลังโหลดข้อมูลเภสัชกร...</div>
          </div>
        ) : pharmacists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">ยังไม่มีเภสัชกรในระบบ</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pharmacists.map((pharmacist) => (
              <div
                key={pharmacist.uid}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {pharmacist.displayName}
                    </h3>
                    {pharmacist.specialization && (
                      <p className="text-sm text-gray-600">
                        {pharmacist.specialization}
                      </p>
                    )}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      pharmacist.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {pharmacist.available ? 'พร้อมให้บริการ' : 'ไม่ว่าง'}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {pharmacist.yearsOfExperience && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <span className="mr-2">📅</span>
                      <span>ประสบการณ์ {pharmacist.yearsOfExperience} ปี</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="mr-2">📜</span>
                    <span>ใบอนุญาต: {pharmacist.licenseNumber}</span>
                  </div>
                  {pharmacist.rating && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <span className="mr-2">⭐</span>
                      <span>คะแนน {pharmacist.rating.toFixed(1)}/5.0</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/book/${pharmacist.uid}`}
                  className={`block w-full text-center py-2 rounded-lg font-medium transition shadow-md ${
                    pharmacist.available
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  {pharmacist.available ? 'นัดหมาย' : 'ไม่ว่าง'}
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
