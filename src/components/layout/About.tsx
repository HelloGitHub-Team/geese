// 本组件用于展示关于本站的介绍信息

const About: React.FC = () => {
  return (
    <div className='rounded-lg px-3 pb-2'>
      <div className='flex h-10 items-center'>关于本站</div>

      <div className='text-sm leading-6'>
        HelloGitHub
        是一个分享有趣、入门级开源项目的平台。希望大家能够在这里找到编程的快乐、轻松搞定问题的技术方案、大呼过瘾的开源神器，
        一个偶遇的开源项目，开启你的开源之旅。
      </div>
    </div>
  );
};

export default About;
