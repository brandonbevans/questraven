'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { Tables } from '@/types_db';
import { getErrorRedirect } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { Check } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;

interface ProductMetadata {
  features: string[];
}

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PriceWithProduct extends Price {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

export default function Pricing({ user, products, subscription }: Props) {
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }
    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );
    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }
    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }
    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });
    setPriceIdLoading(undefined);
  };

  const formatPrice = (price: Price | undefined) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency!,
      minimumFractionDigits: 0
    }).format((price?.unit_amount || 0) / 100);
  };

  if (!products.length) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-zinc-950 px-4">
        <Card className="w-full max-w-lg border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl text-center text-white">
              No subscription plans available
            </CardTitle>
            <CardDescription className="text-center">
              Please check back later or contact support.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Pricing Plans
          </h1>
          <p className="max-w-xl mx-auto text-zinc-400 text-lg">
            Get unlimited access to Quest Raven for a low monthly or yearly
            subscription.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl">
          {products.map((product) => {
            const monthlyPrice = product?.prices?.findLast(
              (price) => price.interval === 'month'
            );
            const yearlyPrice = product?.prices?.findLast(
              (price) => price.interval === 'year'
            );

            return (
              <>
                {/* Monthly Plan Card */}
                {monthlyPrice && (
                  <Card
                    key={`${product.id}-monthly`}
                    className={cn(
                      'flex flex-col border-zinc-800 bg-zinc-900/50',
                      {
                        'border-2 border-blue-500': subscription
                          ? product.name ===
                              subscription?.prices?.products?.name &&
                            subscription?.prices?.interval === 'month'
                          : product.name === 'Freelancer'
                      }
                    )}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-xl text-white">
                        {product.name}
                        <span className="ml-2 text-sm text-zinc-400">
                          Monthly
                        </span>
                      </CardTitle>
                      <CardDescription className="mt-1.5">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                      <div className="relative mb-8">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-white">
                            {formatPrice(monthlyPrice)}
                          </span>
                          <span className="text-sm text-zinc-400 ml-1">
                            /month
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Button
                          className="w-full"
                          variant={subscription ? 'secondary' : 'default'}
                          disabled={priceIdLoading === monthlyPrice.id}
                          onClick={() => handleStripeCheckout(monthlyPrice)}
                        >
                          {subscription ? 'Manage' : 'Subscribe Monthly'}
                        </Button>

                        {/* Features */}
                        <ul className="space-y-2.5 text-sm mt-6">
                          {(
                            (product.metadata as { features: string[] })
                              ?.features || []
                          ).map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center text-zinc-400"
                            >
                              <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Yearly Plan Card */}
                {yearlyPrice && (
                  <Card
                    key={`${product.id}-yearly`}
                    className={cn(
                      'flex flex-col border-zinc-800 bg-zinc-900/50 relative',
                      {
                        'border-2 border-blue-500': subscription
                          ? product.name ===
                              subscription?.prices?.products?.name &&
                            subscription?.prices?.interval === 'year'
                          : false
                      }
                    )}
                  >
                    {monthlyPrice &&
                      (monthlyPrice.unit_amount || 0) * 12 >
                        (yearlyPrice.unit_amount || 0) && (
                        <div className="absolute -top-[1px] -right-[1px] w-[200px] h-[200px] overflow-hidden pointer-events-none">
                          <div className="absolute top-[40px] right-[-90px] w-[280px] transform rotate-45 bg-gradient-to-r from-blue-600 to-blue-500 text-center text-xs text-white py-1.5 shadow-md">
                            {Math.round(
                              (((monthlyPrice.unit_amount || 0) * 12 -
                                (yearlyPrice.unit_amount || 0)) /
                                ((monthlyPrice.unit_amount || 0) * 12)) *
                                100
                            )}
                            % off
                          </div>
                        </div>
                      )}
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-xl text-white">
                        {product.name}
                        <span className="ml-2 text-sm text-zinc-400">
                          Yearly
                        </span>
                      </CardTitle>
                      <CardDescription className="mt-1.5">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                      <div className="relative mb-8">
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-white">
                            {formatPrice(yearlyPrice)}
                          </span>
                          <span className="text-sm text-zinc-400 ml-1">
                            /year
                          </span>
                        </div>
                        {monthlyPrice &&
                          (monthlyPrice.unit_amount || 0) * 12 >
                            (yearlyPrice.unit_amount || 0) && (
                            <div className="flex items-center mt-2">
                              <span className="text-gray-400 line-through text-sm">
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: yearlyPrice.currency!,
                                  minimumFractionDigits: 0
                                }).format(
                                  ((monthlyPrice.unit_amount || 0) * 12) / 100
                                )}
                                /year
                              </span>
                            </div>
                          )}
                      </div>

                      <div className="mt-auto">
                        <Button
                          className="w-full"
                          variant={subscription ? 'secondary' : 'default'}
                          disabled={priceIdLoading === yearlyPrice.id}
                          onClick={() => handleStripeCheckout(yearlyPrice)}
                        >
                          {subscription ? 'Manage' : 'Subscribe Yearly'}
                        </Button>

                        {/* Features */}
                        <ul className="space-y-2.5 text-sm mt-6">
                          {(
                            (product.metadata as { features: string[] })
                              ?.features || []
                          ).map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center text-zinc-400"
                            >
                              <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
}
