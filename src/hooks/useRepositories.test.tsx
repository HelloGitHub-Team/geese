import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';

import { fetcher } from '@/services/base';

import useRepositories from './useRepositories';

jest.mock('@/services/base', () => ({ fetcher: jest.fn() }));
jest.mock('react-infinite-scroll-hook', () => ({
  __esModule: true,
  default: jest.fn(() => [jest.fn()]),
}));

it('loads subsequent pages, deduplicates items and resets on filter changes', async () => {
  const request = jest.mocked(fetcher);
  request.mockImplementation(async (input) => {
    const url = new URL(String(input));
    const page = Number(url.searchParams.get('page'));
    const sort = url.searchParams.get('sort_by');
    return {
      success: true,
      has_more: page === 1,
      data:
        sort === 'all'
          ? [{ item_id: 'all-item' }]
          : page === 1
            ? [{ item_id: 'first' }, { item_id: 'shared' }]
            : [{ item_id: 'shared' }, { item_id: 'second' }],
    } as any;
  });
  const cache = new Map();
  const { result, rerender } = renderHook(
    ({ sort }) => useRepositories(sort, undefined, '', undefined, undefined),
    {
      initialProps: { sort: 'featured' },
      wrapper: ({ children }) => (
        <SWRConfig value={{ provider: () => cache, dedupingInterval: 0 }}>
          {children}
        </SWRConfig>
      ),
    }
  );

  await waitFor(() => expect(result.current.repositories).toHaveLength(2));
  expect(result.current.hasMore).toBe(true);

  const useInfiniteScroll = jest.requireMock(
    'react-infinite-scroll-hook'
  ).default;
  act(() => {
    useInfiniteScroll.mock.calls.at(-1)[0].onLoadMore();
  });

  await waitFor(() => expect(result.current.repositories).toHaveLength(3));
  expect(result.current.repositories.map((item) => item.item_id)).toEqual([
    'first',
    'shared',
    'second',
  ]);
  expect(result.current.hasMore).toBe(false);
  expect(
    request.mock.calls.filter(
      ([input]) => new URL(String(input)).searchParams.get('page') === '1'
    )
  ).toHaveLength(1);

  rerender({ sort: 'all' });
  await waitFor(() =>
    expect(result.current.repositories.map((item) => item.item_id)).toEqual([
      'all-item',
    ])
  );
  expect(result.current.size).toBe(1);
});
