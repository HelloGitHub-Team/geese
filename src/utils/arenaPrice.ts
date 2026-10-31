import { ArenaProviderOffer } from '@/types/rank';

export type ArenaPriceTier = 'high' | 'medium' | 'low';

export const getArenaPriceTiers = (offers: ArenaProviderOffer[]) => {
  const groups = new Map<string, ArenaProviderOffer[]>();
  const tiers = new Map<ArenaProviderOffer, ArenaPriceTier>();

  offers.forEach((offer) => {
    const { model_id, price_unit: unit, output_price: price } = offer;
    if (
      !model_id ||
      !unit ||
      !['usd_per_million_tokens', 'usd_per_image', 'usd_per_second'].includes(
        unit
      ) ||
      typeof price !== 'number' ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return;
    }
    const key = `${offer.provider_id}:${unit}`;
    const group = groups.get(key) || [];
    group.push(offer);
    groups.set(key, group);
  });

  groups.forEach((group) => {
    if (group.length < 2) return;
    // Equal prices share a tier, regardless of how many models use that price.
    const prices = Array.from(
      new Set(group.map((offer) => offer.output_price!))
    ).sort((a, b) => b - a);
    group.forEach((offer) => {
      const index = prices.indexOf(offer.output_price!);
      const levels: ArenaPriceTier[] = ['high', 'medium', 'low'];
      const tier =
        prices.length === 1
          ? 'medium'
          : levels[Math.min(2, Math.floor((index * 3) / (prices.length - 1)))];
      tiers.set(offer, tier);
    });
  });

  return tiers;
};
