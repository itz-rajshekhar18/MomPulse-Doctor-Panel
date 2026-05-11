# MomPulse Doctor Panel

A modern, secure login portal for healthcare professionals specializing in maternal care, integrated with Firebase Authentication and Firestore.

## 🚀 Features

- **Firebase Authentication**: Secure email/password authentication
- **Firestore Database**: Real-time patient and appointment data
- **Modern UI**: Pink to purple gradient design matching the MomPulse brand
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Component-Based Architecture**: Modular, reusable React components
- **TypeScript**: Full type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## 📁 Project Structure

```
mompulse-doctor-panel/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Doctor dashboard with real-time stats
│   ├── login/
│   │   └── page.tsx          # Login page with Firebase auth
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout with AuthProvider
│   └── page.tsx              # Home page (auth-aware routing)
├── components/
│   ├── ui/
│   │   ├── Logo.tsx          # MomPulse logo component
│   │   ├── LoginForm.tsx     # Login form with Firebase integration
│   │   ├── LoginHeader.tsx   # Login page header
│   │   ├── LoginFooter.tsx   # Login page footer
│   │   ├── TestimonialCard.tsx # Doctor testimonial card
│   │   └── index.ts          # Component exports
│   └── ProtectedRoute.tsx    # Authentication guard component
├── contexts/
│   └── AuthContext.tsx       # Firebase authentication context
├── lib/
│   ├── firebase.ts           # Firebase configuration
│   ├── auth.ts              # Authentication utilities
│   └── firestore.ts         # Firestore database operations
├── scripts/
│   └── seedData.ts          # Sample data seeding script
├── .env                     # Environment variables
├── firestore.rules          # Firestore security rules
└── public/                  # Static assets
```

## 🔥 Firebase Integration

### Authentication
- Email/password authentication
- Real-time auth state management
- Secure session handling
- Error handling for common auth scenarios

### Firestore Database
- **Doctors Collection**: Doctor profiles and credentials
- **Patients Collection**: Patient information and medical history
- **Appointments Collection**: Appointment scheduling and tracking
- Real-time data synchronization
- Optimistic UI updates

### Security Rules
- Role-based access control
- Doctors can only access their own patients
- Secure data validation
- Authentication required for all operations

## 🎨 Design Features

### Color Scheme
- **Primary Gradient**: Pink to Purple (`from-pink-200 via-purple-100 to-purple-300`)
- **Button Gradient**: Pink to Purple (`from-pink-500 via-purple-500 to-purple-600`)
- **Logo Gradient**: Pink to Purple (`from-pink-500 to-purple-600`)

### Components
- **Logo**: Gradient background with "M" icon
- **Login Form**: Email/password fields with Firebase integration
- **Testimonial Card**: Dr. Elena Thorne's endorsement
- **Dashboard**: Real-time stats from Firestore

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project with Authentication and Firestore enabled

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

3. **Set up Firestore Rules**
   - Copy the rules from `firestore.rules`
   - Apply them in Firebase Console > Firestore > Rules

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see Firebase Setup above)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🔐 Authentication Flow

1. **Home Page** (`/`) - Auth-aware routing (redirects based on auth state)
2. **Login Page** (`/login`) - Firebase authentication form
3. **Dashboard** (`/dashboard`) - Protected route with real-time data

### Login Features
- Firebase email/password authentication
- Real-time error handling
- Password visibility toggle
- "Keep me signed in" option
- Forgot credentials link
- Admin support contact

## 🎯 Pages

### Login Page (`/login`)
- Firebase authentication integration
- Real-time error handling
- Loading states during authentication
- Responsive mobile design

### Dashboard (`/dashboard`)
- Real-time patient statistics from Firestore
- Today's appointments count
- Wellness analytics
- Recent activity feed
- Secure logout functionality

## 🧩 Components

### Authentication
- **AuthContext**: Firebase auth state management
- **ProtectedRoute**: Route protection component
- **LoginForm**: Firebase authentication form

### UI Components
- **Logo**: Reusable MomPulse branding
- **LoginHeader**: Page title and description
- **LoginFooter**: Support links and copyright
- **TestimonialCard**: Doctor endorsement

## 📊 Database Schema

### Doctors Collection
```typescript
{
  id: string;
  email: string;
  name: string;
  specialization: string;
  hospital: string;
  licenseNumber: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Patients Collection
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Timestamp;
  doctorId: string;
  pregnancyStatus: 'pre-pregnancy' | 'pregnant' | 'postpartum';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Appointments Collection
```typescript
{
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  appointmentDate: Timestamp;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🧪 Testing

### Sample Data
Use the seeding script to create test data:
```bash
npx ts-node scripts/seedData.ts
```

### Test Credentials
After seeding, you can use:
- **Email**: dr.elena@mompulse.com
- **Password**: testpassword123

## 🚀 Deployment

The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Firebase Hosting**
- **AWS Amplify**

### Environment Variables
Make sure to set all Firebase environment variables in your deployment platform.

## 📱 Responsive Design

- **Desktop**: Full two-column layout with testimonial
- **Tablet**: Optimized spacing and typography
- **Mobile**: Single-column layout, hidden testimonial

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Tech Stack
- **Framework**: Next.js 16.2.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI**: React 19.2.4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Build Tool**: Turbopack

## 🔒 Security

- Firebase Authentication for secure login
- Firestore security rules for data protection
- Role-based access control
- Input validation and sanitization
- HTTPS enforcement in production

## 📄 License

© 2024 MomPulse Sanctuary. Secure Healthcare Portal v4.2.0