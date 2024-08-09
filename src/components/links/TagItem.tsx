import { NoPrefetchLink } from '@/components/links/CustomLink';

interface Props {
  name: string;
  tid: string;
}

const TagItem = ({ name, tid }: Props) => {
  return (
    <NoPrefetchLink href={`/?sort_by=hot&tid=${tid}`}>
      <a className='inline-flex h-8 items-center justify-center rounded-lg pl-3 pr-3 text-sm font-bold text-blue-400 hover:bg-blue-400 hover:text-white'>
        {name}
      </a>
    </NoPrefetchLink>
  );
};

export default TagItem;
