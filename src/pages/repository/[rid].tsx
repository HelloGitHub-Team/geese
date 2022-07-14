import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AiOutlineArrowLeft } from 'react-icons/ai';

import TagItem from '@/components/links/TagItem';

import { getDetail } from '@/services/repository';
import { format } from '@/utils/day';

import { Repository } from '@/types/reppsitory';
import { useState } from 'react';

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

const Desc = (props: PageProps) => {
  const { description } = props.repo;
  return <p className='mt-2 text-sm text-[#94a3b8]'>{description}</p>;
};

const RepoInfo = (props: PageProps) => {
  const [isShowMore, setIsShowMore] = useState(false);

  const list = [
    {
      title: '星数',
      value: props.repo.stars_str,
    },
    {
      title: '中文',
      value: props.repo.has_chinese ? '是' : '否',
    },
    {
      title: '代码',
      value: props.repo.primary_lang,
    },
    {
      title: '活跃',
      value: props.repo.is_active ? '是' : '否',
    },
    {
      title: '许可',
      value: props.repo.license || '无',
    },
    {
      title: 'Forks',
      value: props.repo.forks || '无',
    },
    {
      title: 'Issues',
      value: props.repo.open_issues,
    },
    {
      title: '订阅数',
      value: props.repo.subscribers,
    },
  ];

  return (
    <div className='relative'>
      <div
        className={`relative overflow-hidden rounded-lg ${
          isShowMore ? '' : 'h-[76px]'
        }`}
      >
        <div className='relative grid grid-cols-4 grid-rows-1 gap-3 rounded-lg bg-gray-100 py-3 text-center sm:grid-cols-5'>
          {list.map((item) => (
            <div key={item.title}>
              <div className='text-gray-600'>{item.title}</div>
              <div className='mt-1 overflow-hidden overflow-ellipsis text-lg font-bold text-gray-900'>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        hidden={isShowMore}
        className='absolute right-5 bottom-[-1px] translate-y-full cursor-pointer rounded-b-lg bg-gray-100 px-4 py-1 text-xs text-gray-600 hover:bg-gray-200 active:bg-gray-100'
        onClick={() => setIsShowMore(true)}
      >
        更多
      </div>
    </div>
  );
};

const RepositoryPage: NextPage<PageProps> = ({ repo }) => {
  console.log(repo);
  const router = useRouter();
  console.log(router);

  return (
    <>
      <Navbar repo={repo} />
      <div className='rounded-lg bg-white px-4 py-3'>
        <div className='flex items-start justify-between gap-[5%]'>
          <div>
            <Title repo={repo} />
            <Desc repo={repo} />
            <Author repo={repo} />
          </div>
          <Score className='hidden shrink-0 sm:block' repo={repo} />
        </div>
        <Tags repo={repo} />
        <RepoInfo repo={repo} />
        <div className='h-20'></div>
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
