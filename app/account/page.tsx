import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import SignOut from '@/components/ui/AccountForms/SignOut';
import {
  getSubscription,
  getUser,
  getUserDetails
} from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Account() {
  const supabase = await createClient();
  const [user, userDetails, subscription] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Account Settings
            </h1>
            <p className="text-zinc-400">
              Manage your account settings and subscription preferences.
            </p>
          </div>

          {/* Forms */}
          <div className="grid gap-6">
            <CustomerPortalForm subscription={subscription} />
            <NameForm userName={userDetails?.full_name ?? ''} />
            <EmailForm userEmail={user.email} />
            <SignOut />
          </div>
        </div>
      </div>
    </div>
  );
}
