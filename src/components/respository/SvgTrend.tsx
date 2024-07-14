import { StarHistory } from '@/types/repository';

const SvgTrend = (props: StarHistory) => {
  const height = 54;
  const width = 320;
  const { max, min, x, y } = props;
  const scale = 0.8; // 缩放比例 避免贴边
  const indent = (height * (1 - scale)) / 2; //多出的空间给最小值和最大值
  const fillColor =
    max >= 100000
      ? '#f16d6d'
      : max >= 10000
      ? '#ecc052'
      : max >= 1000
      ? '#409eff'
      : '#67c23a';
  const xRange = 320 / (x.length > 1 ? x.length - 1 : 1);
  // 根据最大值和最小值差计算每个1的高度，后续最小值的y设置为0，最大值的y设置为height
  const heightRange = (scale * height) / (max - min);
  const points = y.map((stars, index) => {
    const x = index * xRange;
    // y轴摆正
    const y = height - (stars - min) * heightRange - indent;
    return `${x},${y}`;
  });
  // 画折线和折线加xy轴的多边形
  return (
    <svg width={width} height={height} key='render-svg'>
      <linearGradient id='my-filter'>
        `
        <stop offset='0%' stopColor={fillColor + '33'} />
        <stop offset='50%' stopColor={fillColor + '66'} />
        <stop offset='100%' stopColor={fillColor} />
      </linearGradient>
      <polyline
        points={points.join(' ')}
        fill='transparent'
        stroke={fillColor}
        strokeWidth='2'
      ></polyline>
      <polygon
        points={`${points.join(' ')} ${xRange * (x.length - 1)},${height} ${
          xRange * (x.length - 1)
        },${height} 0,${height}`}
        fill='url(#my-filter) transparent'
        stroke='none'
      ></polygon>
    </svg>
  );
};
export default SvgTrend;
