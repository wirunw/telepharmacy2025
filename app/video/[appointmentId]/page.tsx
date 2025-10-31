'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Appointment } from '@/types';
import VideoRoom from '@/components/VideoRoom';

export default function VideoCallPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.appointmentId as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [token, setToken] = useState<string>('');
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchAppointmentAndToken = async () => {
      if (!user) return;

      try {
        // Fetch appointment
        const docRef = doc(db, 'appointments', appointmentId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('ไม่พบข้อมูลนัดหมาย');
          setLoadingData(false);
          return;
        }

        const appointmentData = {
          ...docSnap.data(),
          scheduledDate: docSnap.data().scheduledDate.toDate(),
          createdAt: docSnap.data().createdAt.toDate(),
          updatedAt: docSnap.data().updatedAt.toDate(),
        } as Appointment;

        // Verify user has access to this appointment
        if (
          appointmentData.patientId !== user.uid &&
          appointmentData.pharmacistId !== user.uid
        ) {
          setError('คุณไม่มีสิทธิ์เข้าถึงนัดหมายนี้');
          setLoadingData(false);
          return;
        }

        setAppointment(appointmentData);

        // Get Twilio token
        const response = await fetch('/api/video-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identity: user.displayName,
            roomName: appointmentId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get video token');
        }

        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error('Error:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setLoadingData(false);
      }
    };

    if (user && appointmentId) {
      fetchAppointmentAndToken();
    }
  }, [user, appointmentId]);

  const handleDisconnect = () => {
    router.push('/appointments');
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl text-white">กำลังโหลด...</div>
      </div>
    );
  }

  if (error || !appointment || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">
            {error || 'ไม่สามารถเข้าสู่ห้องวิดีโอได้'}
          </p>
          <button
            onClick={() => router.push('/appointments')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            กลับไปหน้านัดหมาย
          </button>
        </div>
      </div>
    );
  }

  return <VideoRoom token={token} roomName={appointmentId} onDisconnect={handleDisconnect} />;
}
