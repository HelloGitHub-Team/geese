import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { getDetail } from '@/services/repository';
import { RepositoryProps } from '@/typing/reppsitory';

const RepositoryPage: NextPage<RepositoryProps> = ({ repo }) => {
  console.log(repo);
  const router = useRouter();
  console.log(router);

  const { title, description } = repo;

  return (
    <>
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
