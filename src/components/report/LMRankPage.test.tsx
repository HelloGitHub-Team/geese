import { render, screen, within } from '@testing-library/react';
import { GetServerSidePropsContext } from 'next';

import LMRankPage, { getServerSideProps } from '@/pages/report/lm-rank';
import { getLMArenaRank } from '@/services/rank';

import { ArenaProvider, LMArenaRankData } from '@/types/rank';

const provider: ArenaProvider = {
  id: 1,
  code: 'ofox',
  name: 'ofoxAI',
  website_url: 'https://supplier.example',
  is_show_price: true,
};

jest.mock('next/router', () => ({
  useRouter: () => ({ query: {}, push: jest.fn() }),
}));
jest.mock('next-i18next/pages', () => ({
  Trans: () => null,
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));
jest.mock('next-i18next/pages/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn(),
}));
jest.mock('@/components/navbar/Navbar', () => () => null);
jest.mock('@/components/Seo', () => () => null);
jest.mock('@/services/rank', () => ({
  getLMArenaRank: jest.fn().mockResolvedValue({ success: false }),
}));
jest.mock('@/utils/util', () => ({ getClientIP: () => '127.0.0.1' }));

it('shows OFOX links in the last column and fits desktop content without a scroll hint', () => {
  const props = {
    year: 2026,
    month: 9,
    monthList: [9],
    providers: [provider],
    category: 'text',
    categoryList: ['text', 'vision'],
    list: ['First model', 'Second model'].map((name, index) => ({
      name,
      model_id: `example/model-${index}-2026-09-preview`,
      model_url_en: `https://supplier.example/en/item/${index}`,
      providers: [
        {
          provider_id: provider.id,
          model_id: `example/model-${index}-2026-09-preview`,
          model_url_en: `https://supplier.example/en/item/${index}`,
        },
      ],
      organization: 'Anthropic',
      position: index + 1,
      rating: 1500 - index,
      change: 0,
    })),
  };
  const { rerender } = render(<LMRankPage {...props} />);
  expect(
    screen
      .getAllByRole('columnheader')
      .map((cell) =>
        cell.querySelector('[popover]')
          ? cell.querySelector('span')?.textContent
          : cell.textContent
      )
  ).toEqual([
    'lmrank.thead.position',
    'lmrank.thead.name',
    'lmrank.thead.rating',
    'lmrank.thead.votes',
    'lmrank.thead.price',
    'ofoxAI',
  ]);
  expect(
    screen.getAllByRole('columnheader')[5].querySelector('img')
  ).toHaveAttribute('src', '/images/arena/ofox.svg');
  const rows = screen.getAllByRole('row').slice(1);
  props.list.forEach((model, index) => {
    const cells = within(rows[index]).getAllByRole('cell');
    expect(within(cells[1]).getByText(model.name)).toBeVisible();
    expect(within(cells[1]).queryByRole('button')).not.toBeInTheDocument();
    expect(
      within(cells[5]).queryByText(model.model_id)
    ).not.toBeInTheDocument();
    expect(within(cells[5]).queryByRole('button')).not.toBeInTheDocument();
    expect(
      within(cells[5]).getByRole('link', {
        name: `lmrank.view_model: ${model.name} — ofoxAI`,
      })
    ).toHaveAttribute('href', model.model_url_en);
    expect(cells[2].querySelector('svg')).toBeNull();
  });
  expect(screen.getByRole('table').parentElement).toHaveClass(
    'overflow-x-auto'
  );
  expect(screen.getByRole('table')).toHaveClass('w-full', 'table-fixed');
  expect(screen.getByRole('table')).toHaveStyle({
    minWidth: 'max(100%, 640px)',
  });
  expect(
    screen.getAllByRole('columnheader').map((cell) => cell.style.width)
  ).toEqual(['48px', 'auto', '72px', '72px', '192px', '104px']);
  expect(screen.queryByText('lmrank.scroll_hint')).not.toBeInTheDocument();

  rerender(<LMRankPage {...props} category='vision' month={8} />);
  props.list.forEach((model) => {
    expect(
      screen.getByRole('link', {
        name: `lmrank.view_model: ${model.name} — ofoxAI`,
      })
    ).toBeVisible();
  });
});

it('updates price tiers when the displayed leaderboard changes', () => {
  const props = {
    year: 2026,
    month: 9,
    monthList: [9],
    providers: [provider],
    category: 'text',
    categoryList: ['text'],
    list: [10, 20].map((price, index) => ({
      name: `Model ${index}`,
      model_id: `example/${index}`,
      organization: 'Example',
      position: index + 1,
      rating: 1500,
      change: 0,
      providers: [
        {
          provider_id: provider.id,
          model_id: `example/${index}`,
          output_price: price,
          price_unit: 'usd_per_million_tokens',
        },
      ],
    })),
  };
  const { rerender } = render(<LMRankPage {...props} />);
  expect(screen.getByText('lmrank.price_tiers.high')).toHaveClass(
    'text-rose-700/80',
    'bg-rose-50/70',
    'rounded'
  );
  expect(screen.getByText('lmrank.price_tiers.low')).toHaveClass(
    'text-green-700',
    'bg-green-50',
    'rounded'
  );
  expect(screen.getAllByText('lmrank.input / lmrank.output')).toHaveLength(2);
  rerender(<LMRankPage {...props} list={props.list.slice(0, 1)} />);
  expect(screen.queryByText('lmrank.price_tiers.high')).not.toBeInTheDocument();
  expect(screen.queryByText('lmrank.price_tiers.low')).not.toBeInTheDocument();
});

it('only links matched models when ranks are tied', () => {
  const model = {
    name: 'Shared model',
    model_id: 'example/shared-model',
    model_url_en: 'https://supplier.example/en/shared',
    providers: [
      {
        provider_id: provider.id,
        model_id: 'example/shared-model',
        model_url_en: 'https://supplier.example/en/shared',
      },
    ],
    organization: 'Anthropic',
    position: 1,
    rating: 1500,
    change: 0,
  };
  render(
    <LMRankPage
      year={2026}
      month={9}
      monthList={[9]}
      providers={[provider]}
      category='webdev'
      categoryList={['webdev']}
      list={[{ ...model }, { ...model }, { ...model, providers: [] }]}
    />
  );
  const rows = screen.getAllByRole('row').slice(1);
  for (const row of rows.slice(0, 2)) {
    const finalCell = within(row).getAllByRole('cell')[5];
    expect(
      within(finalCell).getByRole('link', {
        name: `lmrank.view_model: ${model.name} — ofoxAI`,
      })
    ).toHaveAttribute('href', model.model_url_en);
  }
  const unmatchedCell = within(rows[2]).getAllByRole('cell')[5];
  expect(within(unmatchedCell).getByText('lmrank.unavailable')).toBeVisible();
  expect(within(unmatchedCell).queryByRole('link')).not.toBeInTheDocument();
});

it('shows only the five supported categories even with an older backend', () => {
  render(
    <LMRankPage
      year={2026}
      month={9}
      monthList={[9]}
      providers={[provider]}
      category='text'
      categoryList={[
        'agent',
        'text',
        'webdev',
        'vision',
        'text-to-image',
        'text-to-video',
        'unknown',
      ]}
      list={[]}
    />
  );
  for (const name of [
    'Text',
    'Coding',
    'Vision',
    'Text to Image',
    'Text to Video',
  ]) {
    expect(screen.getByRole('button', { name })).toBeInTheDocument();
  }
  expect(screen.getByRole('button', { name: 'Text' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  expect(
    screen.queryByRole('button', { name: /^agent$/i })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'unknown' })
  ).not.toBeInTheDocument();
  expect(screen.queryByText('lmrank.agent_note')).not.toBeInTheDocument();
});

it('honors provider visibility and price switches without leaking legacy fields', () => {
  const otherProvider: ArenaProvider = {
    id: 2,
    code: 'other',
    name: 'Other supplier',
    website_url: 'https://other.example',
    is_show_price: true,
  };
  const props = {
    year: 2026,
    month: 9,
    monthList: [9],
    category: 'text',
    categoryList: ['text', 'vision'],
    providers: [provider, otherProvider],
    list: [
      {
        name: 'Example model',
        model_id: 'legacy-model',
        model_url_en: 'https://legacy.example/model',
        ofox_output_price: 999,
        ofox_price_unit: 'usd_per_million_tokens' as const,
        organization: 'Example org',
        position: 1,
        rating: 1500,
        change: 0,
        providers: [
          {
            provider_id: provider.id,
            model_id: 'first-model',
            model_url_en: 'https://supplier.example/en/model',
            input_price: 1,
            output_price: 2,
            price_unit: 'usd_per_million_tokens',
          },
          {
            provider_id: otherProvider.id,
            model_id: 'other-model',
            model_url_en: 'https://other.example/en/model',
            input_price: 3,
            output_price: 4,
            price_unit: 'usd_per_million_tokens',
          },
        ],
      },
    ],
  };
  const { rerender } = render(<LMRankPage {...props} />);
  expect(screen.getAllByRole('columnheader')).toHaveLength(8);
  expect(screen.getByText('ofoxAI · lmrank.thead.price')).toBeVisible();
  expect(screen.getByText('Other supplier · lmrank.thead.price')).toBeVisible();
  expect(screen.getByText('$1 / 2')).toBeVisible();
  expect(screen.getByText('$3 / 4')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Example model' })).toHaveAttribute(
    'href',
    'https://supplier.example/en/model'
  );
  expect(screen.queryByText(/999/)).not.toBeInTheDocument();

  rerender(
    <LMRankPage
      {...props}
      providers={[{ ...provider, is_show_price: false }, otherProvider]}
    />
  );
  expect(screen.getAllByRole('columnheader')).toHaveLength(7);
  expect(screen.queryByText('$1 / 2')).not.toBeInTheDocument();
  expect(
    screen.queryByText('ofoxAI · lmrank.thead.price')
  ).not.toBeInTheDocument();
  expect(screen.getByText('$3 / 4')).toBeVisible();
  expect(
    screen.getByRole('link', {
      name: 'lmrank.view_model: Example model — ofoxAI',
    })
  ).toBeVisible();

  rerender(
    <LMRankPage
      {...props}
      providers={[{ ...otherProvider, is_show_price: false }]}
    />
  );
  expect(screen.getAllByRole('columnheader')).toHaveLength(5);
  expect(screen.queryByText(/ofoxAI/)).not.toBeInTheDocument();
  expect(screen.queryByText(/lmrank.thead.price/)).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'lmrank.price_help' })
  ).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Example model' })).toHaveAttribute(
    'href',
    'https://other.example/en/model'
  );

  rerender(
    <LMRankPage {...props} providers={[]} category='vision' month={8} />
  );
  expect(screen.getAllByRole('columnheader')).toHaveLength(5);
  expect(screen.getByText('Arena · lmrank.thead.price')).toBeVisible();
  expect(screen.queryByText('$1 / 2')).not.toBeInTheDocument();
  expect(screen.queryByText('$3 / 4')).not.toBeInTheDocument();
  expect(screen.queryByText(/999/)).not.toBeInTheDocument();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
  expect(screen.queryByText('lmrank.provider_note')).not.toBeInTheDocument();
  expect(screen.getByText('Example org')).toBeVisible();
  expect(screen.getAllByRole('cell')[4]).toHaveTextContent('—');
  expect(screen.getByRole('table')).toHaveStyle({
    minWidth: 'max(100%, 536px)',
  });
});

it.each([
  { category: 'text', unit: 'usd_per_million_tokens', label: '$1 / 10' },
  { category: 'text-to-image', unit: 'usd_per_image', label: '$10' },
  { category: 'text-to-video', unit: 'usd_per_second', label: '$10' },
] as const)(
  'shows Arena prices without provider matches for $category',
  ({ category, unit, label }) => {
    const props = {
      year: 2026,
      month: 9,
      monthList: [9],
      category,
      categoryList: [category],
      providers: [],
      list: [10, 20].map((output_price, index) => ({
        name: `Arena model ${index}`,
        model_id: null,
        organization: 'Example',
        position: index + 1,
        rating: 1500,
        change: 0,
        input_price: 1,
        output_price,
        price_unit: unit,
      })),
    };
    const { rerender } = render(<LMRankPage {...props} />);
    expect(screen.getByText('Arena · lmrank.thead.price')).toBeVisible();
    expect(screen.getByText(label)).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Arena ·')
    );
    expect(screen.getAllByText(`lmrank.price_units.${unit}`)).toHaveLength(2);
    expect(screen.getByText('lmrank.price_tiers.low')).toBeVisible();
    expect(screen.getByText('lmrank.price_tiers.high')).toBeVisible();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    rerender(<LMRankPage {...props} providers={[provider]} />);
    expect(
      screen.queryByText('Arena · lmrank.thead.price')
    ).not.toBeInTheDocument();
    expect(screen.queryByText(label)).not.toBeInTheDocument();
    expect(
      screen.queryByText('lmrank.price_tiers.low')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('lmrank.price_tiers.high')
    ).not.toBeInTheDocument();
  }
);

it.each([undefined, [], [provider]])(
  'passes API provider configuration through SSR: %j',
  async (providers) => {
    jest.mocked(getLMArenaRank).mockResolvedValueOnce({
      success: true,
      year: 2026,
      month: 9,
      month_list: [9],
      category: 'text',
      category_list: ['text'],
      providers,
      data: [],
    } as LMArenaRankData);
    const result = await getServerSideProps({
      query: {},
      req: {},
      locale: 'en',
    } as unknown as GetServerSidePropsContext);
    expect(result).toMatchObject({ props: { providers: providers ?? [] } });
  }
);

it('defaults missing or unsupported URL categories to text and keeps valid ones', async () => {
  for (const category of [
    undefined,
    'agent',
    'unknown',
    '__proto__',
    'webdev',
  ]) {
    await getServerSideProps({
      query: { category, month: '9' },
      req: {},
      locale: 'en',
    } as unknown as GetServerSidePropsContext);
    expect(getLMArenaRank).toHaveBeenLastCalledWith(
      '127.0.0.1',
      '9',
      category === 'webdev' ? 'webdev' : 'text'
    );
  }
});

it.each([
  { votes: 0, label: '0', full: '0' },
  { votes: 999, label: '999', full: '999' },
  { votes: 1000, label: '1k', full: '1,000' },
  { votes: 1050, label: '1.1k', full: '1,050' },
  { votes: 13320, label: '13.3k', full: '13,320' },
  { votes: 1200000, label: '1200k', full: '1,200,000' },
  { votes: null, label: '—', full: undefined },
  { votes: undefined, label: '—', full: undefined },
  { votes: NaN, label: '—', full: undefined },
  { votes: Infinity, label: '—', full: undefined },
  { votes: -1, label: '—', full: undefined },
  { votes: 1.5, label: '—', full: undefined },
])('formats $votes votes as $label', ({ votes, label, full }) => {
  render(
    <LMRankPage
      year={2026}
      month={9}
      monthList={[9]}
      providers={[provider]}
      category='text'
      categoryList={['text']}
      list={[
        {
          name: 'Example model',
          model_id: 'example-model',
          organization: 'Anthropic',
          position: 1,
          rating: 1500,
          change: 0,
          votes,
        },
      ]}
    />
  );
  const cell = screen.getAllByRole('cell')[3];
  expect(cell).toHaveTextContent(label);
  if (full) {
    expect(cell.querySelector('span')).toHaveAttribute('title', full);
  } else {
    expect(cell.querySelector('[title]')).toBeNull();
  }
});
