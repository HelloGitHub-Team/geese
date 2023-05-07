import { GetServerSideProps, NextPage } from 'next';

import RepoDetailNavbar from '@/components/navbar/RepoNavbar';
import CommentContainer from '@/components/respository/CommentContainer';
import Info from '@/components/respository/Info';
import Tabs from '@/components/respository/Tabs';
import Seo from '@/components/Seo';

import { getDetail } from '@/services/repository';

import { Repository } from '@/types/reppsitory';

interface Props {
  repo: Repository;
}

const RepositoryPage: NextPage<Props> = ({ repo }) => {
  return (
    <>
      <Seo
        title='HelloGitHub｜详情'
        description={`开源项目 ${repo.name} 的介绍`}
      />

      <RepoDetailNavbar
        avatar={repo.share_user.avatar}
        uid={repo.share_user.uid}
      />
      <div className='mt-2 bg-white px-2 pb-3 pt-2 dark:bg-gray-800 md:rounded-lg'>
        <Info repo={repo} />
        <Tabs repo={repo} />
      </div>
      <CommentContainer
        className='mt-2 bg-white dark:bg-gray-800 md:rounded-lg'
        belong='repository'
        belongId={repo.rid}
      />
      <div className='h-8 lg:h-36'></div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  let ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'] as string;
    ip = ip.split(',')[0] as string;
  } else if (req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'] as string;
  } else {
    ip = req.socket.remoteAddress as string;
  }

  const rid = query?.rid as string;
  const data = await getDetail(ip, rid);
  if (data.success) {
    return {
      props: {
        repo: data.data,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default RepositoryPage;
