import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { getRecommend } from '@/services/home';

import Recommend from './Recommend';

import { RecommendItems } from '@/types/home';

jest.mock('@/services/home', () => ({ getRecommend: jest.fn() }));
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const request = jest.mocked(getRecommend);
const t = (key: string) => key;
const empty: RecommendItems = { success: true, total: 0, data: [] };
const populated: RecommendItems = {
  success: true,
  total: 1,
  data: [
    {
      rid: 'example',
      name: 'project',
      full_name: 'owner/project',
      author_avatar: '/images/avatar.png',
      description: 'Example project',
      primary_lang: 'TypeScript',
      lang_color: '#3178c6',
      stars: 1234,
      stars_str: '1.2k',
    },
  ],
};

beforeEach(() => {
  jest.resetAllMocks();
  jest.requireMock('next/router').useRouter.mockReturnValue({
    pathname: '/help/ats',
    query: {},
  });
});

it('shows loading only while pending, then renders projects and refreshes', async () => {
  let resolve!: (value: RecommendItems) => void;
  request.mockReturnValueOnce(new Promise((done) => (resolve = done)));
  request.mockResolvedValueOnce(empty);
  const { container } = render(<Recommend t={t} />);
  expect(screen.getByRole('button')).toBeDisabled();
  expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();

  await act(async () => resolve(populated));
  expect(screen.getByRole('link', { name: /owner\/project/ })).toHaveAttribute(
    'href',
    '/repository/owner/project'
  );
  expect(screen.getByText('1.2k')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'recommend.change' }));
  expect(await screen.findByText('recommend.empty')).toBeInTheDocument();
  expect(request).toHaveBeenCalledTimes(2);
});

it('ends loading when the API successfully returns no projects', async () => {
  request.mockResolvedValue(empty);
  const { container } = render(<Recommend t={t} />);
  expect(await screen.findByText('recommend.empty')).toBeInTheDocument();
  expect(container.querySelector('[aria-busy="true"]')).not.toBeInTheDocument();
  expect(screen.getByRole('button')).toBeEnabled();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it.each(['network', 'api'])(
  'shows %s failures and allows a successful retry',
  async (failure) => {
    if (failure === 'network')
      request.mockRejectedValueOnce(new Error('offline'));
    else request.mockResolvedValueOnce({ ...empty, success: false });
    request.mockResolvedValueOnce(populated);
    render(<Recommend t={t} />);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'recommend.error'
    );
    fireEvent.click(screen.getByRole('button', { name: 'recommend.retry' }));
    expect(await screen.findByText('owner/project')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  }
);

it('uses the current license filter and ignores results from a previous route', async () => {
  let resolvePrevious!: (value: RecommendItems) => void;
  request.mockReturnValueOnce(new Promise((done) => (resolvePrevious = done)));
  request.mockResolvedValueOnce(empty);
  const router = { pathname: '/license/[lid]', query: { lid: 'mit' } };
  jest.requireMock('next/router').useRouter.mockReturnValue(router);
  const { rerender } = render(<Recommend t={t} />);
  expect(request).toHaveBeenCalledWith('mit');
  router.query.lid = 'apache-2.0';
  rerender(<Recommend t={t} />);
  await waitFor(() => expect(request).toHaveBeenLastCalledWith('apache-2.0'));
  expect(await screen.findByText('recommend.empty')).toBeInTheDocument();
  await act(async () => resolvePrevious(populated));
  expect(screen.queryByText('owner/project')).not.toBeInTheDocument();
  expect(screen.getByText('CC-BY-3.0')).toBeInTheDocument();
});
