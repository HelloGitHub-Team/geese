import { NextPage } from 'next';

import { Periodical } from '@/components/periodical/Periodical';

import { getVolume, getVolumeNum } from '@/services/volume';

import { VolumePageProps } from '@/types/periodical';

const PeriodicalVolumePage: NextPage<VolumePageProps> = ({ volume }) => {
  return <Periodical volume={volume} />;
};

export default PeriodicalVolumePage;

// 此函数在构建时被调用
export async function getStaticPaths() {
  // 调用外部 API 获取月刊的总期数
  const { data } = await getVolumeNum();
  // const posts = data.map(({num}) => ({id: String(num) }));

  // 根据博文列表生成所有需要预渲染的路径
  const paths = data.map((item) => ({
    params: { id: String(item.num) },
  }));

  // We'll pre-render only these paths at build time.
  // {fallback: false } means other routes should 404.
  return { paths, fallback: true };
}

// 在构建时也会被调用
export async function getStaticProps({ params }: any) {
  // params 包含此篇博文的 `id` 信息。
  // 如果路由是 /posts/1，那么 params.id 就是 1
  const volume = await getVolume(params.id);
  if (!volume.success) {
    return { notFound: true };
  }
  // 通过 props 参数向页面传递博文的数据
  return { props: { volume }, revalidate: 3600 * 10 };
}
