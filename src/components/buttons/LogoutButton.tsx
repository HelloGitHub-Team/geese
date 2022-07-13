import { Logout } from '@/services/login';

import { LoginOutProps } from '@/types/user';

const LogoutButton = ({ updateLoginStatus }: LoginOutProps) => {
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('Authorization');
      await Logout({ Authorization: `Bearer ${token}` });
      localStorage.clear();
      updateLoginStatus(false);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <button onClick={handleLogout}>
      <span className='inline-flex items-center rounded-lg px-3 py-2'>
        退出
      </span>
    </button>
  );
};

export default LogoutButton;
