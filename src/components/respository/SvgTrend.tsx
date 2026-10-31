import { PointerEvent, useId, useState } from 'react';

import { StarHistory } from '@/types/repository';

const WIDTH = 360;
const HEIGHT = 136;
const LEFT = 56;
const RIGHT = WIDTH - 12;
const TOP = 12;
const BOTTOM = HEIGHT - 28;

const SvgTrend = ({
  x: dates,
  y: values,
  locale = 'zh',
}: StarHistory & { locale?: string }) => {
  const id = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isEnglish = locale.startsWith('en');
  const label = isEnglish ? 'Star history' : 'Star 趋势';
  const instructions = isEnglish
    ? 'Use arrow keys to explore dates, Home and End for the first and last date, Escape to dismiss.'
    : '使用方向键查看日期，Home 和 End 跳至首尾，Escape 关闭提示。';
  const format = (value: number) => value.toLocaleString(locale);
  const signed = (value: number) => `${value > 0 ? '+' : ''}${format(value)}`;
  const weekdays: Record<string, string> = {
    周一: 'Mon',
    周二: 'Tue',
    周三: 'Wed',
    周四: 'Thu',
    周五: 'Fri',
    周六: 'Sat',
    周日: 'Sun',
  };
  const dateLabel = (date: string) =>
    isEnglish ? weekdays[date] || date : date;
  const minimum = values.length ? Math.min(...values) : 0;
  const maximum = values.length ? Math.max(...values) : 0;
  const rawStep = Math.max(maximum - minimum, 2) / 2;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step =
    [1, 2, 5, 10].find((factor) => factor * magnitude >= rawStep)! * magnitude;
  const lower = Math.max(
    0,
    Math.floor((minimum - (minimum === maximum ? step : 0)) / step) * step
  );
  const upper = Math.max(
    lower + step,
    Math.ceil((maximum + (minimum === maximum ? step : 0)) / step) * step
  );
  const ticks = Array.from(
    { length: Math.round((upper - lower) / step) + 1 },
    (_, index) => lower + index * step
  );
  const yPosition = (value: number) =>
    BOTTOM - ((value - lower) / (upper - lower)) * (BOTTOM - TOP);
  const points = values.map((value, index) => ({
    x:
      values.length === 1
        ? (LEFT + RIGHT) / 2
        : LEFT + ((RIGHT - LEFT) * index) / (values.length - 1),
    y: yPosition(value),
  }));
  const change = values.length > 1 ? values[values.length - 1] - values[0] : 0;
  const percent = values[0] > 0 ? (change / values[0]) * 100 : null;

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
    const width = (point.x - previous.x) / 3;
    return `${path} C ${previous.x + width} ${previous.y + width * tangents[index - 1]}, ${point.x - width} ${point.y - width * tangents[index]}, ${point.x} ${point.y}`;
  }, '');
  const index =
    activeIndex === null || !points.length
      ? null
      : Math.max(0, Math.min(activeIndex, points.length - 1));
  const active = index === null ? null : points[index];
  const selected = index ?? points.length - 1;
  const previousChange =
    index !== null && index > 0 ? values[index] - values[index - 1] : null;
  const selectPoint = (event: PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = ((event.clientX - bounds.left) / bounds.width) * WIDTH;
    setActiveIndex(
      Math.max(
        0,
        Math.min(
          points.length - 1,
          Math.round(((position - LEFT) / (RIGHT - LEFT)) * (points.length - 1))
        )
      )
    );
  };

  return (
    <section className='w-full min-w-0' aria-label={label}>
      <div className='mb-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1'>
        <h2 className='text-xs font-medium text-gray-600 dark:text-gray-300'>
          {label}
        </h2>
        {values.length > 1 && (
          <p className='flex items-baseline gap-1.5 text-xs text-gray-500 dark:text-gray-400'>
            <span>{isEnglish ? 'Net change' : '本期净增'}</span>
            <strong className='text-base font-semibold text-gray-900 dark:text-gray-100'>
              {signed(change)}
            </strong>
            {percent !== null && (
              <span>
                ({percent > 0 ? '+' : ''}
                {percent.toLocaleString(locale, { maximumFractionDigits: 2 })}%)
              </span>
            )}
          </p>
        )}
      </div>
      <div className='relative'>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className='block w-full touch-pan-y rounded text-blue-500 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-blue-500 dark:focus-visible:ring-offset-gray-800 forced-colors:text-[CanvasText]'
          role={points.length ? 'slider' : 'img'}
          aria-label={label}
          aria-describedby={`${id}-instructions`}
          aria-valuemin={points.length ? 0 : undefined}
          aria-valuemax={points.length ? points.length - 1 : undefined}
          aria-valuenow={points.length ? selected : undefined}
          aria-valuetext={
            points.length
              ? `${dateLabel(dates[selected])} · Star: ${format(values[selected])}`
              : undefined
          }
          tabIndex={points.length ? 0 : undefined}
          onPointerDown={selectPoint}
          onPointerMove={selectPoint}
          onPointerLeave={(event) => {
            if (event.pointerType !== 'touch') setActiveIndex(null);
          }}
          onPointerCancel={() => setActiveIndex(null)}
          onFocus={() =>
            setActiveIndex((current) => current ?? points.length - 1)
          }
          onBlur={() => setActiveIndex(null)}
          onKeyDown={(event) => {
            const keys: Record<string, number | null> = {
              ArrowLeft: Math.max(0, selected - 1),
              ArrowDown: Math.max(0, selected - 1),
              ArrowRight: Math.min(points.length - 1, selected + 1),
              ArrowUp: Math.min(points.length - 1, selected + 1),
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
          <title>{label}</title>
          <defs>
            <linearGradient id={`${id}-fill`} x1='0' x2='0' y1='0' y2='1'>
              <stop offset='0%' stopColor='currentColor' stopOpacity='0.15' />
              <stop offset='100%' stopColor='currentColor' stopOpacity='0.01' />
            </linearGradient>
          </defs>
          {points.length > 0 &&
            ticks.map((tick) => (
              <g key={tick} aria-hidden='true'>
                <line
                  x1={LEFT}
                  x2={RIGHT}
                  y1={yPosition(tick)}
                  y2={yPosition(tick)}
                  className='stroke-gray-100 dark:stroke-gray-700/60'
                />
                <text
                  x={LEFT - 8}
                  y={yPosition(tick)}
                  dy='0.35em'
                  textAnchor='end'
                  className='fill-gray-500 text-[10px] tabular-nums dark:fill-gray-400'
                >
                  {format(tick)}
                </text>
              </g>
            ))}
          {points.length > 1 && (
            <path
              d={`${line} L ${points[points.length - 1].x} ${BOTTOM} L ${points[0].x} ${BOTTOM} Z`}
              fill={`url(#${id}-fill)`}
              className='forced-colors:hidden'
            />
          )}
          <path
            d={line}
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            vectorEffect='non-scaling-stroke'
          />
          {points.length > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r='4'
              fill='currentColor'
              strokeWidth='2'
              className='stroke-white dark:stroke-gray-800'
            />
          )}
          {points.map(
            (point, pointIndex) =>
              (points.length <= 7 ||
                pointIndex === 0 ||
                pointIndex === points.length - 1) && (
                <text
                  key={pointIndex}
                  x={point.x}
                  y={HEIGHT - 5}
                  textAnchor={
                    pointIndex === 0
                      ? 'start'
                      : pointIndex === points.length - 1
                        ? 'end'
                        : 'middle'
                  }
                  className='fill-gray-500 text-[10px] dark:fill-gray-400'
                  aria-hidden='true'
                >
                  {dateLabel(dates[pointIndex]).replace(/^\d{4}-/, '')}
                </text>
              )
          )}
          {active && (
            <g pointerEvents='none'>
              <line
                x1={active.x}
                x2={active.x}
                y1={TOP}
                y2={BOTTOM}
                className='stroke-gray-400 dark:stroke-gray-500'
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
          {!points.length && (
            <text
              x={WIDTH / 2}
              y={HEIGHT / 2}
              textAnchor='middle'
              className='fill-gray-500 text-xs dark:fill-gray-400'
            >
              {isEnglish ? 'No data' : '暂无数据'}
            </text>
          )}
        </svg>
        {active && index !== null && (
          <div
            role='tooltip'
            className='pointer-events-none absolute bottom-full z-20 mb-1 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs leading-5 text-gray-900 shadow-lg dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100'
            style={{
              left: `${(active.x / WIDTH) * 100}%`,
              transform: `translateX(${active.x < WIDTH / 3 ? '0' : active.x > (WIDTH * 2) / 3 ? '-100%' : '-50%'})`,
            }}
          >
            <div className='text-gray-500 dark:text-gray-400'>
              {dateLabel(dates[index])}
            </div>
            <div>
              Star:{' '}
              <strong className='font-semibold tabular-nums'>
                {format(values[index])}
              </strong>
            </div>
            {previousChange !== null && (
              <div className='text-gray-500 dark:text-gray-400'>
                {isEnglish ? 'Since previous' : '较上次'}{' '}
                <span className='font-medium text-gray-900 dark:text-gray-100'>
                  {signed(previousChange)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      <span id={`${id}-instructions`} className='sr-only'>
        {points.length ? instructions : isEnglish ? 'No data' : '暂无数据'}
      </span>
      {points.length > 0 && (
        <details className='mt-1 text-[11px] text-gray-500 dark:text-gray-400'>
          <summary className='w-fit cursor-pointer rounded hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:hover:text-gray-200'>
            {isEnglish ? 'View data' : '查看数据'}
          </summary>
          <table className='mt-2 w-full text-left text-xs tabular-nums'>
            <caption className='sr-only'>{label}</caption>
            <thead>
              <tr className='border-b border-gray-200 dark:border-gray-700'>
                <th className='py-1.5 font-medium'>
                  {isEnglish ? 'Date' : '日期'}
                </th>
                <th className='text-right font-medium'>Star</th>
                <th className='text-right font-medium'>
                  {isEnglish ? 'Change' : '增量'}
                </th>
              </tr>
            </thead>
            <tbody>
              {values.map((value, pointIndex) => (
                <tr
                  key={pointIndex}
                  className='border-b border-gray-100 last:border-0 dark:border-gray-700/50'
                >
                  <td className='py-1.5'>{dateLabel(dates[pointIndex])}</td>
                  <td className='text-right'>{format(value)}</td>
                  <td className='text-right'>
                    {pointIndex ? signed(value - values[pointIndex - 1]) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </section>
  );
};

export default SvgTrend;
