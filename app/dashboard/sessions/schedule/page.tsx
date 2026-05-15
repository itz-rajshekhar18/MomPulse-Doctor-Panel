'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, TopBar } from '@/components/dashboard';
import { createDoctorSession } from '@/lib/firestore';

const SESSION_TYPES = [
  'Video Consultation',
  'In-Clinic Visit',
  'Group Workshop',
  'Webinar',
];

const DURATIONS = [
  '15 Minutes',
  '30 Minutes',
  '45 Minutes',
  '1 Hour',
  '1.5 Hours',
  '2 Hours',
];

type SubmitState = 'idle' | 'saving' | 'success' | 'error';

export default function ScheduleSessionPage() {
  const { user, doctor } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sessionType, setSessionType] = useState('Video Consultation');
  const [maxParticipants, setMaxParticipants] = useState('10');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('30 Minutes');
  const [isPaid, setIsPaid] = useState(true);
  const [activeSection, setActiveSection] = useState('sessions');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const validate = () => {
    if (!title.trim()) return 'Session title is required.';
    if (!description.trim()) return 'Description is required.';
    if (!date) return 'Date is required.';
    if (!startTime) return 'Start time is required.';
    return null;
  };

  const buildPayload = (status: 'draft' | 'pending_approval') => {
    return {
      doctorId: user!.uid,
      doctorName: doctor?.name ?? user!.email ?? 'Unknown Doctor',
      title: title.trim(),
      description: description.trim(),
      sessionType,
      maxParticipants: parseInt(maxParticipants, 10) || 10,
      date,
      startTime,
      duration,
      isPaid,
      approvalStatus: status,
    };
  };

  const handleSaveAsDraft = async () => {
    const err = validate();
    if (err) { setErrorMsg(err); return; }
    setErrorMsg('');
    setSubmitState('saving');
    try {
      await createDoctorSession(buildPayload('draft'));
      setSubmitState('success');
      setTimeout(() => router.push('/dashboard/sessions'), 1200);
    } catch {
      setSubmitState('error');
      setErrorMsg('Failed to save draft. Please try again.');
    }
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setErrorMsg(err); return; }
    setErrorMsg('');
    setSubmitState('saving');
    try {
      await createDoctorSession(buildPayload('pending_approval'));
      setSubmitState('success');
      setTimeout(() => router.push('/dashboard/sessions'), 1200);
    } catch {
      setSubmitState('error');
      setErrorMsg('Failed to submit session. Please try again.');
    }
  };

  const isBusy = submitState === 'saving';

  return (
    <div className="flex h-screen bg-[#f5f4f0]">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-screen-xl mx-auto">

            {/* Back + heading */}
            <div className="mb-8">
              <button
                onClick={() => router.push('/dashboard/sessions')}
                className="flex items-center gap-1.5 text-sm text-purple-600 font-medium mb-4 hover:text-purple-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                BACK TO SCHEDULE
              </button>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule New Session</h1>
              <p className="text-gray-500">Create a new interactive health session or consultation for your patients.</p>
            </div>

            {/* Success banner */}
            {submitState === 'success' && (
              <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Session submitted! Redirecting…</span>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── Left / Form ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* Main form card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">

                  {/* Session Title */}
                  <div>
                    <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
                      Session Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Postpartum Wellness Workshop"
                      disabled={isBusy}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition disabled:opacity-50"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe what patients will learn…"
                      rows={5}
                      disabled={isBusy}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition resize-none disabled:opacity-50"
                    />
                  </div>

                  {/* Session Type + Max Participants */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
                        Session Type
                      </label>
                      <div className="relative">
                        <select
                          value={sessionType}
                          onChange={(e) => setSessionType(e.target.value)}
                          disabled={isBusy}
                          className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition pr-10 disabled:opacity-50"
                        >
                          {SESSION_TYPES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
                        Max Participants
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(e.target.value)}
                        disabled={isBusy}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Timing & Logistics */}
                  <div className="border border-gray-100 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold text-gray-800">Timing &amp; Logistics</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
                          Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          disabled={isBusy}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
                          Start Time <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          disabled={isBusy}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Duration</label>
                        <div className="relative">
                          <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            disabled={isBusy}
                            className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition pr-10 disabled:opacity-50"
                          >
                            {DURATIONS.map((d) => <option key={d}>{d}</option>)}
                          </select>
                          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Paid Session toggle */}
                  <div className="rounded-xl border border-pink-100 bg-pink-50 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-pink-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Paid Session</p>
                          <p className="text-sm text-gray-500">Monetize your expertise for this consultation.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsPaid(!isPaid)}
                        disabled={isBusy}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                          isPaid ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                        aria-pressed={isPaid}
                        aria-label="Toggle paid session"
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isPaid ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    {isPaid && (
                      <div className="flex items-start gap-3 bg-white rounded-lg px-4 py-3 border border-pink-100">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">Paid sessions require Super Admin approval</p>
                          <p className="text-xs text-gray-500 mt-0.5">Once submitted, your session will enter a pending state until reviewed.</p>
                        </div>
                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded-full whitespace-nowrap">
                          PENDING APPROVAL
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between pb-4">
                  <button
                    onClick={handleSaveAsDraft}
                    disabled={isBusy}
                    className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isBusy}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-full shadow-md transition-all disabled:opacity-60"
                  >
                    {isBusy && (
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    )}
                    {isBusy ? 'Submitting…' : 'Create & Send for Approval'}
                  </button>
                </div>
              </div>

              {/* ── Right / Preview panel ── */}
              <div className="space-y-5">

                {/* Live Preview card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Live Preview</p>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden mb-4 aspect-[4/3] flex items-center justify-center">
                    <div className="w-28 bg-white rounded-2xl shadow-lg p-3 space-y-2">
                      {title ? (
                        <p className="text-[8px] font-semibold text-gray-800 leading-tight line-clamp-2">{title}</p>
                      ) : (
                        <div className="h-2 bg-purple-200 rounded-full w-3/4" />
                      )}
                      <div className="h-2 bg-gray-100 rounded-full" />
                      <div className="h-2 bg-gray-100 rounded-full w-5/6" />
                      <div className="h-6 bg-gradient-to-r from-purple-500 to-pink-400 rounded-lg mt-2 flex items-center justify-center">
                        <span className="text-[7px] text-white font-medium">{sessionType}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Preview Your Session</h3>
                  <p className="text-sm text-gray-500">
                    This is how your session will appear in the MomPulse patient app once approved.
                  </p>
                </div>

                {/* Smart Tip card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded-full mb-4">
                    SMART TIP
                  </span>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">Peak Engagement Alert</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Our data shows sessions scheduled between{' '}
                        <span className="text-purple-600 font-medium">10:00 AM – 1:00 PM</span>{' '}
                        on Tuesdays have 40% higher attendance rates for new moms.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Your Schedule card */}
                <div className="bg-gray-900 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Your Schedule</p>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-400">No upcoming sessions scheduled</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
