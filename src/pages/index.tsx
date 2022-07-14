import { Button } from 'antd';
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
    console.log(Message);
    Message.success('Success!!!');
  };
  return (
    <>
      <Seo templateTitle='Home' />
      <Seo />
      <div>
        <Button type='primary' onClick={showMessage}>
          Message
        </Button>
      </div>
      <Items></Items>
    </>
  );
};

export default Index;
