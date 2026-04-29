import { env } from "@/lib/env";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const githubAuthUrl = `${env.NEXT_PUBLIC_API_BASE_URL}/auth/github?client_type=${env.CLIENT_TYPE}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-main">
      <div className="insighta-card max-w-sm w-full text-center space-y-6 border-t-4 border-primary p-12">
        {/* Logo Stack */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg
            width="20"
            height="20"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="6" fill="currentColor" />
            <path
              d="M12.5 10H8.5V22H12.5V19.5H10.5V12.5H12.5V10Z"
              fill="white"
            />
            <rect x="14" y="10" width="10" height="2" rx="1" fill="white" />
            <rect x="14" y="20" width="10" height="2" rx="1" fill="white" />
            <circle cx="21" cy="15" r="1.5" fill="#EE7D77" />
          </svg>
          <h2 className="text-title-lg">Insighta Labs+</h2>
        </div>

        {/* Main Headline */}
        <div>
          <h1 className="text-title-xl text-text-main">
            Sign in to
            <br />
            Mission Control
          </h1>
          <p className="text-body-md text-slate-500 mt-2">
            Access your operator dashboard with your GitHub account.
          </p>
        </div>

        {/* CTA Button */}
        <div className="py-4">
          <a href={githubAuthUrl}>
            <Button className="w-full bg-slate-800 hover:bg-slate-800/90">
              <div className="flex items-center justify-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.292 24 17.792 24 12.5 24 5.87 18.63.5 12 .5z" />
                </svg>
                Continue with GitHub
              </div>
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}
