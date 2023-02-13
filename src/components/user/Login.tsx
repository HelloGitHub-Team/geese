import { useLoginContext } from '@/hooks/useLoginContext';

export function LoginModal({ children }: { children: JSX.Element }) {
  const { isLogin, login } = useLoginContext();
  const openModal = () => {
    if (!isLogin) {
      login();
    }
  };
  return <div onClick={openModal}>{children}</div>;
}
