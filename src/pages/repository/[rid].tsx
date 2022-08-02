import { GetServerSideProps, NextPage } from 'next';

import ImageWithPreview from '@/components/ImageWithPreview';
import ButtonGroup from '@/components/respository/ButtonGroup';
import CommentContainer from '@/components/respository/CommentContainer';
import Info from '@/components/respository/Info';
import MoreInfo from '@/components/respository/MoreInfo';
import Navbar from '@/components/respository/Navbar';
import Tabs from '@/components/respository/Tabs';
import Seo from '@/components/Seo';

import { getDetail } from '@/services/repository';

import { RepositoryProps } from '@/types/reppsitory';

const RepositoryPage: NextPage<RepositoryProps> = ({ repo }) => {
  return (
    <>
      <Seo title={`开源项目 ${repo.name}`} />
      <Seo />
      <div className='mt-2 bg-white px-2 pb-10 pt-2'>
        <Navbar avatar={repo.share_user.avatar} />
        <Info repo={repo}></Info>
        {repo.image_url ? (
          <div className='my-2 flex justify-center'>
            <ImageWithPreview
              src={repo?.image_url}
              className='rounded-lg'
              alt='图片'
            />
          </div>
        ) : (
          <></>
        )}
        <Tabs repo={repo}></Tabs>
        <MoreInfo repo={repo}></MoreInfo>
      </div>
      <ButtonGroup repo={repo} />
      <CommentContainer className='mt-3 bg-white' belongId={repo.rid} />
      <div className='h-80'></div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const rid = query?.rid as string;
  const data = await getDetail(rid);
  return {
    props: { repo: data },
  };
};

export default RepositoryPage;
