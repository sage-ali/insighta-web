import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="insighta-card max-w-md w-full text-center">
        <h1 className="text-title-xl mb-4">Insighta Labs+</h1>
        <p className="text-body-md mb-8">
          Secure, functional dashboard for the Profile Intelligence System.
        </p>
        <Link
          href="/login"
          className="inline-block bg-primary text-white px-6 py-2 rounded-button font-medium hover:opacity-90 transition-opacity"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
