import RcImage, { ImageProps } from 'rc-image';

import 'rc-image/assets/index.css';

const ImageWithPreview = (props: ImageProps) => {
  return <RcImage {...props} />;
};

export default ImageWithPreview;
