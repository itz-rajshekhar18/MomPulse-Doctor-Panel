export default function Logo() {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">M</span>
      </div>
      <span className="text-gray-700 font-medium">MomPulse</span>
    </div>
  );
}