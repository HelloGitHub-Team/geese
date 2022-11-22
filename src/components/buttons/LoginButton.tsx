import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';

const LoginButton = () => {
  const { login } = useLoginContext();

  return (
    <Button
      id='loginBtn'
      className='font-normal text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
      style={{ minWidth: 50 }}
      variant='ghost'
      onClick={login}
    >
      登录
    </Button>
  );
};
export default LoginButton;
