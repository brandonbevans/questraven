import { getUser } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import s from './Navbar.module.css';
import Navlinks from './Navlinks';

export default async function Navbar() {
  const supabase = await createClient();

  const user = await getUser(supabase);

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Navlinks user={user} />
      </div>
    </nav>
  );
}
