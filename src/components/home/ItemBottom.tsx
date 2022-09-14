import { NextPage } from 'next';
import * as React from 'react';

interface Props {
  endText: string;
}

const ItemBottom: NextPage<Props> = ({ endText }) => {
  return (
    <>
      <div className='my-4 flex flex-col items-center text-base text-gray-400 '>
        <p>- {endText} -</p>
      </div>
    </>
  );
};

export default ItemBottom;
