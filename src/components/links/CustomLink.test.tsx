import { fireEvent, render, screen } from '@testing-library/react';

import { CustomLink, NoPrefetchLink } from './CustomLink';

describe('Next.js links', () => {
  it('renders one anchor and preserves attributes and click handlers', () => {
    const onClick = jest.fn((event) => event.preventDefault());
    const { container } = render(
      <NoPrefetchLink
        href='/article?sort_by=hot'
        className='font-bold'
        target='_blank'
        aria-label='Popular articles'
        onClick={onClick}
      >
        <span>Articles</span>
      </NoPrefetchLink>
    );
    const link = screen.getByRole('link', { name: 'Popular articles' });
    expect(link).toHaveAttribute('href', '/article?sort_by=hot');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveClass('font-bold');
    expect(container.querySelectorAll('a')).toHaveLength(1);
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['Mozilla/5.0 (Macintosh)', '_blank'],
    ['Mozilla/5.0 (iPhone; Mobile)', '_self'],
  ])('preserves the navigation target for %s', (userAgent, target) => {
    const agent = jest
      .spyOn(navigator, 'userAgent', 'get')
      .mockReturnValue(userAgent);
    render(
      <CustomLink href='/repository/example' aria-label='View project'>
        Project
      </CustomLink>
    );
    expect(screen.getByRole('link', { name: 'View project' })).toHaveAttribute(
      'target',
      target
    );
    agent.mockRestore();
  });
});
