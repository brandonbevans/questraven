import Link from 'next/link';

export default function ThankYou() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Welcome to QuestRaven!
        </h1>
        <p className="mb-6 text-lg text-gray-600">
          Thank you for signing up! The Raven is waiting for you.
        </p>
        <Link
          href="/raven"
          className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          Continue to App
        </Link>
      </div>
    </div>
  );
}
