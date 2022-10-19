import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';

import ImageWithPreview from '@/components/ImageWithPreview';
import RepoDetailNavbar from '@/components/navbar/RepoNavbar';
import ButtonGroup from '@/components/respository/ButtonGroup';
import CommentContainer from '@/components/respository/CommentContainer';
import Info from '@/components/respository/Info';
import MoreInfo from '@/components/respository/MoreInfo';
import Tabs from '@/components/respository/Tabs';
import Seo from '@/components/Seo';

import { getDetail } from '@/services/repository';

import { Repository } from '@/types/reppsitory';

interface Props {
  repo: Repository;
  user_agent: string;
}

const RepositoryPage: NextPage<Props> = ({ repo, user_agent }) => {
  const [inWechat, setInWechat] = useState<boolean>(false);

  useEffect(() => {
    // 微信内浏览器无法新开 tab
    if (user_agent.match(/MicroMessenger/i)) {
      setInWechat(true);
    }
  }, [setInWechat, user_agent]);

  return (
    <>
      <Seo title={`开源项目 ${repo.name} 详情`} />

      <RepoDetailNavbar
        avatar={repo.share_user.avatar}
        uid={repo.share_user.uid}
      />

      <div className='mt-2 bg-white px-2 pb-10 pt-2 dark:bg-gray-800 md:rounded-t-lg'>
        <Info repo={repo}></Info>
        <Tabs repo={repo}></Tabs>
        {repo.image_url && (
          <div className='my-2 flex cursor-zoom-in justify-center'>
            <ImageWithPreview
              src={repo?.image_url}
              className='rounded-lg border border-gray-200 dark:border-none'
              alt='图片'
            />
          </div>
        )}
        <MoreInfo repo={repo}></MoreInfo>
      </div>
      <ButtonGroup repo={repo} inWechat={inWechat} />
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
  const user_agent = req.headers['user-agent'] as string;

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
        user_agent: user_agent,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default RepositoryPage;
