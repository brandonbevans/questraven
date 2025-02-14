import { Suspense } from 'react';
import RavenContent from './RavenContent';

export default async function Raven(
  props: {
    searchParams?: Promise<{ game?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <Suspense>
      <RavenContent initialGameNamespace={searchParams?.game} />
    </Suspense>
  );
}
