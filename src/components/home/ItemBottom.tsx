import { NextPage } from 'next';

interface Props {
  endText: string;
}

const ItemBottom: NextPage<Props> = ({ endText }) => {
  return (
    <>
      <div className='mt-4 flex flex-col items-center border-none text-base text-gray-400'>
        <p className='mb-4'>- {endText} -</p>
      </div>
    </>
  );
};

export default ItemBottom;
