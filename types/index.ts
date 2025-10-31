// User Types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: 'patient' | 'pharmacist';
  createdAt: Date;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: Date;
  address?: string;
  allergies?: string[];
}

export interface Pharmacist extends User {
  role: 'pharmacist';
  licenseNumber: string;
  specialization?: string;
  available: boolean;
  rating?: number;
  yearsOfExperience?: number;
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  pharmacistId: string;
  pharmacistName: string;
  scheduledDate: Date;
  scheduledTime: string;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  reason?: string;
  notes?: string;
  prescription?: string;
  roomId?: string; // For video call
  createdAt: Date;
  updatedAt: Date;
}

// Video Call Types
export interface VideoRoom {
  roomId: string;
  appointmentId: string;
  token: string;
  participantIdentity: string;
}

// Form Types
export interface AppointmentFormData {
  pharmacistId: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
  role: 'patient' | 'pharmacist';
  licenseNumber?: string; // Required for pharmacists
}
