"use client";
import React, { useState } from "react";
import { SECRETKEY } from "@/app/lib/types";
import { addKeys } from "@/app/lib/indexDB";

interface AddAccountProps {
  onClose: () => void;
  onAdd: () => Promise<void>;
}

// AddAccount Modal Component
function AddAccount({ onClose, onAdd }: AddAccountProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState<{
    secret: string;
    qr: string;
    otpauth: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    secretKey: "",
    type: "TOTP",
    interval: "30",
  });
  const genId = Date.now().toString();
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null); // Clear error on input change
  };

  const handleNext = async () => {
    if (step === 1 && formData.accountName && formData.email) {
      setLoading(true);
      setError(null);

      try {
        // Call the API to get QR code and secret
        const response = await fetch("/api/2fa/setup", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success && data.data) {
          setQrData({
            secret: data.data.secret,
            qr: data.data.qr,
            otpauth: data.data.otpauth,
          });

          // Auto-fill the secret key
          setFormData((prev) => ({
            ...prev,
            secretKey: data.data.secret,
          }));

          setStep(2);
        } else {
          setError(data.message || "Failed to generate QR code");
        }
      } catch (error) {
        console.error("Error fetching QR code:", error);
        setError("Failed to generate QR code. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Save to backend first
      const res = await fetch("/api/2fa/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: genId,
          email: formData.email,
          secret: formData.secretKey,
          accountName: formData.accountName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.err || "Failed to save account");
        setLoading(false);
        return;
      }

      // Create account object
      const initial = formData.accountName.charAt(0).toUpperCase();
      const newAccount: SECRETKEY = {
        name: formData.accountName,
        email: formData.email,
        icon: initial,
        secret: formData.secretKey,
        type: formData.type,
        code: "000 000",
        interval: formData.interval,
        id: genId,
        addedAt: new Date().toISOString(),
      };

      // Save to IndexedDB
      await addKeys(newAccount);

      // Call parent's onAdd to refresh the list
      await onAdd();

      // Success - modal will be closed by parent
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleManualEntry = () => {
    setFormData((prev) => ({
      ...prev,
      secretKey: "",
    }));
    setQrData(null);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(formData.secretKey);
    // You could add a toast notification here
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50"
            disabled={loading}
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
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
          <h2 className="text-xl font-bold text-white">Add New Account</h2>
          <p className="text-blue-100 mt-0.5 text-sm">Step {step} of 2</p>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-700">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-3 p-2.5 bg-red-500/20 border border-red-500 rounded-lg flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-medium">
                {step === 1 ? "Generating QR Code..." : "Saving Account..."}
              </p>
              <p className="text-slate-400 text-sm mt-1">Please wait</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {step === 1 ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Account Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="e.g., GitHub, Google, AWS"
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email/Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={loading}
                >
                  <option value="TOTP">TOTP (Time-based)</option>
                  <option value="HOTP">HOTP (Counter-based)</option>
                </select>
              </div>

              {formData.type === "TOTP" && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Interval (seconds)
                  </label>
                  <select
                    name="interval"
                    value={formData.interval}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={loading}
                  >
                    <option value="30">30 seconds</option>
                    <option value="60">60 seconds</option>
                  </select>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center py-3">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-full mb-3">
                  <svg
                    className="w-7 h-7 text-blue-400"
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
                <h3 className="text-base font-semibold text-white mb-1.5">
                  Scan QR Code
                </h3>
                <p className="text-slate-400 text-xs">
                  Scan this code with your authenticator app
                </p>
              </div>

              {/* QR Code Display */}
              {qrData && (
                <div className="bg-white p-3 rounded-xl mx-auto w-fit shadow-lg">
                  <img src={qrData.qr} alt="QR Code" className="w-40 h-40" />
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-600"></div>
                <span className="text-slate-500 text-xs">OR</span>
                <div className="flex-1 h-px bg-slate-600"></div>
              </div>

              {/* Manual Entry Key Display */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Manual Entry Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="secretKey"
                    value={formData.secretKey}
                    onChange={handleInputChange}
                    placeholder="Enter your secret key"
                    className="w-full px-3 py-2.5 pr-12 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs transition-all"
                    readOnly={!!qrData}
                  />
                  {qrData && (
                    <button
                      onClick={handleCopySecret}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-600 rounded-lg transition-colors"
                      title="Copy to clipboard"
                      type="button"
                    >
                      <svg
                        className="w-4 h-4 text-slate-400"
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
                    </button>
                  )}
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  {qrData
                    ? "Use this key if you can't scan the QR code"
                    : "The secret key is provided by the service you're adding"}
                </p>
              </div>

              {qrData && (
                <button
                  onClick={handleManualEntry}
                  className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  type="button"
                >
                  Enter a different secret key manually
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex gap-2 flex-shrink-0">
          {step === 2 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              type="button"
            >
              Back
            </button>
          )}
          {step === 1 ? (
            <button
              onClick={handleNext}
              disabled={!formData.accountName || !formData.email || loading}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl"
              type="button"
            >
              {loading ? "Loading..." : "Next"}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.secretKey || loading}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl"
              type="button"
            >
              {loading ? "Saving..." : "Add Account"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddAccount;
