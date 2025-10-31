'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Pharmacist, Appointment } from '@/types';
import { format } from 'date-fns';

export default function BookAppointmentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const pharmacistId = params.pharmacistId as string;

  const [pharmacist, setPharmacist] = useState<Pharmacist | null>(null);
  const [loadingPharmacist, setLoadingPharmacist] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
    notes: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (user && user.role !== 'patient') {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchPharmacist = async () => {
      try {
        const docRef = doc(db, 'users', pharmacistId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPharmacist(docSnap.data() as Pharmacist);
        } else {
          setError('ไม่พบข้อมูลเภสัชกร');
        }
      } catch (error) {
        console.error('Error fetching pharmacist:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoadingPharmacist(false);
      }
    };

    if (pharmacistId) {
      fetchPharmacist();
    }
  }, [pharmacistId]);

  const generateTimeSlots = () => {
    if (!pharmacist) return [];

    // ใช้ availableHours จากเภสัชกร หรือ default 09:00-17:00
    const startTime = (pharmacist as any).availableHours?.startTime || '09:00';
    const endTime = (pharmacist as any).availableHours?.endTime || '17:00';

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const slots = [];
    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      slots.push(timeStr);

      // เพิ่ม 10 นาที
      currentMin += 10;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }

    return slots;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!user || !pharmacist) {
      setError('กรุณาเข้าสู่ระบบ');
      setSubmitting(false);
      return;
    }

    try {
      const appointmentData: Omit<Appointment, 'id'> = {
        patientId: user.uid,
        patientName: user.displayName,
        pharmacistId: pharmacist.uid,
        pharmacistName: pharmacist.displayName,
        scheduledDate: new Date(formData.date),
        scheduledTime: formData.time,
        duration: 10,
        status: 'scheduled',
        reason: formData.reason,
        notes: formData.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(collection(db, 'appointments'), appointmentData);

      alert('นัดหมายสำเร็จ!');
      router.push('/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      setError('เกิดข้อผิดพลาดในการสร้างนัดหมาย');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || loadingPharmacist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  if (!pharmacist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p className="text-xl text-red-600">{error || 'ไม่พบข้อมูลเภสัชกร'}</p>
        </div>
      </div>
    );
  }

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            นัดหมายกับเภสัชกร
          </h1>

          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
            <h2 className="font-semibold text-lg text-blue-800 mb-2">
              {pharmacist.displayName}
            </h2>
            {pharmacist.specialization && (
              <p className="text-sm text-gray-600 mb-1">
                {pharmacist.specialization}
              </p>
            )}
            <p className="text-sm text-gray-600">
              ใบอนุญาต: {pharmacist.licenseNumber}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-900 mb-2">
                วันที่ <span className="text-red-500">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                min={today}
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 font-medium"
                style={{ colorScheme: 'light' }}
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-semibold text-gray-900 mb-2">
                เวลา <span className="text-red-500">*</span>
              </label>
              <select
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 font-medium"
              >
                <option value="">เลือกเวลา</option>
                {generateTimeSlots().map((time) => (
                  <option key={time} value={time}>
                    {time} น.
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-semibold text-gray-900 mb-2">
                เหตุผลในการนัดหมาย <span className="text-red-500">*</span>
              </label>
              <input
                id="reason"
                name="reason"
                type="text"
                required
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-normal"
                placeholder="เช่น ปรึกษาเรื่องยา, อาการไม่พึงประสงค์จากยา"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-900 mb-2">
                หมายเหตุเพิ่มเติม
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-normal"
                placeholder="ข้อมูลเพิ่มเติมที่ต้องการให้เภสัชกรทราบ"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {submitting ? 'กำลังสร้างนัดหมาย...' : 'ยืนยันนัดหมาย'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
