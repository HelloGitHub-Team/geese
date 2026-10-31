import { getArenaPriceTiers } from './arenaPrice';

import { ArenaProviderOffer } from '@/types/rank';

const priced = (
  price: number | null,
  unit: ArenaProviderOffer['price_unit'] = 'usd_per_million_tokens',
  provider_id = 1
): ArenaProviderOffer => ({
  provider_id,
  model_id: `example/${price}`,
  output_price: price,
  price_unit: unit,
});

it('ranks distinct prices from most expensive to cheapest and keeps ties together', () => {
  const offers = [30, 50, 0, 40, 10, 30].map((price) => priced(price));
  const tiers = getArenaPriceTiers(offers);
  expect(offers.map((offer) => tiers.get(offer))).toEqual([
    'medium',
    'high',
    'low',
    'high',
    'low',
    'medium',
  ]);
});

it('compares billing units and providers separately and ignores invalid quotes', () => {
  const tokens = [priced(10), priced(20)];
  const images = [priced(0.1, 'usd_per_image'), priced(0.2, 'usd_per_image')];
  const otherProvider = [
    priced(1000, 'usd_per_million_tokens', 2),
    priced(2000, 'usd_per_million_tokens', 2),
  ];
  const excluded = [
    priced(null),
    priced(-1),
    priced(NaN),
    priced(Infinity),
    priced(10, null),
    priced(10, 'unknown'),
    { ...priced(100), model_id: null },
    { ...priced(null), input_price: 10 },
    priced(5, 'usd_per_second'),
  ];
  const tiers = getArenaPriceTiers([
    ...tokens,
    ...images,
    ...otherProvider,
    ...excluded,
  ]);
  expect(tokens.map((offer) => tiers.get(offer))).toEqual(['low', 'high']);
  expect(images.map((offer) => tiers.get(offer))).toEqual(['low', 'high']);
  expect(otherProvider.map((offer) => tiers.get(offer))).toEqual([
    'low',
    'high',
  ]);
  excluded.forEach((offer) => expect(tiers.has(offer)).toBe(false));
});

it('handles equal prices, zero prices and lists too small for three tiers', () => {
  const equal = [priced(0), priced(0)];
  expect(Array.from(getArenaPriceTiers(equal).values())).toEqual([
    'medium',
    'medium',
  ]);
  expect(getArenaPriceTiers([priced(0)]).size).toBe(0);
  expect(getArenaPriceTiers([]).size).toBe(0);
  expect(
    Array.from(getArenaPriceTiers([priced(3), priced(2), priced(1)]).values())
  ).toEqual(['high', 'medium', 'low']);
});
