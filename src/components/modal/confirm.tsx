import { render } from 'react-dom';

import Container, { Props } from '@/components/modal/Container';

import { isClient } from '@/utils/util';

const confirm = (options: Props) => {
  if (!isClient()) return;

  const div = document.createElement('div');
  document.body.appendChild(div);

  const handleCancel = () => {
    options.onCancel && options.onCancel();
    document.body.removeChild(div);
  };
  const handleOk = () => {
    options.onOk && options.onOk();
    document.body.removeChild(div);
  };

  render(
    <Container {...options} onCancel={handleCancel} onOk={handleOk} />,
    div
  );
};

export default confirm;
