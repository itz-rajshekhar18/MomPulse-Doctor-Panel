export default function LoginFooter() {
  return (
    <>
      {/* Support Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Institutional access issue?{' '}
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            Contact Admin Support
          </button>
        </p>
      </div>

      {/* Footer */}
      <div className="mt-12 text-xs text-gray-400">
        © 2024 MomPulse Sanctuary. Secure Healthcare Portal v4.2.0
      </div>
    </>
  );
}