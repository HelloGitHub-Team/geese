import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AiOutlineArrowLeft } from 'react-icons/ai';

import TagItem from '@/components/links/TagItem';

import { getDetail } from '@/services/repository';
import { format } from '@/utils/day';

import { Repository } from '@/types/reppsitory';

type PageProps = {
  repo: Repository;
};

const Navbar = (props: PageProps) => {
  const router = useRouter();

  return (
    <div className='flex h-[52px] items-center justify-between'>
      <div className='flex-1 cursor-pointer py-4 pr-4' onClick={router.back}>
        <AiOutlineArrowLeft size={20} color='#60a5fa' />
      </div>
      <strong className='flex-1 text-center'>项目详情</strong>
      <div className='flex flex-1 items-center justify-end text-xs'>
        由
        <div className='m-1 flex items-center'>
          <Image
            className='rounded-full'
            src={props.repo.share_user.avatar}
            width={24}
            height={24}
            alt='头像'
          />
        </div>
        分享
      </div>
    </div>
  );
};

const Author = (props: PageProps) => {
  const author = props.repo.author;
  const createdAt = props.repo.created_at;

  return (
    <div className='mt-2 flex items-center'>
      <span className='text-xs'>作者：</span>
      <span className='text-xs'>{author}</span>
      <span className='mx-2 inline-block h-3 w-[1px] bg-[#ccc]'></span>
      <span className='text-xs'>{format(createdAt)}</span>
    </div>
  );
};

const Tags = (props: PageProps) => {
  const tags = props.repo.tags;

  return (
    <div className='flex py-4'>
      {tags.map((item) => (
        <TagItem name={item.name} tid={item.tid} key={item.tid} />
      ))}
    </div>
  );
};

// 评分
const Score = (props: PageProps & { className?: string }) => {
  const className = props.className || '';

  return (
    <div className={`w-32 overflow-hidden rounded-lg border ${className}`}>
      <div className='bg-gray-600 py-2 text-center text-gray-100'>
        <div className='text-xs'>HG 评分</div>
        <div className='text-xl font-bold'>推荐</div>
      </div>
      <div className='py-2 text-center text-gray-600'>
        <div className='font-bold'>推荐占比 80%</div>
        <div className='font-bold'>50 个推荐</div>
      </div>
    </div>
  );
};

const Title = (props: PageProps) => {
  const { title, name, volume_name } = props.repo;

  return (
    <h1 className='text-xl'>
      {`${name}：${title}`}
      <span className='ml-1 text-xs'>vol.{volume_name}</span>
    </h1>
  );
};

const RepositoryPage: NextPage<PageProps> = ({ repo }) => {
  console.log(repo);
  const router = useRouter();
  console.log(router);

  const { title, description, name, volume_name } = repo;

  return (
    <>
      <Navbar repo={repo} />
      <div className='rounded-lg bg-white px-4 py-3'>
        <div className='flex items-start justify-between gap-[5%]'>
          <div>
            <Title repo={repo} />
            <p className='mt-2 text-sm text-[#94a3b8]'>{description}</p>
            <Author repo={repo} />
          </div>
          <Score className='hidden shrink-0 sm:block' repo={repo} />
        </div>
        <Tags repo={repo} />
      </div>
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
