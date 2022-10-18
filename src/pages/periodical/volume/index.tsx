import { NextPage } from 'next';

import Periodical from '@/components/periodical/Periodical';

import { getVolume } from '@/services/volume';

import { VolumePageProps } from '@/types/periodical';

const PeriodicalVolumeIndexPage: NextPage<VolumePageProps> = ({ volume }) => {
  return <Periodical volume={volume} />;
};

export default PeriodicalVolumeIndexPage;

// 在构建时也会被调用
export async function getStaticProps() {
  const volume = await getVolume();
  if (!volume.success) {
    return { notFound: true };
  }
  // 通过 props 参数向页面传递博文的数据
  return { props: { volume }, revalidate: 3600 * 10 };
}
