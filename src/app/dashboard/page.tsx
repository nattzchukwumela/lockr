"use client";
import { useState } from "react";
import QRDisplay from "../components/dashboards/QRDisplay";
import CodeDisplay from "../components/dashboards/CodeDisplay";
import { AccountCard } from "../components/dashboards/ AccountCard";

// Demo Component with Tabs
export default function LockrComponents() {
  const [activeTab, setActiveTab] = useState("codes");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            <span className="text-2xl font-bold text-white">Lockr</span>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-slate-800/50 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setActiveTab("codes")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "codes"
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Code Display
          </button>
          <button
            onClick={() => setActiveTab("qr")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "qr"
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            QR Display
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "account"
                ? "bg-blue-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Account Card
          </button>
        </div>

        {/* Component Display */}
        <div>
          {activeTab === "codes" && <CodeDisplay />}
          {activeTab === "qr" && (
            <div className="max-w-md mx-auto">
              <QRDisplay />
            </div>
          )}
          {activeTab === "account" && (
            <div className="flex justify-center">
              <AccountCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
