import { useLoginContext } from '@/hooks/useLoginContext';

const LogoutButton = () => {
  const { logout } = useLoginContext();

  return (
    <button onClick={logout}>
      <span className='inline-flex items-center rounded-lg px-3 py-2'>
        退出
      </span>
    </button>
  );
};

export default LogoutButton;
