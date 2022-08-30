import Status from './Status';
import UserStatus from './UserStatus';
import Footer from '../layout/Footer';

export default function IndexSide() {
  return (
    <div className='relative flex h-full flex-col items-stretch'>
      <div className='top-15 fixed w-3/12 xl:w-2/12'>
        <div className='mt-2 ml-3'>
          <div className='space-y-2'>
            <div className='rounded-lg bg-white pl-3 pr-3 pt-3 pb-2.5'>
              <UserStatus></UserStatus>
            </div>
            <Status />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
