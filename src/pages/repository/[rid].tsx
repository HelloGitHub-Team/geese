import { GetServerSideProps, NextPage } from 'next';

import ImageWithPreview from '@/components/ImageWithPreview';
import RepoDetailNavbar from '@/components/navbar/RepoNavbar';
import ButtonGroup from '@/components/respository/ButtonGroup';
import CommentContainer from '@/components/respository/CommentContainer';
import Info from '@/components/respository/Info';
import MoreInfo from '@/components/respository/MoreInfo';
import Tabs from '@/components/respository/Tabs';
import Seo from '@/components/Seo';

import { getDetail } from '@/services/repository';

import { RepositoryProps } from '@/types/reppsitory';

const RepositoryPage: NextPage<RepositoryProps> = ({ repo }) => {
  return (
    <>
      <Seo title={`开源项目 ${repo.name} 详情`} />

      <RepoDetailNavbar
        avatar={repo.share_user.avatar}
        uid={repo.share_user.uid}
      />

      <div className='mt-2 rounded-t-lg bg-white px-2 pb-10 pt-2 dark:bg-slate-800'>
        <Info repo={repo}></Info>
        <Tabs repo={repo}></Tabs>
        {repo.image_url && (
          <div className='my-2 flex cursor-zoom-in justify-center'>
            <ImageWithPreview
              src={repo?.image_url}
              className='rounded-lg border border-slate-200'
              alt='图片'
            />
          </div>
        )}
        <MoreInfo repo={repo}></MoreInfo>
      </div>
      <ButtonGroup repo={repo} />
      <CommentContainer
        className='mt-2 rounded-lg bg-white dark:bg-slate-800'
        belong='repository'
        belongId={repo.rid}
      />
      <div className='h-36'></div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const rid = query?.rid as string;
  const data = await getDetail(rid);
  if (typeof data.rid === 'undefined') {
    return {
      notFound: true,
    };
  } else {
    return {
      props: { repo: data },
    };
  }
};

export default RepositoryPage;
