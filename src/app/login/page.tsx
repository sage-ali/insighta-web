"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { env } from "@/lib/env";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "";
  if (error === "inactive") {
    errorMessage =
      "Your account is inactive. Please contact an administrator for assistance.";
  } else if (error === "unauthorized") {
    errorMessage = "Please log in to access this page.";
  } else if (error === "auth_failed") {
    errorMessage = "Authentication failed. Please try again.";
  }

  const handleGitHubLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${env.NEXT_PUBLIC_API_BASE_URL}/auth/github?client_type=web`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 font-medium">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="32"
                height="32"
                rx="6"
                fill="currentColor"
                className="text-primary"
              />
              <path
                d="M12.5 10H8.5V22H12.5V19.5H10.5V12.5H12.5V10Z"
                fill="white"
              />
              <rect x="14" y="10" width="10" height="2" rx="1" fill="white" />
              <rect x="14" y="20" width="10" height="2" rx="1" fill="white" />
              <circle cx="21" cy="15" r="1.5" fill="#EE7D77" />
            </svg>
            <h1 className="text-2xl font-bold text-slate-900">
              Insighta Labs+
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Sign in to Mission Control
          </h2>
          <p className="text-slate-600">
            Access your operator dashboard with your GitHub account.
          </p>
        </div>

        {/* GitHub Login Button */}
        <button
          onClick={handleGitHubLogin}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continue with GitHub
        </button>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-sm text-slate-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
