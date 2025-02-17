import EmailSignIn from '@/components/ui/AuthForms/EmailSignIn';
import ForgotPassword from '@/components/ui/AuthForms/ForgotPassword';
import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn';
import PasswordSignIn from '@/components/ui/AuthForms/PasswordSignIn';
import Separator from '@/components/ui/AuthForms/Separator';
import SignUp from '@/components/ui/AuthForms/Signup';
import UpdatePassword from '@/components/ui/AuthForms/UpdatePassword';
import {
  getAuthTypes,
  getDefaultSignInView,
  getRedirectMethod,
  getViewTypes
} from '@/utils/auth-helpers/settings';
import { getUser } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SignIn(props: any) {
  let { params, searchParams } = await props;
  params = await params;

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

  const user = await getUser(supabase);

  if (user && !user.is_anonymous && viewProp !== 'update_password') {
    return redirect('/');
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin/signup');
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex-col items-center pt-8 sm:pt-16 md:pt-32">
      <div className="w-full max-w-sm px-4 sm:px-8">
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
          <SignUp allowEmail={allowEmail} redirectMethod={redirectMethod} />
        )}
        {viewProp !== 'update_password' &&
          viewProp !== 'signup' &&
          allowOauth && (
            <>
              <Separator text="Third-party sign-in" />
              <OauthSignIn />
            </>
          )}
      </div>
    </div>
  );
}
