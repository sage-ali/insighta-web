import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="insighta-card max-w-md w-full text-center">
        <h1 className="text-title-xl mb-4">Insighta Labs+</h1>
        <p className="text-body-md mb-8">
          Secure, functional dashboard for the Profile Intelligence System.
        </p>
        <Link href="/login">
          <Button variant="primary" className="px-6 py-2">
            Get Started
          </Button>
        </Link>
      </div>
    </main>
  );
}
