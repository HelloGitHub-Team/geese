import { GetServerSideProps, NextPage } from 'next';

import ImageWithPreview from '@/components/ImageWithPreview';
import ButtonGroup from '@/components/respository/ButtonGroup';
import CommentSubmit from '@/components/respository/CommentSubmit';
import Info from '@/components/respository/Info';
import MoreInfo from '@/components/respository/MoreInfo';
import Navbar from '@/components/respository/Navbar';
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
        <div className='w-full p-2 text-base leading-7 lg:text-lg'>
          <p className='text-gray-900 line-clamp-4'>{repo.summary}</p>
        </div>
        {repo.image_url ? (
          <div className='my-2 flex justify-center'>
            <ImageWithPreview
              src={repo?.image_url}
              className='rounded-lg'
              alt='图片'
            />
          </div>
        ) : (
          <div></div>
        )}
        <MoreInfo repo={repo}></MoreInfo>
      </div>
      <ButtonGroup repo={repo} />
      <CommentSubmit />
      <div className='h-80'></div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const rid = query?.rid as string;
  const data = await getDetail(rid);
  console.log(data);
  return {
    props: { repo: data },
  };
};

export default RepositoryPage;
