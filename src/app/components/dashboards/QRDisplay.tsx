import React from "react";

// QRDisplay Component - Shows QR code for 2FA setup
function QRDisplay() {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Scan QR Code</h3>
        <p className="text-sm text-slate-400 mb-6">
          Scan this code with your authenticator app
        </p>

        {/* QR Code Placeholder */}
        <div className="bg-white p-4 rounded-lg inline-block mb-4">
          <div className="w-48 h-48 bg-slate-200 rounded flex items-center justify-center">
            <svg
              className="w-32 h-32 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
          </div>
        </div>

        {/* Secret Key */}
        <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-4">
          <p className="text-xs text-slate-400 mb-2">Manual Entry Key</p>
          <code className="text-sm text-blue-400 font-mono break-all">
            JBSWY3DPEHPK3PXP
          </code>
        </div>

        {/* Copy Button */}
        <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copy Secret Key
        </button>
      </div>
    </div>
  );
}

export default QRDisplay;
