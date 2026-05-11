# Dashboard Components Documentation

This document describes all the dashboard components and their usage.

## 📁 Component Structure

```
components/dashboard/
├── DashboardHeader.tsx      # Welcome banner with quick actions
├── Sidebar.tsx              # Navigation sidebar with menu items
├── TopBar.tsx               # Top navigation bar with notifications
├── TodaysAppointments.tsx   # List of today's appointments
├── MonthlyEarnings.tsx      # Monthly earnings card with chart
├── UpcomingWorkshops.tsx    # Upcoming workshops section
├── SessionApprovals.tsx     # Session approval management
├── ArticleSubmissions.tsx   # Article submission tracking
└── index.ts                 # Component exports
```

## 🎨 Components Overview

### 1. DashboardHeader
**Purpose**: Welcome banner with key metrics and quick action buttons

**Props**:
```typescript
interface DashboardHeaderProps {
  appointmentsToday: number;
  pendingApprovals: number;
}
```

**Features**:
- Personalized welcome message
- Quick stats display
- Action buttons (View Calendar, Patient Records)
- Gradient purple background

**Usage**:
```tsx
<DashboardHeader
  appointmentsToday={8}
  pendingApprovals={3}
/>
```

---

### 2. Sidebar
**Purpose**: Main navigation menu with user profile

**Props**:
```typescript
interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}
```

**Features**:
- User profile section with avatar
- Navigation menu items (Overview, Patients, Analytics, Staff, Settings)
- Active section highlighting
- Logout button
- Premium access badge

**Menu Items**:
- 📊 Overview
- 👥 Patients
- 📈 Analytics
- 👨‍⚕️ Staff
- ⚙️ Settings

**Usage**:
```tsx
<Sidebar
  activeSection={activeSection}
  onSectionChange={setActiveSection}
/>
```

---

### 3. TopBar
**Purpose**: Top navigation with notifications and user info

**Features**:
- MomPulse Admin title
- Notification bell with badge
- Doctor name and specialization
- User avatar

**Usage**:
```tsx
<TopBar />
```

---

### 4. TodaysAppointments
**Purpose**: Display and manage today's appointments

**Props**:
```typescript
interface TodaysAppointmentsProps {
  appointments: Appointment[];
  loading: boolean;
}
```

**Features**:
- Time-based appointment display
- Appointment type badges (VIDEO CALL, IN-CLINIC, CONSULTATION)
- Video call button for video appointments
- Loading skeleton
- Empty state handling
- Hover effects

**Appointment Types**:
- 🎥 VIDEO CALL - Purple badge
- 🏥 IN-CLINIC - Blue badge
- 💬 CONSULTATION - Green badge

**Usage**:
```tsx
<TodaysAppointments
  appointments={todaysAppointments}
  loading={statsLoading}
/>
```

---

### 5. MonthlyEarnings
**Purpose**: Display monthly earnings with trend

**Props**:
```typescript
interface MonthlyEarningsProps {
  earnings: number;
  percentageChange: number;
}
```

**Features**:
- Currency formatting
- Percentage change indicator (up/down arrow)
- Mini chart visualization
- Gradient background
- Statistics icon

**Usage**:
```tsx
<MonthlyEarnings
  earnings={14280}
  percentageChange={12.5}
/>
```

---

### 6. UpcomingWorkshops
**Purpose**: Display upcoming wellness workshops

**Props**:
```typescript
interface UpcomingWorkshopsProps {
  workshops: Workshop[];
}

interface Workshop {
  id: string;
  title: string;
  registeredCount: number;
  image: string;
}
```

**Features**:
- Workshop participant avatars
- Registration count display
- Workshop image placeholder
- Manage Sessions button
- Default workshop data

**Usage**:
```tsx
<UpcomingWorkshops workshops={workshops} />
```

---

### 7. SessionApprovals
**Purpose**: Manage session approvals and rejections

**Props**:
```typescript
interface SessionApprovalsProps {
  sessions: SessionApproval[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

interface SessionApproval {
  id: string;
  title: string;
  proposedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}
```

**Features**:
- Session list with proposer info
- Approve/Reject buttons
- Status tracking
- Default sample data
- Hover effects

**Usage**:
```tsx
<SessionApprovals
  sessions={sessions}
  onApprove={handleSessionApprove}
  onReject={handleSessionReject}
/>
```

---

### 8. ArticleSubmissions
**Purpose**: Track article submissions and status

**Props**:
```typescript
interface ArticleSubmissionsProps {
  articles: ArticleSubmission[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

interface ArticleSubmission {
  id: string;
  title: string;
  status: 'needs-review' | 'published' | 'rejected';
  icon?: string;
}
```

**Features**:
- Status-based color coding
- Edit button for needs-review articles
- View button for published articles
- Status badges
- Default sample data

**Status Colors**:
- 🟡 Needs Review - Yellow
- 🟢 Published - Green
- 🔴 Rejected - Red

**Usage**:
```tsx
<ArticleSubmissions
  articles={articles}
  onEdit={handleArticleEdit}
  onView={handleArticleView}
/>
```

---

## 🎯 Dashboard Layout

The dashboard uses a responsive grid layout:

```
┌─────────────────────────────────────────────────────────┐
│                        TopBar                           │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   Sidebar    │         DashboardHeader                 │
│              │                                          │
│              ├──────────────────┬──────────────────────┤
│              │                  │                      │
│              │  TodaysAppts     │  MonthlyEarnings    │
│              │  (2/3 width)     │  (1/3 width)        │
│              │                  │                      │
│              │                  │  UpcomingWorkshops  │
│              ├──────────────────┴──────────────────────┤
│              │                                          │
│              │  SessionApprovals  │  ArticleSubmissions│
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

---

## 🔄 Data Flow

```
Dashboard Page
    ↓
useAuth() → Get doctor info
    ↓
getDashboardStats() → Fetch stats
getTodaysAppointments() → Fetch appointments
    ↓
Render Components with data
    ↓
User interactions → Callbacks (onApprove, onReject, etc.)
```

---

## 🎨 Styling

All components use:
- **Tailwind CSS** for styling
- **Gradient backgrounds** (pink to purple theme)
- **Responsive design** (mobile, tablet, desktop)
- **Hover effects** for interactivity
- **Loading states** with skeleton screens
- **Empty states** with helpful messages

---

## 📱 Responsive Breakpoints

- **Mobile**: Single column layout
- **Tablet**: 2-column layout
- **Desktop**: 3-column layout with sidebar

---

## 🔌 Integration Points

### Firebase Integration
- `useAuth()` - Get authenticated doctor
- `getDashboardStats()` - Fetch dashboard statistics
- `getTodaysAppointments()` - Fetch today's appointments

### State Management
- `useState` - Local component state
- `useEffect` - Data fetching
- `useRouter` - Navigation
- `useAuth` - Authentication context

---

## 🚀 Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Charts & Graphs**: Advanced analytics visualization
3. **Filters & Search**: Appointment and article filtering
4. **Export**: PDF/CSV export functionality
5. **Notifications**: Toast notifications for actions
6. **Dark Mode**: Dark theme support
7. **Mobile App**: React Native version
8. **Analytics Dashboard**: Detailed analytics page

---

## 🐛 Troubleshooting

### Components not rendering
- Check if `useAuth()` is properly initialized
- Verify Firebase configuration
- Check browser console for errors

### Data not loading
- Verify Firestore rules allow access
- Check network tab for API calls
- Ensure doctor profile exists in Firestore

### Styling issues
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Check Tailwind CSS configuration

---

## 📚 Related Files

- `/app/dashboard/page.tsx` - Main dashboard page
- `/contexts/AuthContext.tsx` - Authentication context
- `/lib/firestore.ts` - Firestore operations
- `/lib/firebase.ts` - Firebase configuration
- `/firestore.rules` - Security rules

---

## 📝 Notes

- All components are client-side (`'use client'`)
- Components use TypeScript for type safety
- Default data is provided for empty states
- Loading states use skeleton screens
- All interactions are callback-based for flexibility