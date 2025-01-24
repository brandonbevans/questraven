import { Suspense } from 'react';

function NotFoundContent() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg text-zinc-500">Page not found</p>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense>
      <NotFoundContent />
    </Suspense>
  );
}
