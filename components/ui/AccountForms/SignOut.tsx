'use client';

import Card from '@/components/ui/Card2';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

export default function SignOut() {
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/signin'; // or use a router method if you prefer
  }

  return (
    <Card
      title="Sign Out"
      description="End your current session and sign out of your account."
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">We'll see you soon!</p>
          <Button variant="default" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        You can always sign back in when you're ready.
      </div>
    </Card>
  );
}
