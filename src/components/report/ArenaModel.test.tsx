import { fireEvent, render, screen, within } from '@testing-library/react';
import { createInstance } from 'i18next';
import { useTranslation } from 'next-i18next/pages';

import {
  ArenaModel,
  ArenaPrice,
  ArenaPriceHeader,
  ArenaProviderLink,
} from './ArenaModel';

import {
  ArenaProvider,
  ArenaProviderOffer,
  LMArenaRankDataItem,
} from '@/types/rank';

import en from '~/locales/en/rank.json';
import zh from '~/locales/zh/rank.json';

jest.mock('next-i18next/pages', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  })),
}));

const provider: ArenaProvider = {
  id: 1,
  code: 'ofox',
  name: 'ofoxAI',
  website_url: 'https://supplier.example',
  is_show_price: true,
};
const offer: ArenaProviderOffer = {
  provider_id: provider.id,
  model_id: 'example/example-model-2026-09-01',
  model_url_en: 'https://supplier.example/en/detail/example-model',
  model_url_zh: 'https://supplier.example/zh/detail/example-model',
};
const model: LMArenaRankDataItem = {
  name: 'Example model',
  model_id: null,
  organization: 'Anthropic',
  license: 'Proprietary',
  position: 1,
  rating: 1500,
  change: 0,
  providers: [offer],
};

const ModelDetails = ({ model }: { model: LMArenaRankDataItem }) => (
  <ArenaModel model={model} provider={provider} offer={offer} />
);

it('shows the model and organization with the supplied provider link', () => {
  const { container } = render(<ModelDetails model={model} />);
  expect(screen.getByText(model.name)).toBeVisible();
  expect(screen.getByText(model.name).closest('button')).toBeNull();
  expect(screen.getByRole('link', { name: model.name })).toHaveAttribute(
    'href',
    offer.model_url_en
  );
  expect(screen.getByRole('link', { name: model.name })).toHaveAttribute(
    'rel',
    'noopener noreferrer'
  );
  expect(screen.getByText(model.organization)).toBeVisible();
  expect(screen.queryByText('lmrank.closed_source')).not.toBeInTheDocument();
  expect(screen.queryByText('lmrank.open_source')).not.toBeInTheDocument();
  expect(screen.queryByText(offer.model_id!)).not.toBeInTheDocument();
  expect(container.querySelector('img')).toHaveAttribute(
    'src',
    '/images/arena/providers/anthropic.svg'
  );
  expect(container.querySelector('img')).toHaveAttribute('alt', '');
});

it('keeps long model and organization names readable without truncation', () => {
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

it('does not link the model without a visible provider even with legacy URLs', () => {
  render(
    <ArenaModel
      model={{
        ...model,
        model_id: offer.model_id,
        model_url_en: offer.model_url_en,
      }}
      offer={offer}
    />
  );
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
  expect(screen.getByText(model.name)).toBeVisible();
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
])('links the provider CTA to the model page for %s', (language, href) => {
  jest.mocked(useTranslation).mockReturnValueOnce({
    t: (key: string) => key,
    i18n: { language },
  } as unknown as ReturnType<typeof useTranslation>);
  render(
    <ArenaProviderLink name={model.name} provider={provider} offer={offer} />
  );
  const link = screen.getByRole('link', {
    name: `lmrank.view_model: ${model.name} — ofoxAI`,
  });
  expect(link).toHaveAttribute('href', href);
  expect(link).toHaveAttribute('title', 'lmrank.view_on_provider');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByText('lmrank.view_model')).toBeVisible();
  expect(link.querySelector('img')).toBeNull();
  expect(screen.queryByText(offer.model_id!)).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

it('does not invent a link when the API omits the locale URL', () => {
  render(
    <ArenaProviderLink
      name={model.name}
      provider={provider}
      offer={{ ...offer, model_url_en: null }}
    />
  );
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});

it.each([null, ''])('does not link an unavailable ID: %s', (model_id) => {
  render(
    <ArenaProviderLink
      name={model.name}
      provider={provider}
      offer={{ ...offer, model_id }}
    />
  );
  expect(screen.getByText('lmrank.unavailable')).toBeVisible();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});

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
  'shows the open-source label after the organization: %s',
  (license) => {
    render(<ModelDetails model={{ ...model, license }} />);
    expect(screen.queryByText(license)).not.toBeInTheDocument();
    expect(
      screen.getByText(model.organization).parentElement
    ).toHaveTextContent(`${model.organization}·lmrank.open_source`);
  }
);

it.each([
  ['en', en],
  ['zh', zh],
] as const)(
  'shows compact price help without a close button or list markers in %s',
  async (language, messages) => {
    const i18n = createInstance();
    await i18n.init({
      lng: language,
      resources: { [language]: { rank: messages } },
      defaultNS: 'rank',
    });
    jest.mocked(useTranslation).mockReturnValue({
      t: i18n.t.bind(i18n),
      i18n,
    } as unknown as ReturnType<typeof useTranslation>);

    const { container, rerender } = render(<ArenaPriceHeader />);
    expect(screen.getByText(messages.lmrank.thead.price)).toBeVisible();
    const trigger = screen.getByRole('button', {
      name: messages.lmrank.price_help,
    });
    const help = container.querySelector<HTMLElement>('[popover]')!;
    expect(trigger).toHaveAttribute('popovertarget', help.id);
    expect(help).toHaveAttribute('popover', 'auto');
    expect(help).toHaveClass('p-3', 'leading-5');
    expect(help.querySelector('button, ul, ol, li')).toBeNull();
    expect(
      within(help).getByText(messages.lmrank.price_tier_description)
    ).toBeVisible();
    expect(
      within(help).getByText(messages.lmrank.price_precision)
    ).toBeVisible();
    const exchangeNote = i18n.t('lmrank.exchange_estimate', { rate: 7 });
    if (language === 'zh') {
      expect(within(help).getByText(exchangeNote)).toBeVisible();
    } else {
      expect(within(help).queryByText(exchangeNote)).not.toBeInTheDocument();
    }

    rerender(<ArenaPriceHeader providerName='Example supplier' />);
    expect(
      screen.getByText(`Example supplier · ${messages.lmrank.thead.price}`)
    ).toBeVisible();
    jest
      .mocked(useTranslation)
      .mockReset()
      .mockImplementation(
        () =>
          ({
            t: (key: string) => key,
            i18n: { language: 'en' },
          }) as unknown as ReturnType<typeof useTranslation>
      );
  }
);

it.each([
  { input_price: 0, output_price: 0.000001, label: '$0 / 0.000001' },
  { input_price: 10, output_price: 50, label: '$10 / 50' },
  { input_price: 10, output_price: null, label: '$10 / —' },
  { input_price: null, output_price: 50, label: '$— / 50' },
])('uses the provider quote: $label', (prices) => {
  render(
    <ArenaPrice
      offer={{ ...offer, ...prices, price_unit: 'usd_per_million_tokens' }}
      providerName='Example supplier'
    />
  );
  expect(screen.getByText(prices.label)).toHaveAttribute(
    'aria-label',
    expect.stringContaining('Example supplier')
  );
  expect(
    screen.getByText('lmrank.price_units.usd_per_million_tokens')
  ).toBeVisible();
});

it.each([
  { input_price: 10, output_price: 50, label: '≈¥70 / 350' },
  { input_price: 0, output_price: 0.000001, label: '≈¥0 / 0.000007' },
  { input_price: 0.1, output_price: 0.3, label: '≈¥0.7 / 2.1' },
])('marks CNY prices as estimates: $label', (prices) => {
  jest.mocked(useTranslation).mockReturnValueOnce({
    t: (key: string) => key,
    i18n: { language: 'zh-CN' },
  } as unknown as ReturnType<typeof useTranslation>);
  render(
    <ArenaPrice
      offer={{ ...offer, ...prices, price_unit: 'usd_per_million_tokens' }}
      providerName={provider.name}
    />
  );
  expect(screen.getByText(prices.label)).toHaveAttribute(
    'aria-label',
    expect.stringContaining('lmrank.exchange_estimate')
  );
});

it.each(['usd_per_image', 'usd_per_second'] as const)(
  'shows the provider media price with unit %s',
  (unit) => {
    render(
      <ArenaPrice
        offer={{ ...offer, output_price: 0.13, price_unit: unit }}
        providerName={provider.name}
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
        offer={{
          ...offer,
          output_price: price as number,
          price_unit: 'usd_per_image',
        }}
        providerName={provider.name}
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

it.each([
  undefined,
  offer,
  {
    ...offer,
    input_price: -1,
    output_price: NaN,
    price_unit: 'usd_per_million_tokens',
  },
  {
    ...offer,
    model_id: null,
    input_price: 1,
    price_unit: 'usd_per_million_tokens',
  },
  { ...offer, output_price: 1, price_unit: 'unknown' },
])('marks missing, invalid and unmatched quotes as unavailable', (quote) => {
  render(<ArenaPrice offer={quote} providerName={provider.name} />);
  expect(screen.getByLabelText('lmrank.unavailable')).toHaveTextContent('—');
});
