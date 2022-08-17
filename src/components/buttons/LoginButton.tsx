import { getOAtuhURL } from '@/services/login';

const LoginButton = () => {
  const handleOAtuhURL = async () => {
    try {
      const data = await getOAtuhURL();
      if (data?.url != undefined) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.log('error:' + error);
    }
  };

  return (
    <button onClick={handleOAtuhURL}>
      <span className='inline-flex cursor-pointer items-center rounded-lg px-3 py-2'>
        登录
      </span>
    </button>
  );
};
export default LoginButton;
