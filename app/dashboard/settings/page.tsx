'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, TopBar } from '@/components/dashboard';
import { updateDoctor } from '@/lib/firestore';

type SaveState = 'idle' | 'saving' | 'success' | 'error';

export default function SettingsPage() {
  const { user, doctor } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('settings');

  // Profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Save state
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (doctor) {
      setName(doctor.name || '');
      setEmail(doctor.email || '');
      setSpecialization(doctor.specialization || '');
      setHospital(doctor.hospital || '');
      setLicenseNumber(doctor.licenseNumber || '');
    }
  }, [doctor]);

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    if (!name.trim()) {
      setErrorMsg('Name is required.');
      return;
    }

    setErrorMsg('');
    setSaveState('saving');

    try {
      await updateDoctor(user.uid, {
        name: name.trim(),
        specialization: specialization.trim(),
        hospital: hospital.trim(),
        licenseNumber: licenseNumber.trim(),
      });
      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveState('error');
      setErrorMsg('Failed to update profile. Please try again.');
    }
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isBusy = saveState === 'saving';

  return (
    <div className="flex h-screen bg-[#f5f4f0]">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-500 mt-1">Manage your account and preferences</p>
            </div>

            {/* Success banner */}
            {saveState === 'success' && (
              <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Profile updated successfully!</span>
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Profile Section */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    <p className="text-sm text-gray-500 mt-1">Update your personal and professional details</p>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isBusy}
                    className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
                  >
                    {isBusy && (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    )}
                    {isBusy ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isBusy}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition disabled:opacity-50"
                      placeholder="Dr. Sarah Chen"
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                      placeholder="email@example.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      disabled={isBusy}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition disabled:opacity-50"
                      placeholder="Obstetrics & Gynecology"
                    />
                  </div>

                  {/* Hospital */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital/Clinic</label>
                    <input
                      type="text"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      disabled={isBusy}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition disabled:opacity-50"
                      placeholder="Sanctuary Health Medical Center"
                    />
                  </div>

                  {/* License Number */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Medical License Number</label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      disabled={isBusy}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition disabled:opacity-50"
                      placeholder="MD-12345-TX"
                    />
                  </div>
                </div>
              </div>

              {/* Appearance Section */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
                  <p className="text-sm text-gray-500 mt-1">Customize how the dashboard looks</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dark Mode</h3>
                      <p className="text-sm text-gray-500">Switch to a darker color scheme</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleDarkMode}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                      darkMode ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                    aria-pressed={darkMode}
                    aria-label="Toggle dark mode"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Note</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Dark mode is currently in beta. Some components may not display correctly. Your preference is saved locally.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Section */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Account</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your account security</p>
                </div>

                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900">Change Password</p>
                        <p className="text-sm text-gray-500">Update your password</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
