import { useRouter } from 'next/router';
import * as React from 'react';

import Repo from '@/components/repo';

import { CreateRepoRes } from '@/types/reppsitory';

export default function CreateRepo() {
  const router = useRouter();

  function handleResponse(res: CreateRepoRes) {
    if (res.success) {
      router.push('/');
    }
  }

  return (
    <section className='relative min-h-screen bg-white'>
      <Repo response={handleResponse} />
    </section>
  );
}
