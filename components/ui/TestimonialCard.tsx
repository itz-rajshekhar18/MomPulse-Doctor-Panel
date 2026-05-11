export default function TestimonialCard() {
  return (
    <div className="hidden lg:block w-full max-w-sm">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="mb-4">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            PRACTITIONER PULSE
          </span>
        </div>
        <blockquote className="text-gray-700 mb-6 leading-relaxed">
          "Empowering healthcare professionals with real-time maternal wellness data to ensure a safer, more connected journey for every mother."
        </blockquote>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 via-purple-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">ET</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Dr. Elena Thorne</div>
            <div className="text-sm text-gray-500">Chief of Obstetrics, Sanctuary Health</div>
          </div>
        </div>
      </div>
    </div>
  );
}