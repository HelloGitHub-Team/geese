import { useTranslation } from 'next-i18next/pages';
import { useId, useState } from 'react';
import { MdInfoOutline, MdNorthEast } from 'react-icons/md';

import { ArenaPriceTier } from '@/utils/arenaPrice';

import {
  ArenaProvider,
  ArenaProviderOffer,
  LMArenaRankDataItem,
} from '@/types/rank';

import providerLogos from '~/images/arena/providers.json';

const logos: Record<string, string> = providerLogos;

// Fixed display estimate, not a live exchange rate.
const USD_TO_CNY = 7;

export const ArenaModel = ({
  model,
  provider,
  offer,
}: {
  model: LMArenaRankDataItem;
  provider?: ArenaProvider;
  offer?: ArenaProviderOffer;
}) => {
  const { t, i18n } = useTranslation('rank');
  const modelURL = i18n.language.startsWith('zh')
    ? offer?.model_url_zh
    : offer?.model_url_en;
  const [failedLogo, setFailedLogo] = useState<string>();
  const logo = logos[model.organization];
  const license = model.license?.trim();
  const showLicense =
    !!license && !['proprietary', 'unknown'].includes(license.toLowerCase());
  const monochromeLogo = [
    'Anthropic',
    'OpenAI',
    'Moonshot',
    'SpaceXAI',
    'Mistral',
  ].includes(model.organization);

  return (
    <div className='flex w-full min-w-0 items-center gap-3 text-left'>
      <span
        aria-hidden='true'
        className='flex h-8 w-7 shrink-0 items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-300'
      >
        {logo && failedLogo !== logo ? (
          <img
            src={logo}
            alt=''
            width={24}
            height={24}
            className={`h-6 w-6 object-contain ${monochromeLogo ? 'dark:invert' : ''}`}
            onError={() => setFailedLogo(logo)}
          />
        ) : (
          <span>
            {(model.organization || model.name).slice(0, 1).toUpperCase()}
          </span>
        )}
      </span>
      <div className='min-w-0 flex-1'>
        {provider && offer?.model_id && modelURL ? (
          <a
            href={modelURL}
            target='_blank'
            rel='noopener noreferrer'
            title={t('lmrank.view_on_provider', { provider: provider.name })}
            aria-label={model.name}
            className='block whitespace-normal break-words rounded-sm font-mono text-[13px] font-medium leading-5 tracking-[-0.025em] text-gray-950 transition-colors hover:text-blue-600 hover:underline hover:underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-gray-100 dark:hover:text-blue-300'
          >
            {model.name}
          </a>
        ) : (
          <span className='block whitespace-normal break-words font-mono text-[13px] font-medium leading-5 tracking-[-0.025em] text-gray-950 dark:text-gray-100'>
            {model.name}
          </span>
        )}
        <div className='mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[12px] font-normal leading-5 text-gray-500 dark:text-gray-400'>
          <span className='whitespace-normal break-words'>
            {model.organization || t('lmrank.unavailable')}
          </span>
          {showLicense && (
            <>
              <span
                aria-hidden='true'
                className='text-gray-300 dark:text-gray-600'
              >
                ·
              </span>
              <span className='whitespace-nowrap'>
                {t('lmrank.open_source')}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const ArenaProviderLink = ({
  name,
  provider,
  offer,
}: {
  name: string;
  provider: ArenaProvider;
  offer?: ArenaProviderOffer;
}) => {
  const { t, i18n } = useTranslation('rank');
  const modelURL = i18n.language.startsWith('zh')
    ? offer?.model_url_zh
    : offer?.model_url_en;

  if (!offer?.model_id || !modelURL) {
    return (
      <span className='text-xs text-gray-400'>{t('lmrank.unavailable')}</span>
    );
  }

  return (
    <a
      href={modelURL}
      target='_blank'
      rel='noopener noreferrer'
      title={t('lmrank.view_on_provider', { provider: provider.name })}
      aria-label={`${t('lmrank.view_model')}: ${name} — ${provider.name}`}
      className='inline-flex items-center gap-1 whitespace-nowrap rounded py-1 text-xs font-normal text-gray-500 transition-colors hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:text-gray-400 dark:hover:text-blue-300'
    >
      <span>{t('lmrank.view_model')}</span>
      <MdNorthEast size={12} aria-hidden='true' className='shrink-0' />
    </a>
  );
};

export const ArenaPriceHeader = ({
  providerName,
}: {
  providerName?: string;
}) => {
  const { t, i18n } = useTranslation('rank');
  const id = useId();

  return (
    <div className='inline-flex items-center gap-0.5'>
      <span>
        {providerName ? `${providerName} · ` : ''}
        {t('lmrank.thead.price')}
      </span>
      <button
        type='button'
        popoverTarget={id}
        aria-label={t('lmrank.price_help')}
        className='inline-flex h-6 w-6 shrink-0 items-center justify-start rounded text-gray-400 hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:hover:text-gray-200'
      >
        <MdInfoOutline size={12} aria-hidden='true' />
      </button>
      <div
        id={id}
        popover='auto'
        className='m-auto w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-gray-200 bg-white p-4 text-left text-xs font-normal leading-6 text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
      >
        <p className='mb-1 font-medium text-gray-900 dark:text-gray-100'>
          {t('lmrank.price_help')}
        </p>
        <p>{t('lmrank.price_tier_description')}</p>
        <p>{t('lmrank.price_precision')}</p>
        {i18n.language.startsWith('zh') && (
          <p>{t('lmrank.exchange_estimate', { rate: USD_TO_CNY })}</p>
        )}
        <button
          type='button'
          popoverTarget={id}
          popoverTargetAction='hide'
          className='mt-2 rounded px-2 py-1 text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-gray-200 dark:hover:bg-gray-700'
        >
          {t('lmrank.close_price_help')}
        </button>
      </div>
    </div>
  );
};

const priceTierStyles: Record<ArenaPriceTier, string> = {
  high: 'bg-rose-50/70 text-rose-700/80 dark:bg-rose-400/10 dark:text-rose-300/90',
  medium: 'bg-gray-50 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300',
  low: 'bg-green-50 text-green-700 dark:bg-green-400/10 dark:text-green-300',
};

export const ArenaPrice = ({
  offer,
  providerName,
  tier,
}: {
  offer?: ArenaProviderOffer | LMArenaRankDataItem;
  providerName: string;
  tier?: ArenaPriceTier;
}) => {
  const { t, i18n } = useTranslation('rank');
  const isChinese = i18n.language.startsWith('zh');
  const currency = isChinese ? '¥' : '$';
  const formatPrice = (price?: number | null, full = false) => {
    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0)
      return '—';
    const amount = price * (isChinese ? USD_TO_CNY : 1);
    return amount.toLocaleString(i18n.language, {
      maximumFractionDigits: full
        ? 6
        : amount > 0 && amount < 0.01
          ? Math.min(20, -Math.floor(Math.log10(amount)))
          : 2,
    });
  };
  const unit = offer?.price_unit;
  const tokenPrice = unit === 'usd_per_million_tokens';
  const supportedUnit =
    tokenPrice || unit === 'usd_per_image' || unit === 'usd_per_second';
  const rawPrices = tokenPrice
    ? [offer?.input_price, offer?.output_price]
    : [offer?.output_price];
  const prices = rawPrices.map((price) => formatPrice(price));

  if (
    (offer && 'provider_id' in offer && !offer.model_id) ||
    !supportedUnit ||
    prices.every((price) => price === '—')
  ) {
    return (
      <span
        className='text-xs text-gray-400'
        aria-label={t('lmrank.unavailable')}
      >
        —
      </span>
    );
  }

  const unitLabel = t(`lmrank.price_units.${unit}`);
  const priceText = `${isChinese ? '≈' : ''}${currency}${prices.join(' / ')}`;
  const fullPriceText = `${isChinese ? '≈' : ''}${currency}${rawPrices.map((price) => formatPrice(price, true)).join(' / ')}`;
  const priceDescription = `${providerName} · ${fullPriceText} · ${unitLabel}${
    isChinese
      ? `（${t('lmrank.exchange_estimate', { rate: USD_TO_CNY })}）`
      : ''
  }`;

  return (
    <div
      className='flex min-w-0 flex-col items-start gap-0.5'
      title={priceDescription}
    >
      <div className='flex min-w-0 max-w-full items-center gap-1 whitespace-normal text-xs leading-5'>
        <span
          className='min-w-0 break-words font-normal tabular-nums text-gray-700 dark:text-gray-300'
          aria-label={priceDescription}
        >
          {priceText}
        </span>
        {tier && (
          <span
            className={`inline-flex shrink-0 items-center whitespace-nowrap rounded px-1 py-px text-[10px] font-normal leading-3 ${priceTierStyles[tier]}`}
            title={t('lmrank.price_tier_description')}
          >
            {t(`lmrank.price_tiers.${tier}`)}
          </span>
        )}
      </div>
      {tokenPrice && (
        <span className='whitespace-normal text-[10px] leading-4 text-gray-400 md:hidden'>
          {t('lmrank.input')} / {t('lmrank.output')}
        </span>
      )}
      <span
        className={`whitespace-normal text-[10px] leading-4 text-gray-400 ${tokenPrice ? 'hidden md:block' : ''}`}
      >
        {unitLabel}
      </span>
    </div>
  );
};
