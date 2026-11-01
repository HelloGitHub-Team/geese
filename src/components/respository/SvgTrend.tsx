import { useId, useState } from 'react';

import { StarHistory } from '@/types/repository';

const WIDTH = 320;
const HEIGHT = 54;
const LEFT = WIDTH * 0.02;
const RIGHT = WIDTH - LEFT;
const TOP = HEIGHT * 0.2;
const BOTTOM = HEIGHT * 0.9;

const SvgTrend = ({
  x: dates,
  y: values,
  min,
  max,
  increment,
  locale = 'zh',
}: StarHistory & { locale?: string }) => {
  const id = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isEnglish = locale === 'en';
  const label = isEnglish ? 'Star history' : 'Star 趋势';
  const instructions = isEnglish
    ? 'Use arrow keys to explore dates, Home and End for the first and last date, Escape to dismiss.'
    : '使用方向键查看日期，Home 和 End 跳至首尾，Escape 关闭提示。';
  const range = Math.max(max - min, increment > 10 ? 1 : 10);
  const points = values.map((value, index) => ({
    x:
      values.length === 1
        ? WIDTH / 2
        : LEFT + ((RIGHT - LEFT) * index) / (values.length - 1),
    y: BOTTOM - ((value - min) / range) * (BOTTOM - TOP),
  }));

  // Monotone cubic interpolation: smooth joins without inventing peaks or dips.
  const slopes = points
    .slice(1)
    .map(
      (point, index) =>
        (point.y - points[index].y) / (point.x - points[index].x)
    );
  const tangents = points.map((_, index) => {
    if (index === 0) return slopes[0] || 0;
    if (index === points.length - 1) return slopes[index - 1] || 0;
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
  const valueText =
    index === null
      ? ''
      : `${dates[index]} · Star: ${values[index].toLocaleString(locale)}`;

  return (
    <div className='relative h-[54px] w-[320px] max-w-full text-[#5470c6] dark:text-[#708bdd]'>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className='block h-full w-full touch-pan-y rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800'
        role={points.length ? 'slider' : 'img'}
        aria-label={label}
        aria-describedby={`${id}-instructions`}
        aria-valuemin={points.length ? 0 : undefined}
        aria-valuemax={points.length ? points.length - 1 : undefined}
        aria-valuenow={points.length ? (index ?? points.length - 1) : undefined}
        aria-valuetext={
          points.length
            ? valueText ||
              `${dates.at(-1)} · Star: ${values.at(-1)?.toLocaleString(locale)}`
            : undefined
        }
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
            fill='rgb(59 130 246 / 0.2)'
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
          <circle cx={points[0].x} cy={points[0].y} r='3' fill='currentColor' />
        )}
        {active && (
          <g pointerEvents='none'>
            <line
              x1={active.x}
              x2={active.x}
              y1={TOP}
              y2={BOTTOM}
              stroke='currentColor'
              strokeDasharray='2 2'
              strokeOpacity='0.22'
            />
            <circle
              cx={active.x}
              cy={active.y}
              r='7'
              fill='currentColor'
              opacity='0.16'
            />
            <circle
              cx={active.x}
              cy={active.y}
              r='3.5'
              fill='currentColor'
              strokeWidth='2'
              className='stroke-white dark:stroke-gray-800'
            />
          </g>
        )}
      </svg>
      {active && index !== null && (
        <div
          role='tooltip'
          className='pointer-events-none absolute bottom-full z-20 mb-1 whitespace-nowrap rounded-md border border-gray-200/80 bg-white/95 px-2.5 py-1.5 text-xs leading-4 text-gray-700 shadow-md backdrop-blur-sm transition-opacity dark:border-gray-600/80 dark:bg-gray-900/95 dark:text-gray-100'
          style={{
            left: `${(active.x / WIDTH) * 100}%`,
            transform: `translateX(${active.x < WIDTH / 3 ? '0' : active.x > (WIDTH * 2) / 3 ? '-100%' : '-50%'})`,
          }}
        >
          <div className='text-[11px] text-gray-500 dark:text-gray-400'>
            {dates[index]}
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='h-1.5 w-1.5 rounded-full bg-[#5470c6] dark:bg-[#708bdd]' />
            <strong className='font-semibold tabular-nums text-gray-900 dark:text-white'>
              {values[index].toLocaleString(locale)}
            </strong>
            <span className='text-gray-500 dark:text-gray-400'>Star</span>
          </div>
        </div>
      )}
      <span id={`${id}-instructions`} className='sr-only'>
        {points.length ? instructions : isEnglish ? 'No data' : '暂无数据'}
      </span>
    </div>
  );
};

export default SvgTrend;
