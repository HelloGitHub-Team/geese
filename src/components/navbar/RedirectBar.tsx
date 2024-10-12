interface Props {
  text?: string;
  target?: string;
  i18n_lang?: string;
}

const RedirectBar = ({ text = '跳转中...', target, i18n_lang }: Props) => {
  return (
    <div className='bg-white dark:bg-gray-800 dark:text-gray-300 md:rounded-lg'>
      <div className='m-2'>
        <div className='flex py-3 px-4'>{text}</div>
        {target != '/' && (
          <div className='flex px-4 pb-3 text-gray-500'>
            {target}
            <a className='ml-3' href={target}>
              {i18n_lang == 'en'
                ? "Click here if you're stuck"
                : '⚠️卡住就手动点这里⚠️'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedirectBar;
