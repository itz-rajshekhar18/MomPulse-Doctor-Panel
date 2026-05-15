// Script to create a complete doctor account (Firebase Auth + Firestore)
// Run with: npx ts-node scripts/createDoctorAccount.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
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

// ============================================
// CONFIGURE YOUR DOCTOR DETAILS HERE
// ============================================
const DOCTOR_CONFIG = {
  email: 'raj.shekhar@mompulse.com',
  password: 'password123', // Change this to desired password
  name: 'Dr. Raj Shekhar',
  specialization: 'Obstetrics & Gynecology',
  hospital: 'MomPulse Medical Center',
  licenseNumber: 'MD-11111-IN'
};

async function createDoctorAccount() {
  try {
    console.log('🚀 Creating doctor account...\n');
    console.log('📧 Email:', DOCTOR_CONFIG.email);
    console.log('👤 Name:', DOCTOR_CONFIG.name);
    console.log('');

    // Step 1: Create Firebase Authentication account
    console.log('Step 1: Creating Firebase Auth account...');
    let doctorUid: string;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        DOCTOR_CONFIG.email, 
        DOCTOR_CONFIG.password
      );
      doctorUid = userCredential.user.uid;
      console.log('✅ Firebase Auth account created');
      console.log('   UID:', doctorUid);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️  Firebase Auth account already exists');
        console.log('   This email is already registered in Firebase Authentication');
        console.log('   Skipping Auth creation...\n');
        return;
      } else {
        throw error;
      }
    }

    // Step 2: Create Firestore doctor document
    console.log('\nStep 2: Creating Firestore doctor document...');
    const doctorData = {
      email: DOCTOR_CONFIG.email,
      name: DOCTOR_CONFIG.name,
      specialization: DOCTOR_CONFIG.specialization,
      hospital: DOCTOR_CONFIG.hospital,
      licenseNumber: DOCTOR_CONFIG.licenseNumber,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    // Use the UID as the document ID
    const doctorRef = doc(db, 'doctors', doctorUid);
    await setDoc(doctorRef, doctorData);
    console.log('✅ Firestore doctor document created');
    console.log('   Collection: doctors');
    console.log('   Document ID:', doctorUid);

    console.log('\n🎉 SUCCESS! Doctor account fully created!\n');
    console.log('═══════════════════════════════════════');
    console.log('LOGIN CREDENTIALS:');
    console.log('═══════════════════════════════════════');
    console.log('Email:', DOCTOR_CONFIG.email);
    console.log('Password:', DOCTOR_CONFIG.password);
    console.log('═══════════════════════════════════════\n');
    console.log('✅ You can now log in to the doctor panel!');

  } catch (error: any) {
    console.error('\n❌ Error creating doctor account:', error.message);
    console.error('\nFull error:', error);
    
    if (error.code === 'auth/weak-password') {
      console.log('\n💡 Tip: Password should be at least 6 characters');
    } else if (error.code === 'auth/invalid-email') {
      console.log('\n💡 Tip: Please check the email format');
    } else if (error.code === 'permission-denied') {
      console.log('\n💡 Tip: Check Firestore security rules');
    }
  }
}

createDoctorAccount();
