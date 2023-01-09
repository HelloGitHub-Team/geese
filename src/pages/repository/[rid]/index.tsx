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

import { Repository } from '@/types/reppsitory';
import Score from '@/components/respository/Score';

interface Props {
  repo: Repository;
}

const RepositoryPage: NextPage<Props> = ({ repo }) => {
  return (
    <>
      <Seo title={`开源项目 ${repo.name} 详情`} />

      <RepoDetailNavbar
        avatar={repo.share_user.avatar}
        uid={repo.share_user.uid}
      />

      <div className='mt-2 bg-white px-2 pb-10 pt-2 dark:bg-gray-800 md:rounded-t-lg'>
        <div className='flex flex-col'>
          <div className='flex flex-row'>
            <div className=' bg-blue-50 '>
              <a className='flex items-center'>
                <img
                  className='rounded-sm'
                  src='https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEK6Whg0ZPBnfj6ay705PsibyqAibW1JIH3xXFjtIoTfficqtySAQuXPNf8D1eqwoY8OzMC8MJy2NFeibg/132'
                  width='72'
                  height='72'
                  alt='repo_avatar'
                />
              </a>
            </div>
            <div className='flex flex-1 justify-end bg-blue-200'>
              {/* <Score repo={repo}></Score> */}
              #1
            </div>
          </div>
          <div className='flex flex-row gap-x-6 '></div>
        </div>
        {/* <Info repo={repo}></Info> */}
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
        <MoreInfo repo={repo} />
      </div>
      <ButtonGroup repo={repo} />
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
