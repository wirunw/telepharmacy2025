'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AvailableHours {
  startTime: string;
  endTime: string;
}

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [availableHours, setAvailableHours] = useState<AvailableHours>({
    startTime: '09:00',
    endTime: '17:00',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (user && user.role !== 'pharmacist') {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().availableHours) {
          setAvailableHours(docSnap.data().availableHours);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    if (user && user.role === 'pharmacist') {
      fetchSettings();
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    // Validate
    if (availableHours.startTime >= availableHours.endTime) {
      setMessage('เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        availableHours: availableHours,
      });

      setMessage('✅ บันทึกสำเร็จ!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('❌ เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 10) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        slots.push(`${hour}:${minute}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (loading || (user && user.role !== 'pharmacist')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ตั้งค่า</h1>
          <p className="text-gray-700 mb-8">กำหนดช่วงเวลาที่คุณให้บริการ</p>

          {message && (
            <div className={`mb-6 px-4 py-3 rounded-lg ${
              message.includes('✅')
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="startTime" className="block text-sm font-semibold text-gray-900 mb-2">
                เวลาเริ่มต้นให้บริการ
              </label>
              <select
                id="startTime"
                value={availableHours.startTime}
                onChange={(e) => setAvailableHours({ ...availableHours, startTime: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 font-medium"
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time} น.
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-semibold text-gray-900 mb-2">
                เวลาสิ้นสุดการให้บริการ
              </label>
              <select
                id="endTime"
                value={availableHours.endTime}
                onChange={(e) => setAvailableHours({ ...availableHours, endTime: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 font-medium"
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time} น.
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 หมายเหตุ:</span> ช่วงเวลาที่คุณกำหนดจะเป็นตัวเลือกที่ผู้ป่วยสามารถเลือกจองนัดหมายได้
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
