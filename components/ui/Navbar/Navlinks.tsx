'use client';

import Logo2 from '@/components/icons/Logo2';
import { Button } from '@/components/ui/button';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { createClient } from '@/utils/supabase/client';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const supabase = createClient();
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      try {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user?.id)
          .single();
        setHasSubscription(!!subscription);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasSubscription(false);
      }
    }

    if (user) {
      checkSubscription();
    }
  }, [user, supabase]);

  // Get display name (use email if no full_name)
  const displayName =
    user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/signin'; // Force a full page refresh
  };

  return (
    <div className="relative flex flex-row items-center py-4 md:py-6">
      <div className="flex items-center gap-4">
        <Link href="/bot" className={s.logo} aria-label="Logo">
          <Logo2 width={128} height={128} />
        </Link>
        {user && !hasSubscription && (
          <Button
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => router?.push('/subscribe')}
          >
            Subscribe Now
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {user ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-400"
              asChild
            >
              <Link href="/account">
                <User className="w-4 h-4" />
                {displayName}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-zinc-500 hover:text-zinc-400 inline-flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
