import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

import SvgTrend from './SvgTrend';

const history = {
  x: ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'],
  y: [1000, 1020, 1020, 1010],
  min: 1000,
  max: 1020,
  increment: 10,
};

it.each([
  [[], []],
  [['2026-10-01'], [0]],
  [
    ['2026-10-01', '2026-10-02'],
    [50, 50],
  ],
])(
  'renders empty, single-point and flat histories without invalid geometry',
  (x, y) => {
    const html = renderToString(
      <SvgTrend x={x} y={y} min={y[0] ?? 0} max={y[0] ?? 0} increment={0} />
    );
    expect(html).not.toMatch(/NaN|Infinity/);
    const { container } = render(
      <SvgTrend x={x} y={y} min={y[0] ?? 0} max={y[0] ?? 0} increment={0} />
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(y.length);
    if (y.length === 1)
      expect(container.querySelector('circle')).toBeInTheDocument();
  }
);

it('uses smooth curves that stay within each pair of data values', () => {
  const { container } = render(<SvgTrend {...history} increment={20} />);
  const path =
    container.querySelector('path[fill="none"]')?.getAttribute('d') || '';
  const coordinates = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  let previousY = coordinates[1];
  for (let index = 2; index < coordinates.length; index += 6) {
    const control1 = coordinates[index + 1];
    const control2 = coordinates[index + 3];
    const nextY = coordinates[index + 5];
    for (let step = 0; step <= 20; step++) {
      const t = step / 20;
      const y =
        (1 - t) ** 3 * previousY +
        3 * (1 - t) ** 2 * t * control1 +
        3 * (1 - t) * t ** 2 * control2 +
        t ** 3 * nextY;
      expect(y).toBeGreaterThanOrEqual(Math.min(previousY, nextY) - 0.00001);
      expect(y).toBeLessThanOrEqual(Math.max(previousY, nextY) + 0.00001);
    }
    previousY = nextY;
  }
  expect(path.match(/ C /g)).toHaveLength(history.y.length - 1);
});

it('supports keyboard exploration, exact counts, dismissal and shorter data updates', () => {
  const { rerender } = render(<SvgTrend {...history} locale='en' />);
  const chart = screen.getByRole('slider', { name: 'Star history' });
  fireEvent.focus(chart);
  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-10-04');
  expect(chart).toHaveAttribute('aria-valuetext', '2026-10-04 · Star: 1,010');
  fireEvent.keyDown(chart, { key: 'ArrowLeft' });
  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-10-03');
  fireEvent.keyDown(chart, { key: 'Home' });
  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-10-01');
  fireEvent.keyDown(chart, { key: 'End' });
  rerender(
    <SvgTrend
      {...history}
      x={['2026-11-01']}
      y={[2000]}
      min={2000}
      max={2000}
      increment={0}
      locale='en'
    />
  );
  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-11-01');
  fireEvent.keyDown(chart, { key: 'Escape' });
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  rerender(
    <SvgTrend x={[]} y={[]} min={0} max={0} increment={0} locale='en' />
  );
  fireEvent.focus(screen.getByRole('img', { name: 'Star history' }));
  rerender(<SvgTrend {...history} locale='en' />);
  expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0');
});

it('makes small changes visible and derives the summary from the plotted samples', () => {
  const { container } = render(
    <SvgTrend
      x={['周一', '周二', '周三']}
      y={[35570, 35571, 35573]}
      min={0}
      max={40000}
      increment={999}
      locale='en'
    />
  );
  expect(screen.getByText('+3')).toBeVisible();
  expect(screen.getByText('(+0.01%)')).toBeVisible();
  expect(screen.queryByText('+999')).not.toBeInTheDocument();
  const path = container.querySelector('path[fill="none"]')!.getAttribute('d')!;
  const coordinates = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  expect(
    Math.abs(coordinates[1] - coordinates[coordinates.length - 1])
  ).toBeGreaterThan(60);
  fireEvent.focus(screen.getByRole('slider'));
  expect(screen.getByRole('tooltip')).toHaveTextContent('Wed');
  expect(screen.getByRole('tooltip')).toHaveTextContent('Since previous +2');
});

it('shows losses without labelling them as gained stars', () => {
  render(<SvgTrend {...history} y={[1000, 990, 980, 970]} locale='en' />);
  expect(screen.getByText('-30')).toBeVisible();
  expect(screen.getByText('(-3%)')).toBeVisible();
  fireEvent.focus(screen.getByRole('slider'));
  expect(screen.getByRole('tooltip')).toHaveTextContent('Since previous -10');
  expect(screen.getByText('View data').closest('details')).toContainElement(
    screen.getByText('Change')
  );
});

it('snaps the full chart hit area to the nearest date and clears on leave', () => {
  render(<SvgTrend {...history} locale='en' />);
  const chart = screen.getByRole('slider');
  jest
    .spyOn(chart, 'getBoundingClientRect')
    .mockReturnValue({ left: 10, width: 640 } as DOMRect);
  // jsdom does not provide PointerEvent coordinates; dispatch an equivalent mouse event.
  fireEvent(
    chart,
    new MouseEvent('pointermove', { bubbles: true, clientX: 650 })
  );
  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-10-04');
  fireEvent(
    chart,
    new MouseEvent('pointerdown', { bubbles: true, clientX: 10 })
  );
  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-10-01');
  fireEvent.focus(chart);
  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-10-01');
  const touchLeave = new MouseEvent('pointerout', { bubbles: true });
  Object.defineProperty(touchLeave, 'pointerType', { value: 'touch' });
  fireEvent(chart, touchLeave);
  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-10-01');
  fireEvent.pointerLeave(chart);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});
