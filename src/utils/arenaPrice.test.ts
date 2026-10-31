import { getArenaPriceTiers } from './arenaPrice';

import { LMArenaRankDataItem } from '@/types/rank';

const priced = (
  price: number | null,
  unit: LMArenaRankDataItem['ofox_price_unit'] = 'usd_per_million_tokens'
): LMArenaRankDataItem => ({
  name: 'Example',
  model_id: `example/${price}`,
  organization: 'Example',
  position: 1,
  rating: 1500,
  change: 0,
  ofox_output_price: price,
  ofox_price_unit: unit,
});

it('ranks distinct prices from most expensive to cheapest and keeps ties together', () => {
  const models = [30, 50, 0, 40, 10, 30].map((price) => priced(price));
  const tiers = getArenaPriceTiers(models);
  expect(models.map((model) => tiers.get(model))).toEqual([
    'medium',
    'high',
    'low',
    'high',
    'low',
    'medium',
  ]);
});

it('compares billing units separately and ignores missing, invalid and unmatched quotes', () => {
  const tokens = [priced(10), priced(20)];
  const images = [priced(0.1, 'usd_per_image'), priced(0.2, 'usd_per_image')];
  const excluded = [
    priced(null),
    priced(-1),
    priced(NaN),
    priced(Infinity),
    priced(10, null),
    { ...priced(100), model_id: null },
    { ...priced(null), ofox_input_price: 10, output_price: 999 },
    priced(5, 'usd_per_second'),
  ];
  const tiers = getArenaPriceTiers([...tokens, ...images, ...excluded]);
  expect(tokens.map((model) => tiers.get(model))).toEqual(['low', 'high']);
  expect(images.map((model) => tiers.get(model))).toEqual(['low', 'high']);
  excluded.forEach((model) => expect(tiers.has(model)).toBe(false));
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
