import React from "react";

// AccountCard Component - Individual account management
function AccountCard() {
  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6 max-w-md">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">G</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">GitHub</h3>
            <p className="text-sm text-slate-400">user@email.com</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Current Code */}
      <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-6 mb-6 text-center">
        <p className="text-sm text-slate-400 mb-2">Current Code</p>
        <div className="text-4xl font-mono font-bold text-white tracking-widest mb-3">
          123 456
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
              style={{ width: "45%" }}
            ></div>
          </div>
          <span className="text-sm text-slate-400 font-medium">14s</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
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
          Copy Code
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2">
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-slate-700 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Added</span>
          <span className="text-white">2 days ago</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Last used</span>
          <span className="text-white">5 minutes ago</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Type</span>
          <span className="text-white">TOTP (30s)</span>
        </div>
      </div>
    </div>
  );
}

export { AccountCard };
