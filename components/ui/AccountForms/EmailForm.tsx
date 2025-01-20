'use client';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/Card2';
import { handleRequest } from '@/utils/auth-helpers/client';
import { updateEmail } from '@/utils/auth-helpers/server';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmailForm({
  userEmail
}: {
  userEmail: string | undefined;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateEmail, router);
    setIsSubmitting(false);
  };

  return (
    <Card
      title="Your Email"
      description="Please enter the email address you want to use to login."
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">
            We will email you to verify the change.
          </p>
          <Button
            variant="default"
            type="submit"
            form="emailForm"
            disabled={isSubmitting}
          >
            Update Email
          </Button>
        </div>
      }
    >
      <div className="mt-6 mb-4">
        <form id="emailForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="email"
            name="newEmail"
            className="w-full p-3 text-base bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-zinc-400"
            defaultValue={userEmail ?? ''}
            placeholder="Your email"
            maxLength={64}
          />
        </form>
      </div>
    </Card>
  );
}
