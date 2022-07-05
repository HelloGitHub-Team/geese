import Footer from '@/components/layout/Footer';
import Items from '@/components/layout/Items';
import Status from '@/components/layout/Status';
import User from '@/components/layout/User';

function Home() {
  return (
    <main className='container mx-auto px-5 md:px-0 xl:px-40'>
      <div className='flex min-h-screen shrink grow flex-row sm:border-l sm:dark:border-slate-600 md:border-none'>
        <Items></Items>
        <div className='relative hidden w-3/12 shrink-0 md:block md:grow-0'>
          <div className='relative flex h-full flex-col items-stretch'>
            <div className='mt-2 ml-3'>
              <div className='space-y-2'>
                <User isLogin={true}></User>
                <Status></Status>
              </div>
              <Footer></Footer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
