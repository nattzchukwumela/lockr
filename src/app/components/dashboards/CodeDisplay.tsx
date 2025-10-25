import React, { useState } from "react";
import AddAccount from "./AddAccount";
import { SECRETKEY } from "@/app/lib/types";
import { getAllKeys } from "@/app/lib/indexDB";

interface Account {
  name: string;
  code: string;
  icon: string;
  secretKey: string;
  type: string;
  interval: string;
  id: string;
  addedDate: string;
}

// Main CodeDisplay Component
function CodeDisplay() {
  const details = [
    {
      name: "GitHub",
      username: "user@email.com",
      code: "123 456",
      icon: "G",
      id: "1",
    },
    {
      name: "Google",
      username: "user@gmail.com",
      code: "789 012",
      icon: "G",
      id: "2",
    },
    { name: "AWS", username: "admin", code: "345 678", icon: "A", id: "3" },
  ];

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accounts, setAccounts] = useState<SECRETKEY[]>([]);

  const handleAddAccount = async (newAccount: SECRETKEY) => {
    const keys = await getAllKeys();
    setAccounts(keys);
    // setAccounts((prev) => [...prev, newAccount]);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code.replace(/\s/g, ""));
    // You could add a toast notification here
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Codes</h2>
        <button
          onClick={() => setShowAddAccount(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Account
        </button>
      </div>

      {/* Code Cards */}
      {accounts.length > 0 &&
        accounts.map((account) => (
          <div
            key={account.id}
            className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-5 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              {/* Account Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-400">
                    {account.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {account.name}
                  </h3>
                  <p className="text-sm text-slate-400">{account.email}</p>
                </div>
              </div>

              {/* Code Display */}
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-white tracking-wider mb-1">
                  {/*{account.code}*/} "remember to add code logic"
                </div>
                {/* Timer Progress */}
                <div className="w-32 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-1000"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1">18s remaining</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
              <button
                // onClick={() => handleCopyCode(account.code)}
                className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
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
                Copy
              </button>
              <button
                onClick={() => handleDeleteAccount(String(account.id))}
                className="px-3 py-2 bg-slate-700 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
              >
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
              </button>
            </div>
          </div>
        ))}

      {/* Empty State */}
      {accounts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No accounts yet
          </h3>
          <p className="text-slate-400 mb-6">
            Add your first 2FA account to get started
          </p>
          <button
            onClick={() => setShowAddAccount(true)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            Add Your First Account
          </button>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <AddAccount
          onClose={() => setShowAddAccount(false)}
          onAdd={handleAddAccount}
        />
      )}
    </div>
  );
}

export default CodeDisplay;
