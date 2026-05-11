// This script can be used to seed sample data for testing
// Run with: npx ts-node scripts/seedData.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDDv58ra_Q2qWhKtWupqL5IUB5Wxgnuxxk",
  authDomain: "mompulse-5ceb8.firebaseapp.com",
  projectId: "mompulse-5ceb8",
  storageBucket: "mompulse-5ceb8.firebasestorage.app",
  messagingSenderId: "687365807902",
  appId: "1:687365807902:web:8fb62e279fe1cc843a730f",
  measurementId: "G-H0G2P1SP8V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function seedData() {
  try {
    console.log('Starting data seeding...');

    // Create a test doctor account
    const doctorEmail = 'dr.elena@mompulse.com';
    const doctorPassword = 'testpassword123';
    let doctorUid: string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, doctorEmail, doctorPassword);
      doctorUid = userCredential.user.uid;
      console.log('Created doctor user:', doctorUid);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('Doctor user already exists');
        // For existing users, we'll use a placeholder UID
        doctorUid = 'existing-doctor-uid';
      } else {
        throw error;
      }
    }

    // Add doctor data to Firestore using the new structure
    const doctorData = {
      email: doctorEmail,
      name: 'Dr. Elena Thorne',
      specialization: 'Obstetrics & Gynecology',
      hospital: 'Sanctuary Health Medical Center',
      licenseNumber: 'MD-12345-TX',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    // Use setDoc with the user's UID as the document ID
    const doctorRef = doc(db, 'doctors', doctorUid);
    await setDoc(doctorRef, doctorData);
    console.log('Created doctor document:', doctorUid);

    // Add sample patients using the new structure
    const patients = [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0101',
        dateOfBirth: Timestamp.fromDate(new Date('1990-05-15')),
        doctorId: doctorUid,
        pregnancyStatus: 'pregnant' as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        name: 'Emma Davis',
        email: 'emma.davis@email.com',
        phone: '+1-555-0102',
        dateOfBirth: Timestamp.fromDate(new Date('1988-08-22')),
        doctorId: doctorUid,
        pregnancyStatus: 'postpartum' as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        name: 'Lisa Wilson',
        email: 'lisa.wilson@email.com',
        phone: '+1-555-0103',
        dateOfBirth: Timestamp.fromDate(new Date('1992-12-03')),
        doctorId: doctorUid,
        pregnancyStatus: 'pre-pregnancy' as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    const patientIds: string[] = [];
    for (const patient of patients) {
      const patientRef = await addDoc(collection(db, 'patients'), patient);
      patientIds.push(patientRef.id);
      console.log(`Created patient: ${patient.name} (${patientRef.id})`);
    }

    // Add sample appointments using the new structure
    const appointments = [
      {
        patientId: patientIds[0] || 'patient1',
        doctorId: doctorUid,
        patientName: 'Sarah Johnson',
        appointmentDate: Timestamp.fromDate(new Date()),
        status: 'scheduled' as const,
        notes: 'Regular checkup',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        patientId: patientIds[1] || 'patient2',
        doctorId: doctorUid,
        patientName: 'Emma Davis',
        appointmentDate: Timestamp.fromDate(new Date(Date.now() + 86400000)), // Tomorrow
        status: 'scheduled' as const,
        notes: 'Postpartum follow-up',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        patientId: patientIds[2] || 'patient3',
        doctorId: doctorUid,
        patientName: 'Lisa Wilson',
        appointmentDate: Timestamp.fromDate(new Date(Date.now() - 86400000)), // Yesterday
        status: 'completed' as const,
        notes: 'Pre-pregnancy consultation',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ];

    for (const appointment of appointments) {
      const appointmentRef = await addDoc(collection(db, 'appointments'), appointment);
      console.log(`Created appointment for ${appointment.patientName} (${appointmentRef.id})`);
    }

    console.log('Data seeding completed successfully!');
    console.log('\nTest credentials:');
    console.log('Email:', doctorEmail);
    console.log('Password:', doctorPassword);
    console.log('\nFirestore Collections:');
    console.log('- doctors');
    console.log('- patients');
    console.log('- appointments');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Uncomment the line below to run the seeding
// seedData();