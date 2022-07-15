import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import ImageWithPreview from '@/components/ImageWithPreview';
import Info from '@/components/respository/Info';
import MoreInfo from '@/components/respository/MoreInfo';
import Navbar from '@/components/respository/Navbar';

import { getDetail } from '@/services/repository';

import { RepositoryProps } from '@/types/reppsitory';

const RepositoryPage: NextPage<RepositoryProps> = ({ repo }) => {
  console.log(repo);
  const router = useRouter();
  console.log(router);

  return (
    <div className='mt-2 bg-white px-4 pt-2 pb-4'>
      <Navbar avatar={repo.share_user.avatar} />
      <Info repo={repo}></Info>
      <div className='w-full p-2 text-base leading-7 lg:text-lg'>
        <p className='line-clamp-4 '>{repo.summary}</p>
      </div>
      {repo.image_url ? (
        <div className='mx-auto mt-2 flex overflow-hidden rounded-lg'>
          <ImageWithPreview src={repo?.image_url} alt='图片' />
        </div>
      ) : (
        <div></div>
      )}
      <MoreInfo repo={repo}></MoreInfo>
    </div>
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
