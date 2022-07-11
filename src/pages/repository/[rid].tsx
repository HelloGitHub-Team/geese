import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { getDetail } from '@/services/repository';

import { Repository } from '@/types/reppsitory';

type PageProps = {
  repo: Repository;
};

const Navbar = (props: PageProps) => {
  const router = useRouter();

  return (
    <div className='flex h-12 items-center justify-between'>
      <div className='cursor-pointer' onClick={() => router.back()}>
        arrow
      </div>
      项目详情
      <div className='flex items-center'>
        由
        <div className='m-1 flex items-center'>
          <Image
            className='rounded-full'
            src={props.repo.share_user.avatar}
            width={26}
            height={26}
            alt='头像'
          />
        </div>
        分享
      </div>
    </div>
  );
};

const RepositoryPage: NextPage<PageProps> = ({ repo }) => {
  console.log(repo);
  const router = useRouter();
  console.log(router);

  const { title, description } = repo;

  return (
    <>
      <Navbar repo={repo} />
      <h1>{title}</h1>
      <p>{description}</p>
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
