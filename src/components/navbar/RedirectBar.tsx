interface Props {
  text?: string;
  target?: string;
}

const RedirectBar = ({ text = '跳转中...', target }: Props) => {
  return (
    <div className='bg-white dark:bg-gray-800 dark:text-gray-300 md:rounded-lg'>
      <div className='m-2'>
        <div className='flex py-3 px-4'>{text}</div>
        {target != '/' && (
          <div className='flex px-4 pb-3 text-gray-500'>
            {target}{' '}
            <a className='ml-3' target='_blank' href={target} rel='noreferrer'>
              ⚠️卡住就手动点这里⚠️
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedirectBar;
