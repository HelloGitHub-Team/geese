import { getOAtuhURL } from '@/services/login';

const SideLoginButton = () => {
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
    <div className='box-border py-6 text-center align-middle text-base'>
      <button
        onClick={handleOAtuhURL}
        type='button'
        className='button box-border rounded-md border-2 border-slate-400 px-3 py-2 text-gray-500'
      >
        立即登录
      </button>
    </div>
  );
};

export default SideLoginButton;
