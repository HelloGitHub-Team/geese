import { StarHistory } from '@/types/repository';

const SvgTrend = (props: StarHistory) => {
  const height = 54;
  const width = 320;
  const { max, min, x, y } = props;
  const scale = 0.8; // 缩放比例 避免贴边
  const indent = (height * (1 - scale)) / 2; //多出的空间给最小值和最大值
  const rectIndent = indent / 2;

  const fillColor = '#5470c6';
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
      <polyline
        points={points.join(' ')}
        fill='transparent'
        stroke={fillColor}
        strokeWidth='5'
      ></polyline>
      <polygon
        points={`${points.join(' ')} ${xRange * (x.length - 1)},${
          height - rectIndent
        } ${xRange * (x.length - 1)},${height - rectIndent} 0,${
          height - rectIndent
        }`}
        fill='#e3edfd'
        stroke='none'
      ></polygon>
    </svg>
  );
};
export default SvgTrend;
