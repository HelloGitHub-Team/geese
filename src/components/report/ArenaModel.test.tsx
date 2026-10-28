import { fireEvent, render, screen } from '@testing-library/react';
import copy from 'copy-to-clipboard';
import { useState } from 'react';

import Message from '@/components/message';

import { ArenaModel, ArenaModelID, ArenaPrice } from './ArenaModel';

import { LMArenaRankDataItem } from '@/types/rank';

jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));
jest.mock('copy-to-clipboard', () => jest.fn());
jest.mock('@/components/message', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const model: LMArenaRankDataItem = {
  name: 'Example model',
  model_id: 'example-model-2026-09-01',
  organization: 'Anthropic',
  license: 'Proprietary',
  position: 1,
  rating: 1500,
  change: 0,
};

const ModelDetails = ({ model }: { model: LMArenaRankDataItem }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <ArenaModel
        model={model}
        expanded={expanded}
        controlsId='model-details'
        onToggle={() => setExpanded(!expanded)}
      />
      <ArenaModelID model={model} id='model-details' hidden={!expanded} />
    </>
  );
};

it('discloses the full model ID from an accessible model button', () => {
  render(<ModelDetails model={model} />);
  const toggle = screen.getByText(model.name).closest('button');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveAttribute('aria-controls', 'model-details');
  expect(screen.getByText(model.organization)).toBeVisible();
  expect(screen.queryByText('lmrank.closed_source')).not.toBeInTheDocument();
  expect(screen.queryByText('lmrank.open_source')).not.toBeInTheDocument();
  expect(screen.queryByText('·')).not.toBeInTheDocument();
  expect(screen.getByText(model.model_id)).not.toBeVisible();
  expect(screen.queryByText('2026-09-01')).not.toBeInTheDocument();
  expect(screen.queryByText('lmrank.release_date')).not.toBeInTheDocument();
  expect(screen.getByRole('img', { hidden: true })).toHaveAttribute(
    'src',
    '/images/arena/providers/anthropic.svg'
  );
  fireEvent.click(screen.getByText(model.name));
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(model.model_id)).toBeVisible();
  fireEvent.click(screen.getByText(model.name));
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText(model.model_id)).not.toBeVisible();
});

it('handles unavailable licenses and logos without broken images', () => {
  render(<ModelDetails model={{ ...model, license: null }} />);
  fireEvent.error(screen.getByRole('img', { hidden: true }));
  expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
  expect(screen.getByText('A')).toBeInTheDocument();
  expect(
    screen.queryByText('lmrank.license_unavailable')
  ).not.toBeInTheDocument();
  expect(screen.queryByText('lmrank.open_source')).not.toBeInTheDocument();
});

it.each([true, false])(
  'copies the exact model ID and reports success=%s',
  (copied) => {
    jest.clearAllMocks();
    jest.mocked(copy).mockReturnValueOnce(copied);
    render(<ModelDetails model={model} />);
    const toggle = screen.getByText(model.name).closest('button');
    fireEvent.click(screen.getByText(model.name));
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(model.model_id)).toBeVisible();
    const copyButton = screen.getByRole('button', {
      name: 'lmrank.copy lmrank.model_id',
    });
    fireEvent.click(copyButton);
    expect(copy).toHaveBeenCalledTimes(1);
    expect(copy).toHaveBeenCalledWith(model.model_id);
    expect(copied ? Message.success : Message.error).toHaveBeenCalledWith(
      copied ? 'lmrank.copy_success' : 'lmrank.copy_fail'
    );
    expect(copied ? Message.error : Message.success).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  }
);

it.each([undefined, '', '   ', 'Unknown', ' unknown ', ' PROPRIETARY '])(
  'omits license labels and separators for %s',
  (license) => {
    render(<ModelDetails model={{ ...model, license }} />);
    expect(screen.getByText(model.organization)).toBeInTheDocument();
    expect(screen.queryByText('lmrank.open_source')).not.toBeInTheDocument();
    expect(screen.queryByText('lmrank.closed_source')).not.toBeInTheDocument();
    expect(
      screen.queryByText('lmrank.license_unavailable')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('·')).not.toBeInTheDocument();
  }
);

it('shows the open-source badge and license for Apache 2.0', () => {
  render(<ModelDetails model={{ ...model, license: 'Apache 2.0' }} />);
  expect(screen.getByText('lmrank.open_source')).toHaveAttribute(
    'title',
    'Apache 2.0'
  );
  expect(screen.queryByText('lmrank.closed_source')).not.toBeInTheDocument();
  expect(screen.getByText('·')).toBeInTheDocument();
});

it('shows zero prices, precise output costs and the tier without currency text', () => {
  render(
    <ArenaPrice
      model={{
        ...model,
        input_price: 0,
        output_price: 0.000001,
        price_unit: 'usd_per_million_tokens',
        price_tier: 'low',
      }}
    />
  );
  expect(screen.getByText('$0 / 0.000001')).toHaveAttribute(
    'aria-label',
    'lmrank.input $0 / lmrank.output $0.000001'
  );
  expect(screen.getByText('lmrank.price_tiers.low')).toBeInTheDocument();
  expect(screen.queryByText(/price_units|USD|美元/)).not.toBeInTheDocument();
});

it.each([
  { input_price: 10, output_price: 50, label: '$10 / 50' },
  { input_price: 10, output_price: null, label: '$10 / —' },
  { input_price: null, output_price: 50, label: '$— / 50' },
])('shows compact prices as $label with the highest tier', (prices) => {
  render(
    <ArenaPrice
      model={{
        ...model,
        ...prices,
        price_unit: 'usd_per_million_tokens',
        price_tier: 'very_high',
      }}
    />
  );
  expect(screen.getByText(prices.label)).toBeInTheDocument();
  expect(screen.getByText('lmrank.price_tiers.very_high')).toBeInTheDocument();
});

it.each(['usd_per_image', 'usd_per_second'] as const)(
  'shows unavailable for %s without token prices',
  (price_unit) => {
    render(<ArenaPrice model={{ ...model, price_unit, price_tier: 'low' }} />);
    expect(screen.getByText('lmrank.unavailable')).toBeInTheDocument();
    expect(
      screen.queryByText('lmrank.price_tiers.low')
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/price_units|USD|美元/)).not.toBeInTheDocument();
  }
);

it('omits tiers for invalid or missing token prices', () => {
  const { rerender } = render(
    <ArenaPrice
      model={{
        ...model,
        price_unit: 'usd_per_million_tokens',
        input_price: -1,
        output_price: NaN,
        price_tier: 'low',
      }}
    />
  );
  expect(screen.getByText('lmrank.unavailable')).toBeInTheDocument();
  expect(screen.queryByText('lmrank.price_tiers.low')).not.toBeInTheDocument();
  rerender(<ArenaPrice model={{ ...model, price_tier: 'low' }} />);
  expect(screen.getByText('lmrank.unavailable')).toBeInTheDocument();
  expect(screen.queryByText('lmrank.price_tiers.low')).not.toBeInTheDocument();
});
