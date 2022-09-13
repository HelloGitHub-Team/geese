import { useLoginContext } from '@/hooks/useLoginContext';

import Button from '@/components/buttons/Button';

const LogoutButton = () => {
  const { logout } = useLoginContext();

  return (
    <Button
      className='font-normal text-gray-500'
      variant='ghost'
      onClick={logout}
    >
      退出
    </Button>
  );
};

export default LogoutButton;
