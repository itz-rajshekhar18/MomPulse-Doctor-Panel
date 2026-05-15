'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, TopBar } from '@/components/dashboard';
import { createDoctorContent } from '@/lib/firestore';

const CATEGORIES = [
  'Postnatal Care',
  'Pregnancy',
  'Nutrition',
  'Mental Health',
  'Exercise & Fitness',
  'Baby Care',
  'Breastfeeding',
];

const CONTENT_TYPES = ['Article', 'Video'];

type SubmitState = 'idle' | 'saving' | 'success' | 'error';

export default function WriterPage() {
  const { user, doctor } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('writer');

  const [contentType, setContentType] = useState<'Article' | 'Video'>('Article');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Postnatal Care');
  const [tags, setTags] = useState<string[]>(['NewMoms', 'Recovery']);
  const [tagInput, setTagInput] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const validate = () => {
    if (!title.trim()) return 'Title is required.';
    if (!content.trim()) return 'Content is required.';
    if (contentType === 'Video' && !videoUrl.trim()) return 'Video URL is required.';
    return null;
  };

  const buildPayload = (status: 'draft' | 'pending_approval') => {
    const payload: any = {
      doctorId: user!.uid,
      doctorName: doctor?.name ?? user!.email ?? 'Unknown Doctor',
      contentType: contentType.toLowerCase() as 'article' | 'video',
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      approvalStatus: status,
    };

    // Only add videoUrl if it's a video and has a value
    if (contentType === 'Video' && videoUrl.trim()) {
      payload.videoUrl = videoUrl.trim();
    }

    return payload;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleSaveDraft = async () => {
    const err = validate();
    if (err) { setErrorMsg(err); return; }
    setErrorMsg('');
    setSubmitState('saving');
    try {
      await createDoctorContent(buildPayload('draft'));
      setSubmitState('success');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (error) {
      console.error('Save draft error:', error);
      setSubmitState('error');
      setErrorMsg('Failed to save draft. Please try again.');
    }
  };

  const handlePublish = async () => {
    const err = validate();
    if (err) { setErrorMsg(err); return; }
    setErrorMsg('');
    setSubmitState('saving');
    try {
      await createDoctorContent(buildPayload('pending_approval'));
      setSubmitState('success');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (error) {
      console.error('Publish error:', error);
      setSubmitState('error');
      setErrorMsg('Failed to publish. Please try again.');
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
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Content Writer</h1>
                <p className="text-gray-500 mt-1">Create articles and videos for your patients</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={isBusy}
                  className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isBusy}
                  className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
                >
                  {isBusy && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {isBusy ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </div>

            {/* Success banner */}
            {submitState === 'success' && (
              <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Content saved successfully! Redirecting…</span>
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
              {/* Main Editor */}
              <div className="lg:col-span-2 space-y-6">
                {/* Content Type Selector */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex gap-3 mb-6">
                    {CONTENT_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => setContentType(type as 'Article' | 'Video')}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          contentType === type
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Title */}
                  <div className="mb-6">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Article Title"
                      className="w-full text-4xl font-bold text-gray-900 placeholder-gray-300 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                    />
                  </div>

                  {/* Author & Date */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Dr. {doctor?.name || 'Doctor'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Video URL (if video type) */}
                  {contentType === 'Video' && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Video URL</label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
                      />
                    </div>
                  )}

                  {/* Content Editor */}
                  <div>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Start writing your health secrets here... Use Markdown syntax like bold, italics, and headings."
                      rows={16}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition resize-none font-mono text-sm leading-relaxed"
                    />
                  </div>

                  {/* Editor Toolbar */}
                  <div className="flex items-center gap-2 mt-4 p-3 bg-white border border-gray-200 rounded-xl">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Bold">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Italic">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Link">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Heading">
                      <span className="text-gray-600 font-bold text-sm">H1</span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="List">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Quote">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Image">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Thumbnail */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Thumbnail</h3>
                  <div className="relative">
                    {thumbnail ? (
                      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                        <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <label className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                        <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-500 font-medium">Upload Featured Image</span>
                        <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Category</h3>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition pr-10"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 text-pink-700 text-sm font-medium rounded-full">
                        #{tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-pink-900">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add tag..."
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Editor's Tip */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Editor's Tip</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Articles with at least 3 clinical references and a clear summary see 45% higher patient engagement. Try adding a "Key Takeaways" section at the end.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
