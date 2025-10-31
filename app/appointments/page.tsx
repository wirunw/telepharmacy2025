'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Appointment } from '@/types';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import Link from 'next/link';

export default function AppointmentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<(Appointment & { id: string })[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      try {
        const field = user.role === 'patient' ? 'patientId' : 'pharmacistId';
        const q = query(
          collection(db, 'appointments'),
          where(field, '==', user.uid),
          orderBy('scheduledDate', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const appointmentsData: (Appointment & { id: string })[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          appointmentsData.push({
            id: doc.id,
            ...data,
            scheduledDate: data.scheduledDate.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          } as Appointment & { id: string });
        });

        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'รอยืนยัน';
      case 'confirmed':
        return 'ยืนยันแล้ว';
      case 'in-progress':
        return 'กำลังดำเนินการ';
      case 'completed':
        return 'เสร็จสิ้น';
      case 'cancelled':
        return 'ยกเลิก';
      default:
        return status;
    }
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    setUpdatingStatus(appointmentId);
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: 'confirmed',
        updatedAt: new Date(),
      });

      // Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt
        )
      );

      alert('ยืนยันนัดหมายสำเร็จ!');
    } catch (error) {
      console.error('Error confirming appointment:', error);
      alert('เกิดข้อผิดพลาดในการยืนยันนัดหมาย');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleRejectAppointment = async (appointmentId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธนัดหมายนี้?')) {
      return;
    }

    setUpdatingStatus(appointmentId);
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: 'cancelled',
        updatedAt: new Date(),
      });

      // Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        )
      );

      alert('ปฏิเสธนัดหมายสำเร็จ');
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      alert('เกิดข้อผิดพลาดในการปฏิเสธนัดหมาย');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const canJoinVideoCall = (appointment: Appointment & { id: string }) => {
    const now = new Date();
    const appointmentTime = new Date(appointment.scheduledDate);
    const [hours, minutes] = appointment.scheduledTime.split(':');
    appointmentTime.setHours(parseInt(hours), parseInt(minutes));

    // Allow joining 10 minutes before and up to duration + 10 minutes after
    const tenMinutesBefore = new Date(appointmentTime.getTime() - 10 * 60000);
    const durationPlusTen = new Date(
      appointmentTime.getTime() + (appointment.duration + 10) * 60000
    );

    return (
      (appointment.status === 'confirmed' || appointment.status === 'in-progress') &&
      now >= tenMinutesBefore &&
      now <= durationPlusTen
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              นัดหมายของฉัน
            </h1>
            <p className="text-gray-700 text-lg">
              {user?.role === 'patient'
                ? 'รายการนัดหมายกับเภสัชกร'
                : 'รายการนัดหมายของผู้ป่วย'}
            </p>
          </div>
          {user?.role === 'patient' && (
            <Link
              href="/pharmacists"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
            >
              นัดหมายใหม่
            </Link>
          )}
        </div>

        {loadingAppointments ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-800 font-medium">กำลังโหลดข้อมูล...</div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-xl text-gray-800 font-medium mb-4">ยังไม่มีนัดหมาย</p>
            {user?.role === 'patient' && (
              <Link
                href="/pharmacists"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                สร้างนัดหมายแรกของคุณ
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {user?.role === 'patient'
                            ? `เภสัชกร ${appointment.pharmacistName}`
                            : `ผู้ป่วย ${appointment.patientName}`}
                        </h3>
                        <p className="text-gray-800 font-medium">
                          {format(appointment.scheduledDate, 'dd MMMM yyyy', {
                            locale: th,
                          })}{' '}
                          เวลา {appointment.scheduledTime} น.
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-800">
                      <p>
                        <span className="font-semibold text-gray-900">เหตุผล:</span>{' '}
                        {appointment.reason}
                      </p>
                      {appointment.notes && (
                        <p>
                          <span className="font-semibold text-gray-900">หมายเหตุ:</span>{' '}
                          {appointment.notes}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold text-gray-900">ระยะเวลา:</span>{' '}
                        {appointment.duration} นาที
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* ปุ่มสำหรับเภสัชกรยืนยัน/ปฏิเสธนัดหมาย */}
                    {user?.role === 'pharmacist' && appointment.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleConfirmAppointment(appointment.id)}
                          disabled={updatingStatus === appointment.id}
                          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                          {updatingStatus === appointment.id ? 'กำลังยืนยัน...' : '✓ ยืนยัน'}
                        </button>
                        <button
                          onClick={() => handleRejectAppointment(appointment.id)}
                          disabled={updatingStatus === appointment.id}
                          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                          {updatingStatus === appointment.id ? 'กำลังปฏิเสธ...' : '✗ ปฏิเสธ'}
                        </button>
                      </>
                    )}

                    {/* ปุ่มเข้าร่วมวิดีโอคอล */}
                    {canJoinVideoCall(appointment) && (
                      <Link
                        href={`/video/${appointment.id}`}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
                      >
                        <span>🎥</span>
                        เข้าร่วมวิดีโอคอล
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
