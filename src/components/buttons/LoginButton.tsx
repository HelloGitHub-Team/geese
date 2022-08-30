import { useLoginContext } from '@/hooks/useLoginContext';

const LoginButton = () => {
  const { login } = useLoginContext();

  return (
    <button onClick={login}>
      <span className='inline-flex cursor-pointer items-center rounded-lg px-3 py-2'>
        登录
      </span>
    </button>
  );
};
export default LoginButton;
