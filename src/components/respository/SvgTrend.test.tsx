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
    if (y.length) {
      const chart = screen.getByRole('slider', { name: 'Star 趋势' });
      expect(chart).toHaveAttribute('aria-valuemax', String(y.length - 1));
      fireEvent.focus(chart);
      expect(screen.getByRole('tooltip')).toHaveTextContent(x[x.length - 1]);
      expect(chart).toHaveAttribute(
        'aria-valuetext',
        `${x[x.length - 1]} · Star: ${y[y.length - 1].toLocaleString('zh')}${y.length > 1 ? ' · 较前日: 0' : ''}`
      );
    } else {
      expect(
        screen.getByRole('img', { name: 'Star 趋势' })
      ).toBeInTheDocument();
      expect(screen.getByText('暂无数据')).toBeInTheDocument();
      expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    }
    expect(container.firstElementChild).toHaveClass('w-72');
    expect(container.querySelector('svg')).toHaveClass('h-14');
    if (y.length === 1)
      expect(container.querySelector('circle')).toBeInTheDocument();
  }
);

it('keeps a one-star change small while preserving the actual trend', () => {
  const { container } = render(
    <SvgTrend
      {...history}
      y={[100000, 100001, 100001, 100001]}
      min={0}
      max={100001}
      summary='过去 4 天共收获 1 颗 Star ✨'
    />
  );
  const path = container.querySelector('path[fill="none"]')!.getAttribute('d')!;
  const heights = Array.from(
    path.matchAll(/[MC] ([^MC]+)/g),
    ([, coordinates]) => Number(coordinates.trim().split(/[ ,]+/).at(-1))
  );
  expect(heights).toHaveLength(4);
  expect(heights[0] - heights[1]).toBeGreaterThan(0);
  expect(heights[0] - heights[1]).toBeLessThan(10);
  expect(heights[1]).toBe(heights[2]);
  expect(heights[1]).toBe(heights[3]);
  expect(Math.max(...heights)).toBeLessThan(48);
  expect(
    screen.getByText('过去 4 天共收获 1 颗 Star ✨').previousElementSibling
  ).toBe(screen.getByRole('slider'));
  expect(container.querySelector('svg text')).not.toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
  fireEvent.focus(screen.getByRole('slider'));
  fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowLeft' });
  expect(screen.getByRole('tooltip')).toHaveTextContent('100k');
});

it.each([{ y: [741, 769, 777, 779] }, { y: [741, 741, 741, 779] }])(
  'keeps the complete summary below the plot regardless of trend',
  ({ y }) => {
    const summary = '过去 4 天共收获 38 颗 Star ✨';
    const { container } = render(
      <SvgTrend {...history} y={y} summary={summary} />
    );
    const caption = screen.getByText(summary);
    expect(caption).not.toHaveClass('absolute');
    expect(caption.previousElementSibling).toBe(screen.getByRole('slider'));
    expect(screen.getByRole('slider')).toHaveAccessibleDescription(
      expect.stringContaining(summary)
    );
    const path = container
      .querySelector('path[fill="none"]')!
      .getAttribute('d')!;
    const heights = Array.from(
      path.matchAll(/[MC] ([^MC]+)/g),
      ([, coordinates]) => Number(coordinates.trim().split(/[ ,]+/).at(-1))
    );
    expect(Math.max(...heights) - Math.min(...heights)).toBeGreaterThan(40);
  }
);

it('smooths rising, flat and falling segments without inventing peaks or dips', () => {
  const y = [1000, 1001, 1020, 1020, 1010, 1011];
  const { container } = render(
    <SvgTrend {...history} x={y.map((_, index) => `Day ${index + 1}`)} y={y} />
  );
  const path = container.querySelector('path[fill="none"]')!.getAttribute('d')!;
  const commands = Array.from(
    path.matchAll(/[MC] ([^MC]+)/g),
    ([, coordinates]) => coordinates.trim().split(/[ ,]+/).map(Number)
  );
  expect(commands).toHaveLength(y.length);
  expect(path.match(/C/g)).toHaveLength(y.length - 1);
  let start = commands[0][1];
  for (const [, control1, , control2, , end] of commands.slice(1)) {
    let previous = start;
    for (let sample = 1; sample <= 20; sample++) {
      const t = sample / 20;
      const height =
        (1 - t) ** 3 * start +
        3 * (1 - t) ** 2 * t * control1 +
        3 * (1 - t) * t ** 2 * control2 +
        t ** 3 * end;
      expect(height).toBeGreaterThanOrEqual(Math.min(start, end) - 1e-8);
      expect(height).toBeLessThanOrEqual(Math.max(start, end) + 1e-8);
      expect((height - previous) * (end - start)).toBeGreaterThanOrEqual(-1e-8);
      previous = height;
    }
    start = end;
  }
});

it('shows compact signed daily changes as a small superscript without daily bars', () => {
  const { container } = render(
    <SvgTrend
      {...history}
      y={[100000, 102000, 102000, 101000]}
      min={100000}
      max={102000}
      increment={1000}
      locale='en'
    />
  );
  expect(container.querySelector('rect')).not.toBeInTheDocument();
  const chart = screen.getByRole('slider', { name: 'Star history' });
  fireEvent.focus(chart);
  expect(screen.getByRole('tooltip').querySelector('strong')).toHaveTextContent(
    '101k'
  );
  expect(screen.getByLabelText('Daily change: -1,000')).toHaveTextContent(
    '-1k'
  );
  expect(screen.getByLabelText('Daily change: -1,000').tagName).toBe('SUP');
  expect(screen.getByRole('tooltip')).not.toHaveTextContent('Daily change');
  fireEvent.keyDown(chart, { key: 'Home' });
  expect(
    screen.getByRole('tooltip').querySelector('sup')
  ).not.toBeInTheDocument();
  fireEvent.keyDown(chart, { key: 'ArrowRight' });
  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-10-02');
  expect(screen.getByLabelText('Daily change: +2,000')).toHaveTextContent(
    '+2k'
  );
  fireEvent.keyDown(chart, { key: 'ArrowRight' });
  expect(screen.getByLabelText('Daily change: 0')).toHaveTextContent('0');
});

it('supports keyboard exploration, exact counts, dismissal and shorter data updates', () => {
  const { rerender } = render(<SvgTrend {...history} locale='en' />);
  const chart = screen.getByRole('slider', { name: 'Star history' });
  fireEvent.focus(chart);
  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-10-04');
  expect(screen.getByRole('tooltip')).toHaveClass('rounded-md', 'shadow-md');
  expect(chart).toHaveAttribute(
    'aria-valuetext',
    '2026-10-04 · Star: 1,010 · Daily change: -10'
  );
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
    new MouseEvent('pointermove', { bubbles: true, clientX: 10 })
  );
  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-10-01');
  fireEvent.pointerLeave(chart);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});
