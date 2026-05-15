// Script to migrate approved doctors from doctorRequests to doctors collection
// Run with: npx ts-node scripts/migrateApprovedDoctors.ts

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, query, where, Timestamp } from 'firebase/firestore';

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

async function migrateApprovedDoctors() {
  try {
    console.log('🔍 Searching for approved doctors in doctorRequests collection...\n');

    // Query for approved doctors
    const doctorRequestsRef = collection(db, 'doctorRequests');
    const q = query(doctorRequestsRef, where('status', '==', 'approved'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('⚠️  No approved doctors found in doctorRequests collection.');
      return;
    }

    console.log(`✅ Found ${querySnapshot.size} approved doctor(s)\n`);

    // Migrate each approved doctor
    for (const docSnapshot of querySnapshot.docs) {
      const requestData = docSnapshot.data();
      const doctorUid = requestData.uid || docSnapshot.id;

      console.log('📋 Processing:', requestData.name || requestData.email);
      console.log('   UID:', doctorUid);

      // Create doctor document in doctors collection
      const doctorData = {
        email: requestData.email,
        name: requestData.name || requestData.fullName || 'Doctor',
        specialization: requestData.specialization || 'General Practice',
        hospital: requestData.hospital || requestData.clinic || 'Not specified',
        licenseNumber: requestData.licenseNumber || requestData.medicalLicense || 'Not provided',
        createdAt: requestData.createdAt || Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Use the UID as the document ID in doctors collection
      const doctorRef = doc(db, 'doctors', doctorUid);
      await setDoc(doctorRef, doctorData);

      console.log('   ✅ Migrated to doctors collection');
      console.log('   📄 Document ID:', doctorUid);
      console.log('   👤 Name:', doctorData.name);
      console.log('   🏥 Specialization:', doctorData.specialization);
      console.log('   🏢 Hospital:', doctorData.hospital);
      console.log('');
    }

    console.log('🎉 Migration completed successfully!');
    console.log('\n💡 Tip: You can now log in with the approved doctor accounts.');

  } catch (error: any) {
    console.error('❌ Error migrating doctors:', error.message);
    console.error(error);
  }
}

migrateApprovedDoctors();
