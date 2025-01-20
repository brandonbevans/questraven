import { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-lg border-zinc-800 bg-zinc-900/50">
      <div className="px-6 py-5">
        <h3 className="mb-2 text-2xl font-semibold text-white">{title}</h3>
        <p className="text-zinc-400">{description}</p>
        {children}
      </div>
      {footer && (
        <div className="p-5 border-t rounded-b-lg border-zinc-800 bg-zinc-900 text-zinc-400">
          {footer}
        </div>
      )}
    </div>
  );
}
