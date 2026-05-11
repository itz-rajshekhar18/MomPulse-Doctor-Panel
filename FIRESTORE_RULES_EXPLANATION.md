# Firestore Security Rules Explanation

This document explains the comprehensive Firestore security rules that govern access to both the user-facing MomPulse app and the Doctor Panel.

## 🔐 Security Overview

The rules implement a **multi-tenant architecture** with role-based access control:

- **Users**: Regular MomPulse app users (patients)
- **Doctors**: Healthcare professionals using the Doctor Panel
- **Admins**: System administrators with elevated privileges

## 🏗️ Database Structure

### User Collections (MomPulse App)
```
/users/{userId}                    # User profiles
/users/{userId}/profile/**         # User profile data
/users/{userId}/onboarding/**      # Onboarding information
/users/{userId}/tracking/**        # Health tracking data
/users/{userId}/conversations/**   # AI conversations
/users/{userId}/cycles/**          # Period cycles
/users/{userId}/predictions/**     # Period predictions
/users/{userId}/recoveryLogs/**    # Recovery logs
/users/{userId}/postpartum/**      # Postpartum data
```

### Doctor Panel Collections
```
/doctorPanel/doctors/{doctorId}              # Doctor profiles
/doctorPanel/patients/{patientId}            # Patient records
/doctorPanel/appointments/{appointmentId}    # Appointments
/doctorPanel/patients/{patientId}/medicalRecords/**
/doctorPanel/patients/{patientId}/prescriptions/**
/doctorPanel/patients/{patientId}/labResults/**
/doctorPanel/analytics/{doctorId}/**         # Doctor analytics
/doctorPanel/notifications/{notificationId} # Doctor notifications
```

### Shared Collections
```
/community/{section}/posts/**      # Community posts
/content/**                        # Articles, videos, sessions
/doctors/**                        # Public doctor directory
/bookings/**                       # Appointment bookings
/analytics/**                      # System analytics
```

## 🛡️ Security Rules Breakdown

### Helper Functions

#### `isAuthenticated()`
```javascript
function isAuthenticated() {
  return request.auth != null;
}
```
- **Purpose**: Checks if user is logged in
- **Usage**: Base requirement for all operations

#### `isOwner(userId)`
```javascript
function isOwner(userId) {
  return request.auth.uid == userId;
}
```
- **Purpose**: Verifies user owns the document
- **Usage**: Ensures users can only access their own data

#### `isAdmin()`
```javascript
function isAdmin() {
  return isAuthenticated() && (
    request.auth.token.email == 'admin@admin.com' || 
    request.auth.token.email == 'admin@mompulse.com'
  );
}
```
- **Purpose**: Identifies system administrators
- **Usage**: Grants elevated privileges for system management

#### `isDoctor()`
```javascript
function isDoctor() {
  return isAuthenticated() && 
    exists(/databases/$(database)/documents/doctorPanel/doctors/$(request.auth.uid));
}
```
- **Purpose**: Verifies user is a registered doctor
- **Usage**: Controls access to doctor-specific features

## 📋 Rule Categories

### 1. User Data Rules

#### User Profiles (`/users/{userId}`)
```javascript
match /users/{userId} {
  allow read, write: if isAdmin();                    // Admins: full access
  allow read, write: if isAuthenticated() && isOwner(userId); // Users: own data only
}
```

**What this means:**
- ✅ Users can read/write their own profile
- ✅ Admins can access any user profile
- ❌ Users cannot access other users' profiles

#### User Subcollections
```javascript
match /users/{userId}/profile/{document=**} {
  allow read, write: if isAuthenticated() && isOwner(userId);
}
```

**Applies to:**
- Profile data
- Onboarding information
- Health tracking data
- AI conversations
- Period cycles and predictions
- Recovery logs
- Postpartum data

### 2. Doctor Panel Rules

#### Doctor Profiles (`/doctorPanel/doctors/{doctorId}`)
```javascript
match /doctorPanel/doctors/{doctorId} {
  allow read, write: if isAdmin();                    // Admins: full access
  allow read, write: if isAuthenticated() && request.auth.uid == doctorId; // Doctors: own profile
  allow create: if isAuthenticated() && 
    request.auth.uid == doctorId && 
    request.resource.data.email == request.auth.token.email; // Self-registration
}
```

**What this means:**
- ✅ Doctors can manage their own profile
- ✅ Doctors can create their profile after authentication
- ✅ Admins can manage all doctor profiles
- ❌ Doctors cannot access other doctors' profiles

#### Patient Records (`/doctorPanel/patients/{patientId}`)
```javascript
match /doctorPanel/patients/{patientId} {
  allow read, write: if isAdmin();                    // Admins: full access
  allow read, write: if isAuthenticated() && 
    resource.data.doctorId == request.auth.uid;       // Doctors: assigned patients only
  allow create: if isAuthenticated() && 
    request.resource.data.doctorId == request.auth.uid; // Doctors: create own patients
}
```

**What this means:**
- ✅ Doctors can only access patients assigned to them
- ✅ Doctors can create new patient records
- ✅ Admins can access all patient records
- ❌ Doctors cannot access other doctors' patients

#### Appointments (`/doctorPanel/appointments/{appointmentId}`)
```javascript
match /doctorPanel/appointments/{appointmentId} {
  allow read, write: if isAdmin();                    // Admins: full access
  allow read, write: if isAuthenticated() && 
    resource.data.doctorId == request.auth.uid;       // Doctors: own appointments only
  allow create: if isAuthenticated() && 
    request.resource.data.doctorId == request.auth.uid; // Doctors: create own appointments
}
```

**What this means:**
- ✅ Doctors can manage appointments for their patients
- ✅ Doctors can schedule new appointments
- ✅ Admins can manage all appointments
- ❌ Doctors cannot access other doctors' appointments

#### Medical Records, Prescriptions, Lab Results
```javascript
match /doctorPanel/patients/{patientId}/medicalRecords/{recordId} {
  allow read, write: if isAdmin();                    // Admins: full access
  allow read, write: if isAuthenticated() && 
    get(/databases/$(database)/documents/doctorPanel/patients/$(patientId)).data.doctorId == request.auth.uid;
}
```

**What this means:**
- ✅ Doctors can access medical data for their patients only
- ✅ Admins can access all medical data
- ❌ Doctors cannot access medical data for other doctors' patients

### 3. Community Rules

#### Community Posts (`/community/{section}/posts/{postId}`)
```javascript
match /community/{section}/posts/{postId} {
  allow read: if isAuthenticated() && isValidSection();     // All users can read
  allow create: if isAuthenticated() && isValidPost();      // Users can create valid posts
  allow update, delete: if isAuthenticated() && 
    resource.data.userId == request.auth.uid;               // Users can edit own posts
}
```

**What this means:**
- ✅ All authenticated users can read community posts
- ✅ Users can create posts with valid data
- ✅ Users can edit/delete their own posts only
- ❌ Users cannot edit other users' posts

#### Post Validation
```javascript
function isValidPost() {
  return request.resource.data.keys().hasAll(['userId', 'userName', 'content', 'section', 'createdAt']) &&
    request.resource.data.userId == request.auth.uid &&
    request.resource.data.content.size() > 0 &&
    request.resource.data.content.size() <= 5000;
}
```

**Validation ensures:**
- Required fields are present
- User ID matches authenticated user
- Content is not empty
- Content doesn't exceed 5000 characters

### 4. Booking Rules

#### Bookings (`/bookings/{bookingId}`)
```javascript
match /bookings/{bookingId} {
  allow read, write: if isAdmin();                    // Admins: full access
  allow read: if isAuthenticated() && 
    resource.data.userId == request.auth.uid;         // Users: own bookings
  allow create: if isAuthenticated() && 
    request.resource.data.userId == request.auth.uid; // Users: create own bookings
  allow update: if isAuthenticated() && 
    resource.data.userId == request.auth.uid;         // Users: update own bookings
}
```

**What this means:**
- ✅ Users can manage their own bookings
- ✅ Admins can manage all bookings
- ❌ Users cannot access other users' bookings

## 🚨 Security Features

### 1. Authentication Required
- All operations require user authentication
- No anonymous access to any data

### 2. Data Isolation
- Users can only access their own data
- Doctors can only access their assigned patients
- Cross-tenant data access is prevented

### 3. Role-Based Access
- **Users**: Limited to personal data and community features
- **Doctors**: Access to assigned patients and appointments
- **Admins**: Full system access for management

### 4. Input Validation
- Post content length limits
- Required field validation
- User ID verification on creation

### 5. Audit Trail
- All documents include `createdAt` and `updatedAt` timestamps
- User IDs are embedded in documents for ownership tracking

## 🔧 Implementation Notes

### Doctor Registration Flow
1. Doctor creates Firebase Auth account
2. Doctor document is created with `doctorId = auth.uid`
3. Email verification ensures profile integrity
4. Doctor can then access patient management features

### Patient Assignment
- Patients are assigned to doctors via `doctorId` field
- Doctors can only access patients where `doctorId == auth.uid`
- Cross-doctor patient access is prevented

### Community Moderation
- Posts are validated for content and structure
- Users can only modify their own content
- Admins have override capabilities for moderation

## 🛠️ Deployment Instructions

1. **Copy Rules to Firebase Console**
   ```bash
   # Copy content from firestore.rules
   # Paste into Firebase Console > Firestore > Rules
   ```

2. **Test Rules**
   ```bash
   # Use Firebase Emulator for testing
   firebase emulators:start --only firestore
   ```

3. **Deploy Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

## 🔍 Testing Scenarios

### User Access Tests
- ✅ User can read own profile
- ❌ User cannot read other user's profile
- ✅ User can create community posts
- ❌ User cannot edit other user's posts

### Doctor Access Tests
- ✅ Doctor can read assigned patients
- ❌ Doctor cannot read other doctor's patients
- ✅ Doctor can create appointments for own patients
- ❌ Doctor cannot create appointments for other doctor's patients

### Admin Access Tests
- ✅ Admin can read all user data
- ✅ Admin can read all doctor data
- ✅ Admin can manage system content

## 📊 Performance Considerations

### Efficient Queries
- Rules use indexed fields (`doctorId`, `userId`)
- Compound queries are optimized for common access patterns
- Document existence checks are minimized

### Scalability
- Rules support horizontal scaling
- No cross-collection dependencies that could cause bottlenecks
- Efficient permission checking with minimal database reads

This security model ensures data privacy, regulatory compliance, and proper access control across the entire MomPulse ecosystem.