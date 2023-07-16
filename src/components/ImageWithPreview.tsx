import RcImage, { ImageProps } from 'rc-image';
import { AiOutlineClose } from 'react-icons/ai';

import 'rc-image/assets/index.css';

const ImageWithPreview = (props: ImageProps) => {
  return (
    <RcImage
      {...props}
      preview={{
        icons: { close: <AiOutlineClose style={{ fontSize: 13 }} /> },
        toolbarRender: () => <></>,
      }}
    />
  );
};

export default ImageWithPreview;
