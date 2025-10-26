import React, { useEffect, useState } from "react";
import AddAccount from "./AddAccount";
import { SECRETKEY } from "@/app/lib/types";
import { getAllKeys, deleteKey } from "@/app/lib/indexDB";
import { authenticator } from "otplib";
import { NextResponse } from "next/server";

// Main CodeDisplay Component
function CodeDisplay() {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [accounts, setAccounts] = useState<SECRETKEY[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [copied, setCopied] = useState<string | null>(null);

  // Calculate time remaining in current 30-second window
  const calculateTimeRemaining = (): number => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = 30 - (now % 30);
    return remaining;
  };

  // Format code with space in middle (e.g., "123 456")
  const formatCode = (code: string): string => {
    return code.slice(0, 3) + " " + code.slice(3);
  };

  // Load all accounts and refresh codes
  const refreshCodes = async () => {
    try {
      const allKeys = await getAllKeys();
      const updated = allKeys.map((acc) => ({
        ...acc,
        code: formatCode(authenticator.generate(acc.secret)),
      }));
      setAccounts(updated);
    } catch (error) {
      console.error("Error loading accounts:", error);
    }
  };

  // Handle adding new account
  const handleAddAccount = async () => {
    // Refresh all accounts after adding
    await refreshCodes();
    setShowAddAccount(false);
  };

  // Initial load
  useEffect(() => {
    refreshCodes();
  }, []);

  // Timer effect - updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      // Refresh codes when timer resets (at 30 seconds)
      if (remaining === 30) {
        refreshCodes();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code.replace(/\s/g, ""));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000); // Reset after 2 seconds
  };

  const handleDeleteAccount = async (id: string, secret: string) => {
    try {
      const res = await fetch("/api/2fa/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(
          data.message ||
            data.error ||
            "Failed to delete account. Please try again.",
        );
      } else {
        await deleteKey(Number(id));
        setAccounts((prev) => prev.filter((account) => account.id !== id));
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  // Calculate progress percentage (0-100)
  const progressPercentage = (timeRemaining / 30) * 100;

  // Determine color based on time remaining
  const getProgressColor = (): string => {
    if (timeRemaining > 20) return "bg-blue-500";
    if (timeRemaining > 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Codes</h2>
          {accounts.length > 0 && (
            <p className="text-sm text-slate-400 mt-1">
              {accounts.length} account{accounts.length !== 1 ? "s" : ""} •
              Refreshes in {timeRemaining}s
            </p>
          )}
        </div>
        <button
          onClick={() => setShowAddAccount(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
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
            className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-5 hover:border-blue-500/50 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center justify-between">
              {/* Account Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold text-white">
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
                <div className="text-3xl font-mono font-bold text-white tracking-wider mb-2">
                  {account.code}
                </div>
                {/* Timer Progress */}
                <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor()} transition-all duration-1000 ease-linear`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  {timeRemaining}s remaining
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700">
              <button
                onClick={() => handleCopyCode(account.code, account.id)}
                className={`flex-1 px-3 py-2 ${
                  copied === account.id
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-slate-700 hover:bg-slate-600"
                } text-white text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2`}
              >
                {copied === account.id ? (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </button>
              <button
                onClick={() =>
                  handleDeleteAccount(String(account.id), account.secret)
                }
                className="px-3 py-2 bg-slate-700 hover:bg-red-600 text-white text-sm rounded-lg transition-all duration-200 group"
                title="Delete account"
              >
                <svg
                  className="w-4 h-4 group-hover:scale-110 transition-transform"
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
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
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
