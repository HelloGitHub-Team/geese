import Ad from '@/components/side/Ad';

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
            <Ad
              id='ucloud'
              image='https://img.hellogithub.com/ad/ucloud.png'
              url='https://www.ucloud.cn/site/active/kuaijiesale.html?utm_term=logo&utm_campaign=hellogithub&utm_source=otherdsp&utm_medium=display&ytag=logo_hellogithub_otherdsp_display#wulanchabu'
            />
            <Ad
              id='upyun'
              image='https://img.hellogithub.com/ad/upyun.png'
              url='https://www.upyun.com/'
            />
            <Status />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
