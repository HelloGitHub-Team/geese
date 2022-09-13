import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';

const LoginButton = () => {
  const { login } = useLoginContext();

  return (
    <Button
      className='font-normal text-gray-500'
      variant='ghost'
      onClick={login}
    >
      登录
    </Button>
  );
};
export default LoginButton;
