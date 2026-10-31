import { LMArenaRankDataItem } from '@/types/rank';

export type ArenaPriceTier = 'high' | 'medium' | 'low';

export const getArenaPriceTiers = (models: LMArenaRankDataItem[]) => {
  const groups = new Map<string, LMArenaRankDataItem[]>();
  const tiers = new Map<LMArenaRankDataItem, ArenaPriceTier>();

  models.forEach((model) => {
    const { model_id, ofox_price_unit: unit, ofox_output_price: price } = model;
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
    const group = groups.get(unit) || [];
    group.push(model);
    groups.set(unit, group);
  });

  groups.forEach((group) => {
    if (group.length < 2) return;
    // Equal prices share a tier, regardless of how many models use that price.
    const prices = Array.from(
      new Set(group.map((model) => model.ofox_output_price!))
    ).sort((a, b) => b - a);
    group.forEach((model) => {
      const index = prices.indexOf(model.ofox_output_price!);
      const levels: ArenaPriceTier[] = ['high', 'medium', 'low'];
      const tier =
        prices.length === 1
          ? 'medium'
          : levels[Math.min(2, Math.floor((index * 3) / (prices.length - 1)))];
      tiers.set(model, tier);
    });
  });

  return tiers;
};
