interface Props {
  text?: string;
}

const RedirectBar = ({ text = '跳转中...' }: Props) => {
  return (
    <div className='rounded-lg bg-white dark:bg-gray-800 dark:text-slate-300'>
      <div className='m-2'>
        <div className='flex py-2.5 pl-4 pr-3'>{text}</div>
      </div>
    </div>
  );
};

export default RedirectBar;
