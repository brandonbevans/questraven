import { Suspense } from 'react';
import RavenContent from './RavenContent';

export default function Raven({
  searchParams
}: {
  searchParams?: { game?: string };
}) {
  return (
    <Suspense>
      <RavenContent initialGameNamespace={searchParams?.game} />
    </Suspense>
  );
}
