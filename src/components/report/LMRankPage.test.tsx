import { fireEvent, render, screen } from '@testing-library/react';
import { GetServerSidePropsContext } from 'next';

import LMRankPage, { getServerSideProps } from '@/pages/report/lm-rank';
import { getLMArenaRank } from '@/services/rank';

jest.mock('next/router', () => ({
  useRouter: () => ({ query: {}, push: jest.fn() }),
}));
jest.mock('next-i18next', () => ({
  Trans: () => null,
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));
jest.mock('next-i18next/serverSideTranslations', () => ({
  serverSideTranslations: jest.fn(),
}));
jest.mock('@/components/navbar/Navbar', () => () => null);
jest.mock('@/components/Seo', () => () => null);
jest.mock('@/services/rank', () => ({
  getLMArenaRank: jest.fn().mockResolvedValue({ success: false }),
}));
jest.mock('@/utils/util', () => ({ getClientIP: () => '127.0.0.1' }));

it('opens one model ID at a time and resets expansion when the board changes', () => {
  const props = {
    year: 2026,
    month: 9,
    monthList: [9],
    category: 'text',
    categoryList: ['text', 'vision'],
    list: ['First model', 'Second model'].map((name, index) => ({
      name,
      model_id: `model-${index}-2026-09-preview`,
      organization: 'Anthropic',
      position: index + 1,
      rating: 1500 - index,
      change: 0,
    })),
  };
  const { rerender } = render(<LMRankPage {...props} />);
  expect(screen.getByText(props.list[0].model_id)).not.toBeVisible();
  expect(screen.getByText(props.list[1].model_id)).not.toBeVisible();
  expect(
    screen.getByText('1500').parentElement?.querySelector('svg')
  ).toBeNull();

  fireEvent.click(screen.getByText('First model'));
  expect(screen.getByText(props.list[0].model_id)).toBeVisible();
  fireEvent.click(screen.getByText('Second model'));
  expect(screen.getByText(props.list[0].model_id)).not.toBeVisible();
  expect(screen.getByText(props.list[1].model_id)).toBeVisible();
  fireEvent.click(screen.getByText('Second model'));
  expect(screen.getByText(props.list[1].model_id)).not.toBeVisible();

  fireEvent.click(screen.getByText('First model'));
  rerender(<LMRankPage {...props} category='vision' />);
  expect(screen.getByText(props.list[0].model_id)).not.toBeVisible();

  fireEvent.click(screen.getByText('First model'));
  rerender(<LMRankPage {...props} category='vision' month={8} />);
  expect(screen.getByText(props.list[0].model_id)).not.toBeVisible();
});

it('keeps duplicate public IDs and tied ranks independently expandable', () => {
  const model = {
    name: 'Shared model',
    model_id: 'shared-model (preview)',
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
      list={[{ ...model }, { ...model }]}
    />
  );
  const buttons = screen.getAllByRole('button', { name: /Shared model/ });
  const ids = screen.getAllByText(model.model_id);
  expect(buttons[0].getAttribute('aria-controls')).not.toBe(
    buttons[1].getAttribute('aria-controls')
  );
  fireEvent.click(buttons[0]);
  expect(ids[0]).toBeVisible();
  expect(ids[1]).not.toBeVisible();
  expect(ids[0].parentElement).toHaveAttribute(
    'id',
    buttons[0].getAttribute('aria-controls')
  );
  fireEvent.click(buttons[1]);
  expect(ids[0]).not.toBeVisible();
  expect(ids[1]).toBeVisible();
  expect(ids[1].parentElement).toHaveAttribute(
    'id',
    buttons[1].getAttribute('aria-controls')
  );
  expect(
    screen.getAllByRole('button', { name: 'lmrank.copy lmrank.model_id' })
  ).toHaveLength(1);
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
