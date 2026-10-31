import { useLoginContext } from '@/hooks/useLoginContext';

export function LoginModal({ children }: { children: React.JSX.Element }) {
  const { isLogin, login } = useLoginContext();
  const openModal = () => {
    if (!isLogin) {
      return login();
    }
  };
  return <div onClick={openModal}>{children}</div>;
}
