import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Doctor {
  id?: string;
  email: string;
  name: string;
  specialization: string;
  hospital: string;
  licenseNumber: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Patient {
  id?: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Timestamp;
  doctorId: string;
  pregnancyStatus: 'pre-pregnancy' | 'pregnant' | 'postpartum';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Appointment {
  id?: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  appointmentDate: Timestamp;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Collection references using the new structure
const DOCTORS_COLLECTION = 'doctorPanel/doctors';
const PATIENTS_COLLECTION = 'doctorPanel/patients';
const APPOINTMENTS_COLLECTION = 'doctorPanel/appointments';

// Doctor operations
export const getDoctorByEmail = async (email: string): Promise<Doctor | null> => {
  try {
    const q = query(collection(db, DOCTORS_COLLECTION), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Doctor;
  } catch (error) {
    console.error('Error getting doctor:', error);
    throw error;
  }
};

export const getDoctorById = async (doctorId: string): Promise<Doctor | null> => {
  try {
    const docRef = doc(db, DOCTORS_COLLECTION, doctorId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Doctor;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting doctor by ID:', error);
    throw error;
  }
};

export const createDoctor = async (doctorData: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, DOCTORS_COLLECTION), {
      ...doctorData,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

export const updateDoctor = async (doctorId: string, doctorData: Partial<Doctor>): Promise<void> => {
  try {
    const docRef = doc(db, DOCTORS_COLLECTION, doctorId);
    await updateDoc(docRef, {
      ...doctorData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};

// Patient operations
export const getPatientsByDoctor = async (doctorId: string): Promise<Patient[]> => {
  try {
    const q = query(
      collection(db, PATIENTS_COLLECTION), 
      where('doctorId', '==', doctorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Patient[];
  } catch (error) {
    console.error('Error getting patients:', error);
    throw error;
  }
};

export const getPatientById = async (patientId: string): Promise<Patient | null> => {
  try {
    const docRef = doc(db, PATIENTS_COLLECTION, patientId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Patient;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting patient by ID:', error);
    throw error;
  }
};

export const createPatient = async (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, PATIENTS_COLLECTION), {
      ...patientData,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

export const updatePatient = async (patientId: string, patientData: Partial<Patient>): Promise<void> => {
  try {
    const docRef = doc(db, PATIENTS_COLLECTION, patientId);
    await updateDoc(docRef, {
      ...patientData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

export const deletePatient = async (patientId: string): Promise<void> => {
  try {
    const docRef = doc(db, PATIENTS_COLLECTION, patientId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

// Appointment operations
export const getAppointmentsByDoctor = async (doctorId: string, limitCount: number = 10): Promise<Appointment[]> => {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('doctorId', '==', doctorId),
      orderBy('appointmentDate', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];
  } catch (error) {
    console.error('Error getting appointments:', error);
    throw error;
  }
};

export const getTodaysAppointments = async (doctorId: string): Promise<Appointment[]> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('doctorId', '==', doctorId),
      where('appointmentDate', '>=', Timestamp.fromDate(today)),
      where('appointmentDate', '<', Timestamp.fromDate(tomorrow)),
      orderBy('appointmentDate', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Appointment[];
  } catch (error) {
    console.error('Error getting today\'s appointments:', error);
    throw error;
  }
};

export const getAppointmentById = async (appointmentId: string): Promise<Appointment | null> => {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Appointment;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting appointment by ID:', error);
    throw error;
  }
};

export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), {
      ...appointmentData,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const updateAppointment = async (appointmentId: string, appointmentData: Partial<Appointment>): Promise<void> => {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    await updateDoc(docRef, {
      ...appointmentData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

// Analytics operations
export const getDashboardStats = async (doctorId: string) => {
  try {
    // Get total patients
    const patientsQuery = query(collection(db, PATIENTS_COLLECTION), where('doctorId', '==', doctorId));
    const patientsSnapshot = await getDocs(patientsQuery);
    const totalPatients = patientsSnapshot.size;

    // Get today's appointments
    const todaysAppointments = await getTodaysAppointments(doctorId);
    const todaysAppointmentCount = todaysAppointments.length;

    // Get recent appointments for activity
    const recentAppointments = await getAppointmentsByDoctor(doctorId, 5);

    // Calculate wellness score (mock calculation)
    const wellnessScore = Math.floor(Math.random() * 20) + 80; // 80-100%

    return {
      totalPatients,
      todaysAppointmentCount,
      wellnessScore,
      recentAppointments: recentAppointments.slice(0, 3)
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};