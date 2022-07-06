import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { Repository } from '@/utils/types/repoType';

import { getDetail } from '../api/repository';

type PageProps = {
  repo: Repository;
};

const RepositoryPage: NextPage<PageProps> = ({ repo }) => {
  console.log(repo);
  const router = useRouter();
  console.log(router);

  const {
    query: { rid },
  } = router;

  const { title, description } = repo;

  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query: { rid },
}) => {
  const data = await getDetail(rid);
  console.log(data);
  return {
    props: { repo: data },
  };
};

export default RepositoryPage;
