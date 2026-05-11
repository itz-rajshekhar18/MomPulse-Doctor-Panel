# Dashboard Quick Start Guide

## 🚀 Getting Started

### 1. Access the Dashboard
- Navigate to `/dashboard` after logging in
- The dashboard automatically loads with your doctor profile

### 2. Dashboard Sections

#### Left Sidebar
- **Overview**: Main dashboard view
- **Patients**: Patient management
- **Analytics**: Performance metrics
- **Staff**: Team management
- **Settings**: Configuration options

#### Main Content Area

**Top Section**:
- Welcome banner with today's stats
- Quick action buttons (View Calendar, Patient Records)

**Middle Section**:
- Today's Appointments (left, 2/3 width)
- Monthly Earnings (right, 1/3 width)
- Upcoming Workshops (right, below earnings)

**Bottom Section**:
- Session Approvals (left)
- Article Submissions (right)

---

## 📊 Key Features

### Today's Appointments
- **View**: All appointments scheduled for today
- **Types**: VIDEO CALL, IN-CLINIC, CONSULTATION
- **Actions**: 
  - Click video icon to start video call
  - Click menu icon for more options
- **Status**: Color-coded by appointment type

### Monthly Earnings
- **Display**: Total earnings for the month
- **Trend**: Percentage change from last month
- **Chart**: Mini visualization of earnings trend
- **Update**: Refreshes daily

### Upcoming Workshops
- **Info**: Number of registered participants
- **Avatars**: Shows participant profile pictures
- **Action**: "Manage Sessions" button for details

### Session Approvals
- **Pending**: Sessions waiting for approval
- **Actions**: 
  - ✅ Approve session
  - ❌ Reject session
- **Info**: Proposer name and date

### Article Submissions
- **Status**: Needs Review, Published, Rejected
- **Actions**:
  - EDIT: For articles needing review
  - VIEW: For published articles
- **Icons**: Visual indicators for article type

---

## 🔄 Common Tasks

### View Today's Appointments
1. Dashboard loads automatically with today's appointments
2. Appointments sorted by time
3. Click on appointment for details
4. Click video icon to start video call

### Approve a Session
1. Scroll to "Session Approvals" section
2. Find the session to approve
3. Click the ✅ (checkmark) button
4. Session status updates

### Reject a Session
1. Scroll to "Session Approvals" section
2. Find the session to reject
3. Click the ❌ (X) button
4. Session status updates

### Edit an Article
1. Scroll to "Article Submissions" section
2. Find article with "Needs Review" status
3. Click "EDIT" button
4. Make changes and save

### View Published Article
1. Scroll to "Article Submissions" section
2. Find article with "Published" status
3. Click the 👁️ (eye) icon
4. Article opens in new view

---

## 📱 Responsive Design

### Desktop (1024px+)
- Full sidebar visible
- 3-column layout for appointments and earnings
- All sections visible at once

### Tablet (768px - 1023px)
- Sidebar may collapse
- 2-column layout
- Scroll to see all sections

### Mobile (< 768px)
- Sidebar collapses to hamburger menu
- Single column layout
- Scroll through all sections

---

## 🎨 Color Coding

### Appointment Types
- 🟣 **VIDEO CALL**: Purple badge
- 🔵 **IN-CLINIC**: Blue badge
- 🟢 **CONSULTATION**: Green badge

### Article Status
- 🟡 **Needs Review**: Yellow background
- 🟢 **Published**: Green background
- 🔴 **Rejected**: Red background

### Earnings Trend
- 📈 **Positive**: Green with up arrow
- 📉 **Negative**: Red with down arrow

---

## ⚙️ Settings & Preferences

### Profile Settings
1. Click your avatar in top-right corner
2. Select "Settings"
3. Update profile information
4. Save changes

### Notification Preferences
1. Go to Settings
2. Find "Notifications"
3. Toggle notification types
4. Save preferences

### Calendar Preferences
1. Go to Settings
2. Find "Calendar"
3. Choose calendar view (Day, Week, Month)
4. Save preferences

---

## 🔔 Notifications

### Notification Bell
- Located in top-right corner
- Shows unread notification count
- Click to view all notifications

### Notification Types
- 📅 Appointment reminders
- ✅ Session approvals
- 📝 Article submissions
- 👥 Patient updates

---

## 🆘 Troubleshooting

### Dashboard not loading
- Refresh the page (Ctrl+R or Cmd+R)
- Clear browser cache
- Check internet connection
- Verify you're logged in

### Appointments not showing
- Check if appointments exist in Firestore
- Verify doctor profile is set up
- Check Firestore security rules
- Try refreshing the page

### Buttons not working
- Check browser console for errors
- Verify Firebase configuration
- Ensure you have proper permissions
- Try logging out and back in

### Styling looks broken
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`
- Restart dev server: `npm run dev`
- Clear browser cache

---

## 📞 Support

### Getting Help
- Check DASHBOARD_COMPONENTS.md for detailed documentation
- Review Firestore rules in firestore.rules
- Check browser console for error messages
- Contact admin support

### Reporting Issues
- Note the exact error message
- Take a screenshot
- Note the steps to reproduce
- Contact development team

---

## 🔐 Security Notes

### Data Privacy
- Your data is encrypted in transit
- Firestore rules protect your data
- Only you can access your appointments
- Admins can access for support only

### Session Security
- Sessions expire after 24 hours
- Click "Logout" to end session immediately
- Don't share your login credentials
- Use strong passwords

---

## 📚 Additional Resources

- **Full Documentation**: See DASHBOARD_COMPONENTS.md
- **Firebase Setup**: See README.md
- **Security Rules**: See firestore.rules
- **API Reference**: See lib/firestore.ts

---

## 🎯 Next Steps

1. **Explore Dashboard**: Familiarize yourself with all sections
2. **Manage Appointments**: View and manage your appointments
3. **Review Sessions**: Approve or reject pending sessions
4. **Check Analytics**: Monitor your performance metrics
5. **Update Profile**: Complete your profile information

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- `Ctrl+K` or `Cmd+K`: Search (coming soon)
- `Ctrl+/` or `Cmd+/`: Help menu (coming soon)

### Quick Actions
- Click doctor name in sidebar to edit profile
- Click notification bell for quick access to alerts
- Use "View All" links to see complete lists

### Productivity Tips
- Pin frequently used sections
- Set up notification preferences
- Use calendar view for better planning
- Export reports for analysis

---

Last Updated: March 2024
Version: 1.0.0