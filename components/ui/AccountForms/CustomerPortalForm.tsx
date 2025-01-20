'use client';

import { Button } from '@/components/ui/button';
import Card from '@/components/ui/Card2';
import { Tables } from '@/types_db';
import { createStripePortal } from '@/utils/stripe/server';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    return router.push(redirectUrl);
  };

  return (
    <Card
      title="Your Plan"
      description={
        subscription
          ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
          : 'You are not currently subscribed to any plan.'
      }
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">Manage your subscription on Stripe.</p>
          <Button
            variant="default"
            onClick={handleStripePortalRequest}
            disabled={isSubmitting}
          >
            Open customer portal
          </Button>
        </div>
      }
    >
      <div className="mt-6 mb-4">
        {subscription ? (
          <p className="text-2xl font-semibold text-white">
            {subscriptionPrice}
            <span className="text-zinc-400 text-lg ml-1">
              /{subscription?.prices?.interval}
            </span>
          </p>
        ) : (
          <Link
            href="/subscribe"
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Choose your plan
          </Link>
        )}
      </div>
    </Card>
  );
}
