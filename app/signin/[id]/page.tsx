import Logo from '@/components/icons/Logo';
import EmailSignIn from '@/components/ui/AuthForms/EmailSignIn';
import ForgotPassword from '@/components/ui/AuthForms/ForgotPassword';
import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn';
import PasswordSignIn from '@/components/ui/AuthForms/PasswordSignIn';
import Separator from '@/components/ui/AuthForms/Separator';
import SignUp from '@/components/ui/AuthForms/Signup';
import UpdatePassword from '@/components/ui/AuthForms/UpdatePassword';
import Card from '@/components/ui/Card2';
import {
  getAuthTypes,
  getDefaultSignInView,
  getRedirectMethod,
  getViewTypes
} from '@/utils/auth-helpers/settings';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SignIn(props: any) {
  const { params, searchParams } = await props;

  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();

  // Declare 'viewProp' and initialize with the default value
  let viewProp: string;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (typeof params.id === 'string' && viewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const cookieStore = await cookies();
    const preferredSignInView =
      cookieStore.get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}`);
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user && viewProp !== 'update_password') {
    return redirect('/');
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin');
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white">
      <div className="mx-auto flex flex-col md:flex-row min-h-screen w-full max-w-6xl items-stretch px-4">
        {/* left side */}
        <div className="flex w-full flex-col justify-center lg:w-1/2 mt-8 lg:mt-0">
          <div className="mb-8">
            <h1 className="mb-4 text-5xl font-bold tracking-tight">
              Quest Raven
            </h1>
            <p className="text-xl text-zinc-400">
              Your AI companion for epic gaming adventures
            </p>
          </div>
          <div className="relative aspect-square w-full max-w-md">
            <Logo width="400px" height="400px" />
          </div>
        </div>

        {/* right side */}
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 bg-foreground">
          <div className="w-full max-w-md space-y-8 rounded-xl bg-zinc-900 p-8">
            <Logo width="64px" height="64px" />
            <Card
              title={
                viewProp === 'forgot_password'
                  ? 'Reset Password'
                  : viewProp === 'update_password'
                    ? 'Update Password'
                    : viewProp === 'signup'
                      ? 'Sign Up'
                      : 'Sign In'
              }
            >
              {viewProp === 'password_signin' && (
                <PasswordSignIn
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                />
              )}
              {viewProp === 'email_signin' && (
                <EmailSignIn
                  allowPassword={allowPassword}
                  redirectMethod={redirectMethod}
                  disableButton={searchParams.disable_button}
                />
              )}
              {viewProp === 'forgot_password' && (
                <ForgotPassword
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                  disableButton={searchParams.disable_button}
                />
              )}
              {viewProp === 'update_password' && (
                <UpdatePassword redirectMethod={redirectMethod} />
              )}
              {viewProp === 'signup' && (
                <SignUp
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                />
              )}
              {viewProp !== 'update_password' &&
                viewProp !== 'signup' &&
                allowOauth && (
                  <>
                    <Separator text="Third-party sign-in" />
                    <OauthSignIn />
                  </>
                )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
