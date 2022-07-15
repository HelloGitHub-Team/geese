import { NextPage } from 'next';

import Items from '@/components/layout/Items';
import Message from '@/components/message/message.service';
import Seo from '@/components/Seo';

import { HomeItemData } from '@/pages/api/home';

type IndexProps = {
  itemsData: HomeItemData;
  sortBy: string;
};

const Index: NextPage<IndexProps> = () => {
  const showMessage = () => {
    let cnt = 1;
    return () => {
      Message.success(`success - ${cnt}`, { autoClose: true });
      // Message.error(`error - ${cnt}`);
      // Message.info(`info - ${cnt}`);
      // Message.warn(`warn - ${cnt}`);
      cnt++;
    };
  };

  return (
    <>
      <Seo templateTitle='Home' />
      <Seo />
      <div>
        <button onClick={showMessage()}>Message</button>
      </div>
      <Items></Items>
    </>
  );
};

export default Index;
