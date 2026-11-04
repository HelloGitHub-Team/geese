import { useId, useState } from 'react';

import { StarHistory } from '@/types/repository';

const WIDTH = 288;
const HEIGHT = 56;
const LEFT = 8;
const RIGHT = WIDTH - 8;
const TOP = 6;
const BOTTOM = HEIGHT - 6;

const SvgTrend = ({
  x: dates,
  y: values,
  locale = 'zh',
  summary,
}: StarHistory & { locale?: string; summary?: string }) => {
  const id = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isEnglish = locale === 'en';
  const label = isEnglish ? 'Star history' : 'Star 趋势';
  const instructions = isEnglish
    ? 'Use arrow keys to explore dates, Home and End for the first and last date, Escape to dismiss.'
    : '使用方向键查看日期，Home 和 End 跳至首尾，Escape 关闭提示。';
  const changes = values.slice(1).map((value, index) => value - values[index]);
  const min = Math.min(values[0] ?? 0, ...values);
  const max = Math.max(values[0] ?? 0, ...values);
  // Keep tiny changes modest instead of stretching a single star to full height.
  const range = Math.max(max - min, 10);
  const padding = (range - (max - min)) / 2;
  const points = values.map((value, index) => ({
    x:
      values.length === 1
        ? WIDTH / 2
        : LEFT + ((RIGHT - LEFT) * index) / (values.length - 1),
    y: BOTTOM - ((value - min + padding) / range) * (BOTTOM - TOP),
  }));
  // Monotone tangents soften joins while keeping each segment within its values.
  const slopes = points.slice(1).map((point, index) => {
    const previous = points[index];
    return (point.y - previous.y) / (point.x - previous.x);
  });
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0] ?? 0;
    if (index === points.length - 1) return slopes[index - 1] ?? 0;
    const before = slopes[index - 1];
    const after = slopes[index];
    return before * after <= 0 ? 0 : (2 * before * after) / (before + after);
  });
  const line = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const step = (point.x - previous.x) / 3;
    return `${path} C ${previous.x + step} ${previous.y + step * tangents[index - 1]}, ${point.x - step} ${point.y - step * tangents[index]}, ${point.x} ${point.y}`;
  }, '');
  const index =
    activeIndex === null || !points.length
      ? null
      : Math.max(0, Math.min(activeIndex, points.length - 1));
  const active = index === null ? null : points[index];
  const formatCount = (value: number) =>
    Math.abs(value) >= 1000
      ? `${Number((value / 1000).toFixed(1))}k`
      : value.toLocaleString(locale);
  const formatChange = (value: number) =>
    `${value > 0 ? '+' : ''}${value.toLocaleString(locale)}`;
  const selectedIndex = index ?? values.length - 1;
  const change = selectedIndex > 0 ? changes[selectedIndex - 1] : null;
  const valueText = points.length
    ? `${dates[selectedIndex]} · Star: ${values[selectedIndex].toLocaleString(locale)}${
        change === null
          ? ''
          : ` · ${isEnglish ? 'Daily change' : '较前日'}: ${formatChange(change)}`
      }`
    : '';

  return (
    <div className='relative w-72 max-w-full text-[#5470c6] dark:text-[#708bdd]'>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className='block h-14 w-full touch-pan-y rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800'
        role={points.length ? 'slider' : 'img'}
        aria-label={label}
        aria-describedby={`${id}-instructions${summary ? ` ${id}-summary` : ''}`}
        aria-valuemin={points.length ? 0 : undefined}
        aria-valuemax={points.length ? points.length - 1 : undefined}
        aria-valuenow={points.length ? selectedIndex : undefined}
        aria-valuetext={points.length ? valueText : undefined}
        tabIndex={points.length ? 0 : undefined}
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const position =
            ((event.clientX - bounds.left) / bounds.width) * WIDTH;
          setActiveIndex(
            Math.max(
              0,
              Math.min(
                points.length - 1,
                Math.round(
                  ((position - LEFT) / (RIGHT - LEFT)) * (points.length - 1)
                )
              )
            )
          );
        }}
        onPointerLeave={() => setActiveIndex(null)}
        onPointerCancel={() => setActiveIndex(null)}
        onFocus={() => setActiveIndex(points.length - 1)}
        onBlur={() => setActiveIndex(null)}
        onKeyDown={(event) => {
          const current = index ?? points.length - 1;
          const keys: Record<string, number | null> = {
            ArrowLeft: Math.max(0, current - 1),
            ArrowDown: Math.max(0, current - 1),
            ArrowRight: Math.min(points.length - 1, current + 1),
            ArrowUp: Math.min(points.length - 1, current + 1),
            Home: 0,
            End: points.length - 1,
            Escape: null,
          };
          if (event.key in keys) {
            event.preventDefault();
            setActiveIndex(keys[event.key]);
          }
        }}
      >
        {points.length > 1 && (
          <path
            d={`${line} L ${points[points.length - 1].x} ${BOTTOM} L ${points[0].x} ${BOTTOM} Z`}
            fill='currentColor'
            fillOpacity='0.08'
          />
        )}
        <path
          d={line}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        {points.length === 1 && (
          <circle
            cx={points[0].x}
            cy={points[0].y}
            r='4'
            fill='currentColor'
            strokeWidth='2'
            className='stroke-white dark:stroke-gray-800'
          />
        )}
        {active && (
          <g pointerEvents='none'>
            <line
              x1={active.x}
              x2={active.x}
              y1={TOP}
              y2={BOTTOM}
              stroke='currentColor'
              strokeOpacity='0.2'
            />
            <circle
              cx={active.x}
              cy={active.y}
              r='4'
              fill='currentColor'
              strokeWidth='2'
              className='stroke-white dark:stroke-gray-800'
            />
          </g>
        )}
      </svg>
      {summary && (
        <div
          id={`${id}-summary`}
          className='mt-1 whitespace-nowrap text-center text-xs leading-4 text-gray-500 dark:text-gray-400'
        >
          {summary}
        </div>
      )}
      {active && index !== null && (
        <div
          role='tooltip'
          className='pointer-events-none absolute bottom-full z-20 mb-1 whitespace-nowrap rounded-md border border-gray-200/80 bg-white/95 px-2.5 py-1.5 text-xs leading-4 text-gray-700 shadow-md backdrop-blur-sm dark:border-gray-600/80 dark:bg-gray-900/95 dark:text-gray-100'
          style={{
            left: `${(active.x / WIDTH) * 100}%`,
            transform: `translateX(${active.x < WIDTH / 3 ? '0' : active.x > (WIDTH * 2) / 3 ? '-100%' : '-50%'})`,
          }}
        >
          <div className='text-[11px] text-gray-500 dark:text-gray-400'>
            {dates[index]}
          </div>
          <div className='flex items-baseline gap-1.5'>
            <strong className='text-sm font-semibold tabular-nums text-gray-900 dark:text-white'>
              {formatCount(values[index])}
              {change !== null && (
                <sup
                  aria-label={`${isEnglish ? 'Daily change' : '较前日'}: ${formatChange(change)}`}
                  className={`ml-0.5 text-[9px] font-medium ${change > 0 ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {change > 0 ? '+' : ''}
                  {formatCount(change)}
                </sup>
              )}
            </strong>
            <span className='text-gray-500 dark:text-gray-400'>Star</span>
          </div>
        </div>
      )}
      <span id={`${id}-instructions`} className='sr-only'>
        {points.length ? instructions : isEnglish ? 'No data' : '暂无数据'}
      </span>
      <table className='sr-only'>
        <caption>{label}</caption>
        <thead>
          <tr>
            <th>{isEnglish ? 'Date' : '日期'}</th>
            <th>Star</th>
            <th>{isEnglish ? 'Daily change' : '较前日'}</th>
          </tr>
        </thead>
        <tbody>
          {values.map((total, sampleIndex) => (
            <tr key={sampleIndex}>
              <td>{dates[sampleIndex]}</td>
              <td>{total.toLocaleString(locale)}</td>
              <td>
                {sampleIndex === 0
                  ? '—'
                  : formatChange(changes[sampleIndex - 1])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SvgTrend;
