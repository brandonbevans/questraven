import Link from 'next/link';

export default function ThankYou() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg dark:shadow-gray-800/30">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to QuestRaven
        </h1>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
          Thanks for signing up! The Raven is waiting for you.
        </p>
        <Link
          href="/raven"
          className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Start Now For Free
        </Link>
      </div>
    </div>
  );
}
