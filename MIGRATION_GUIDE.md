# Doctor Data Migration Guide

## Problem
John Doe (john.doe@mompulse.com) is showing as "Dr. Doctor" because his data exists in the `doctorRequests` collection but not in the `doctors` collection.

## Solution Options

### Option 1: Manual Migration via Firebase Console (Recommended)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Navigate to Firestore Database**
3. **Find John Doe in `doctorRequests` collection**:
   - Look for the document with email: `john.doe@mompulse.com`
   - Note down his `uid` field value
   - Copy all his data (name, email, specialization, hospital, licenseNumber, etc.)

4. **Create a new document in `doctors` collection**:
   - Click on `doctors` collection
   - Click "Add document"
   - **IMPORTANT**: Use the `uid` value as the Document ID (not auto-generated)
   - Add these fields:
     ```
     email: "john.doe@mompulse.com"
     name: "Dr. John Doe" (or whatever name is in doctorRequests)
     specialization: (copy from doctorRequests)
     hospital: (copy from doctorRequests)
     licenseNumber: (copy from doctorRequests)
     createdAt: (timestamp - current time)
     updatedAt: (timestamp - current time)
     ```

5. **Save and refresh the app** - John Doe's data should now appear correctly!

### Option 2: Update Firestore Rules Temporarily

If you want to run the migration script, you need to temporarily update Firestore rules:

1. Go to Firebase Console → Firestore Database → Rules
2. Temporarily change to:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
3. Publish the rules
4. Run: `npx ts-node scripts/migrateApprovedDoctors.ts`
5. **IMPORTANT**: Restore the original security rules immediately after!

### Option 3: Use Firebase Admin SDK

Create a Node.js script with Firebase Admin SDK (requires service account key):

```typescript
import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();

async function migrate() {
  const snapshot = await db.collection('doctorRequests')
    .where('status', '==', 'approved')
    .get();
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    await db.collection('doctors').doc(data.uid).set({
      email: data.email,
      name: data.name,
      specialization: data.specialization,
      hospital: data.hospital,
      licenseNumber: data.licenseNumber,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

migrate();
```

## Quick Fix for Testing

If you just want to test with a working account, use the seeded doctor:
- **Email**: dr.elena@mompulse.com
- **Password**: testpassword123

This account already has proper data in the `doctors` collection.

## Long-term Solution

Update your admin panel's doctor approval workflow to automatically create the doctor document in the `doctors` collection when approving a doctor request. This ensures future approved doctors will have their data in the right place.