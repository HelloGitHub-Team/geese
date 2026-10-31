import { render, screen, within } from '@testing-library/react';
import { GetServerSidePropsContext } from 'next';

import LMRankPage, { getServerSideProps } from '@/pages/report/lm-rank';
import { getLMArenaRank } from '@/services/rank';

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
    category: 'text',
    categoryList: ['text', 'vision'],
    list: ['First model', 'Second model'].map((name, index) => ({
      name,
      model_id: `example/model-${index}-2026-09-preview`,
      model_url_en: `https://supplier.example/en/item/${index}`,
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
    'lmrank.thead.ofox',
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
    category: 'text',
    categoryList: ['text'],
    list: [10, 20].map((price, index) => ({
      name: `Model ${index}`,
      model_id: `example/${index}`,
      organization: 'Example',
      position: index + 1,
      rating: 1500,
      change: 0,
      ofox_output_price: price,
      ofox_price_unit: 'usd_per_million_tokens' as const,
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
      category='webdev'
      categoryList={['webdev']}
      list={[{ ...model }, { ...model }, { ...model, model_id: null }]}
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
