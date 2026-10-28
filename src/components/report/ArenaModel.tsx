import copy from 'copy-to-clipboard';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { MdOutlineFileCopy } from 'react-icons/md';

import Message from '@/components/message';

import { LMArenaRankDataItem } from '@/types/rank';

import providerLogos from '~/images/arena/providers.json';

const logos: Record<string, string> = providerLogos;

const ArenaProvider = ({ model }: { model: LMArenaRankDataItem }) => {
  const { t } = useTranslation('rank');
  const license = model.license?.trim();
  const isOpenSource =
    !!license && !['proprietary', 'unknown'].includes(license.toLowerCase());

  return (
    <span className='flex items-center gap-1 text-xs font-normal leading-4 text-gray-500 dark:text-gray-400'>
      <span className='truncate' title={model.organization}>
        {model.organization || t('lmrank.unavailable')}
      </span>
      {isOpenSource && (
        <>
          <span aria-hidden='true'>·</span>
          <span
            className='shrink-0 whitespace-nowrap text-green-700 dark:text-green-300'
            title={license}
          >
            {t('lmrank.open_source')}
          </span>
        </>
      )}
    </span>
  );
};

export const ArenaModel = ({
  model,
  expanded,
  onToggle,
  controlsId,
}: {
  model: LMArenaRankDataItem;
  expanded: boolean;
  onToggle: () => void;
  controlsId: string;
}) => {
  const [failedLogo, setFailedLogo] = useState<string>();
  const logo = logos[model.organization];

  return (
    <button
      type='button'
      aria-expanded={expanded}
      aria-controls={controlsId}
      onClick={onToggle}
      className='flex w-52 items-center gap-2 rounded text-left hover:text-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500'
    >
      <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white p-1 text-xs text-gray-700'>
        {logo && failedLogo !== logo ? (
          <img
            src={logo}
            alt={model.organization}
            width={20}
            height={20}
            className='h-5 w-5 object-contain'
            onError={() => setFailedLogo(logo)}
          />
        ) : (
          <span aria-hidden='true'>
            {(model.organization || model.name).slice(0, 1).toUpperCase()}
          </span>
        )}
      </span>
      <span className='min-w-0 flex-1'>
        <span className='block truncate leading-5' title={model.name}>
          {model.name}
        </span>
        <span className='mt-1 block'>
          <ArenaProvider model={model} />
        </span>
      </span>
    </button>
  );
};

export const ArenaModelID = ({
  model,
  id,
  hidden,
}: {
  model: LMArenaRankDataItem;
  id: string;
  hidden: boolean;
}) => {
  const { t } = useTranslation('rank');
  const handleCopy = () => {
    copy(model.model_id)
      ? Message.success(t('lmrank.copy_success'))
      : Message.error(t('lmrank.copy_fail'));
  };

  return (
    <div
      id={id}
      hidden={hidden}
      className={`${
        hidden ? 'hidden' : 'flex'
      } items-center gap-2 whitespace-nowrap text-xs font-normal leading-4 text-gray-500 dark:text-gray-400`}
    >
      <button
        type='button'
        onClick={handleCopy}
        aria-label={`${t('lmrank.copy')} ${t('lmrank.model_id')}`}
        title={`${t('lmrank.copy')} ${t('lmrank.model_id')}`}
        className='flex h-4 w-4 shrink-0 items-center justify-center rounded text-gray-400 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:hover:text-blue-400'
      >
        <MdOutlineFileCopy size={14} aria-hidden='true' />
      </button>
      <code className='select-all'>{model.model_id}</code>
    </div>
  );
};

const tierStyles = {
  low: 'bg-green-50 text-green-700 ring-green-600/10 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-400/20',
  medium:
    'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-700/50 dark:text-gray-300 dark:ring-gray-400/20',
  high: 'bg-orange-50 text-orange-700 ring-orange-600/10 dark:bg-orange-900/30 dark:text-orange-300 dark:ring-orange-400/20',
  very_high:
    'bg-rose-50 text-rose-700 ring-rose-600/10 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-400/20',
};

export const ArenaPrice = ({ model }: { model: LMArenaRankDataItem }) => {
  const { t, i18n } = useTranslation('rank');
  const formatPrice = (price?: number | null) =>
    typeof price === 'number' && Number.isFinite(price) && price >= 0
      ? price.toLocaleString(i18n.language, { maximumFractionDigits: 6 })
      : '—';
  const inputPrice = formatPrice(model.input_price);
  const outputPrice = formatPrice(model.output_price);
  const priceDescription = `${t('lmrank.input')} $${inputPrice} / ${t(
    'lmrank.output'
  )} $${outputPrice}`;
  const hasPrice =
    model.price_unit === 'usd_per_million_tokens' &&
    [inputPrice, outputPrice].some((price) => price !== '—');

  if (!hasPrice) {
    return (
      <span className='text-xs text-gray-400'>{t('lmrank.unavailable')}</span>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <span
        className='whitespace-nowrap text-sm font-semibold tabular-nums tracking-tight text-gray-800 dark:text-gray-100'
        aria-label={priceDescription}
        title={priceDescription}
      >
        {`$${inputPrice} / ${outputPrice}`}
      </span>
      {model.price_tier && tierStyles[model.price_tier] && (
        <span
          className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium leading-4 ring-1 ring-inset ${
            tierStyles[model.price_tier]
          }`}
        >
          {t(`lmrank.price_tiers.${model.price_tier}`)}
        </span>
      )}
    </div>
  );
};
