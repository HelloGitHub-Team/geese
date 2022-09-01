import confirm from '@/components/modal/confirm';
import Container from '@/components/modal/Container';

const Modal: typeof Container & { confirm: typeof confirm } = Container as any;
Modal.confirm = confirm;

export default Modal;
