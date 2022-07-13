import { LoginOutProps } from '@/types/user';

const LoginOutButton = ({ updateLoginStatus }: LoginOutProps) => {
  const handleLoginOut = async () => {
    try {
      // const token = localStorage.getItem('Authorization');
      // const result: any = await LoginOut({ Authorization: `Bearer ${token}` });
      localStorage.clear();
      updateLoginStatus(false);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <button onClick={handleLoginOut}>
      <span className='inline-flex items-center rounded-lg px-3 py-2'>
        退出
      </span>
    </button>
  );
};

export default LoginOutButton;
