import { fireEvent, render, screen } from '@testing-library/react';
import { useTranslation } from 'next-i18next/pages';

import { ArenaModel, ArenaOfoxLink, ArenaPrice } from './ArenaModel';

import { LMArenaRankDataItem } from '@/types/rank';

jest.mock('next-i18next/pages', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  })),
}));

const model: LMArenaRankDataItem = {
  name: 'Example model',
  model_id: 'example/example-model-2026-09-01',
  model_url_en: 'https://supplier.example/en/detail/example-model',
  model_url_zh: 'https://supplier.example/zh/detail/example-model',
  organization: 'Anthropic',
  license: 'Proprietary',
  position: 1,
  rating: 1500,
  change: 0,
};

const ModelDetails = ({ model }: { model: LMArenaRankDataItem }) => (
  <ArenaModel model={model} />
);

it('shows the model and provider without ID disclosure controls', () => {
  const { container } = render(<ModelDetails model={model} />);
  expect(screen.getByText(model.name)).toBeVisible();
  expect(screen.getByText(model.name).closest('button')).toBeNull();
  expect(screen.getByRole('link', { name: model.name })).toHaveAttribute(
    'href',
    model.model_url_en
  );
  expect(screen.getByRole('link', { name: model.name })).toHaveAttribute(
    'rel',
    'noopener noreferrer'
  );
  expect(screen.getByText(model.organization)).toBeVisible();
  expect(screen.queryByText('lmrank.closed_source')).not.toBeInTheDocument();
  expect(screen.queryByText('lmrank.open_source')).not.toBeInTheDocument();
  expect(screen.queryByText(model.model_id!)).not.toBeInTheDocument();
  expect(container.querySelector('img')).toHaveAttribute(
    'src',
    '/images/arena/providers/anthropic.svg'
  );
  expect(container.querySelector('img')).toHaveAttribute('alt', '');
});

it('keeps long model and provider names readable without truncation', () => {
  const name = 'Example reasoning model with extended context (preview)';
  const organization = 'An independent model research organization';
  render(<ArenaModel model={{ ...model, name, organization }} />);
  expect(screen.getByText(name)).toHaveClass(
    'whitespace-normal',
    'break-words'
  );
  expect(screen.getByText(name)).not.toHaveClass('truncate');
  expect(screen.getByText(organization)).toHaveClass('whitespace-normal');
});

it('handles unavailable licenses and logos without broken images', () => {
  const { container } = render(
    <ModelDetails model={{ ...model, license: null }} />
  );
  fireEvent.error(container.querySelector('img')!);
  expect(container.querySelector('img')).toBeNull();
  expect(screen.getByText('A')).toBeInTheDocument();
  expect(
    screen.queryByText('lmrank.license_unavailable')
  ).not.toBeInTheDocument();
  expect(screen.queryByText('lmrank.open_source')).not.toBeInTheDocument();
});

it.each([
  ['en', 'https://supplier.example/en/detail/example-model'],
  ['en-US', 'https://supplier.example/en/detail/example-model'],
  ['zh', 'https://supplier.example/zh/detail/example-model'],
  ['zh-CN', 'https://supplier.example/zh/detail/example-model'],
])('links the OFOX CTA to the model page for %s', (language, href) => {
  jest.mocked(useTranslation).mockReturnValueOnce({
    t: (key: string) => key,
    i18n: { language },
  } as unknown as ReturnType<typeof useTranslation>);
  const model_id = 'openai/gpt-6.1-terra';
  render(<ArenaOfoxLink model={{ ...model, model_id }} />);
  const link = screen.getByRole('link', {
    name: `lmrank.view_model: ${model.name} — ofoxAI`,
  });
  expect(link).toHaveAttribute('href', href);
  expect(link).toHaveAttribute('title', 'lmrank.view_on_ofox');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByText('lmrank.view_model')).toBeVisible();
  expect(link.querySelector('img')).toBeNull();
  expect(screen.queryByText(model_id)).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

it('does not invent a link when the API omits the locale URL', () => {
  render(<ArenaOfoxLink model={{ ...model, model_url_en: null }} />);
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});

it.each([null, ''])(
  'does not offer to link or copy an unavailable ID: %s',
  (model_id) => {
    render(<ArenaOfoxLink model={{ ...model, model_id }} />);
    expect(screen.getByText('lmrank.unavailable')).toBeVisible();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  }
);

it.each([
  undefined,
  null,
  '',
  '   ',
  'Proprietary',
  ' PROPRIETARY ',
  'Unknown',
  ' unknown ',
])('omits license labels and separators for %s', (license) => {
  render(<ModelDetails model={{ ...model, license }} />);
  expect(screen.getByText(model.organization)).toBeInTheDocument();
  expect(screen.queryByText('lmrank.open_source')).not.toBeInTheDocument();
  expect(screen.queryByText('lmrank.closed_source')).not.toBeInTheDocument();
  expect(
    screen.queryByText('lmrank.license_unavailable')
  ).not.toBeInTheDocument();
  expect(screen.queryByText('·')).not.toBeInTheDocument();
});

it.each(['Apache 2.0', 'MIT', 'Kimi K3 license', 'qwen-research'])(
  'shows the open-source label after the provider: %s',
  (license) => {
    render(<ModelDetails model={{ ...model, license }} />);
    expect(screen.queryByText(license)).not.toBeInTheDocument();
    expect(
      screen.getByText(model.organization).parentElement
    ).toHaveTextContent(`${model.organization}·lmrank.open_source`);
  }
);

it.each([
  { ofox_input_price: 0, ofox_output_price: 0.000001, label: '$0 / 0.000001' },
  { ofox_input_price: 10, ofox_output_price: 50, label: '$10 / 50' },
  { ofox_input_price: 10, ofox_output_price: null, label: '$10 / —' },
  { ofox_input_price: null, ofox_output_price: 50, label: '$— / 50' },
])('uses ofoxAI prices rather than Arena prices: $label', (prices) => {
  render(
    <ArenaPrice
      model={{
        ...model,
        ...prices,
        input_price: 999,
        output_price: 999,
        ofox_price_unit: 'usd_per_million_tokens',
      }}
    />
  );
  expect(screen.getByText(prices.label)).toHaveAttribute(
    'aria-label',
    expect.stringContaining('ofoxAI')
  );
  expect(
    screen.getByText('lmrank.price_units.usd_per_million_tokens')
  ).toBeVisible();
  expect(screen.queryByText(/999/)).not.toBeInTheDocument();
});

it.each([
  { ofox_input_price: 10, ofox_output_price: 50, label: '≈¥70 / 350' },
  { ofox_input_price: 0, ofox_output_price: 0.000001, label: '≈¥0 / 0.000007' },
  { ofox_input_price: 0.1, ofox_output_price: 0.3, label: '≈¥0.7 / 2.1' },
])('marks CNY prices as estimates: $label', (prices) => {
  jest.mocked(useTranslation).mockReturnValueOnce({
    t: (key: string) => key,
    i18n: { language: 'zh-CN' },
  } as unknown as ReturnType<typeof useTranslation>);
  render(
    <ArenaPrice
      model={{ ...model, ...prices, ofox_price_unit: 'usd_per_million_tokens' }}
    />
  );
  expect(screen.getByText(prices.label)).toHaveAttribute(
    'aria-label',
    expect.stringContaining('lmrank.exchange_estimate')
  );
});

it.each(['usd_per_image', 'usd_per_second'] as const)(
  'shows ofoxAI media price with unit %s',
  (unit) => {
    render(
      <ArenaPrice
        model={{ ...model, ofox_output_price: 0.13, ofox_price_unit: unit }}
      />
    );
    expect(screen.getByText('$0.13')).toBeVisible();
    expect(screen.getByText(`lmrank.price_units.${unit}`)).toBeVisible();
  }
);

it.each([
  [1.234567, '$1.23', '1.234567'],
  [0.000123, '$0.0001', '0.000123'],
  [0.009999, '$0.01', '0.009999'],
  [0, '$0', '$0'],
])(
  'keeps compact prices readable and preserves the full quote: %s',
  (price, label, full) => {
    render(
      <ArenaPrice
        model={{
          ...model,
          ofox_output_price: price as number,
          ofox_price_unit: 'usd_per_image',
        }}
        tier='low'
      />
    );
    const amount = screen.getByText(label);
    expect(amount).toHaveAttribute('aria-label', expect.stringContaining(full));
    expect(amount.nextElementSibling).toBe(
      screen.getByText('lmrank.price_tiers.low')
    );
    expect(amount.parentElement?.parentElement).toContainElement(
      screen.getByText('lmrank.price_units.usd_per_image')
    );
  }
);

it('does not fall back to Arena prices for missing or invalid ofoxAI prices', () => {
  const pricedModel = {
    ...model,
    input_price: 10,
    output_price: 50,
    price_unit: 'usd_per_million_tokens' as const,
  };
  const { rerender } = render(<ArenaPrice model={pricedModel} />);
  expect(screen.getByLabelText('lmrank.unavailable')).toHaveTextContent('—');
  rerender(
    <ArenaPrice
      model={{
        ...pricedModel,
        ofox_input_price: -1,
        ofox_output_price: NaN,
        ofox_price_unit: 'usd_per_million_tokens',
      }}
    />
  );
  expect(screen.getByLabelText('lmrank.unavailable')).toHaveTextContent('—');
  rerender(
    <ArenaPrice
      model={{
        ...pricedModel,
        model_id: null,
        ofox_input_price: 1,
        ofox_price_unit: 'usd_per_million_tokens',
      }}
    />
  );
  expect(screen.getByLabelText('lmrank.unavailable')).toHaveTextContent('—');
});
