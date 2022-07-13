import Link from 'next/link';

interface Props {
  name: string;
  tid: string;
}

const Tag = ({ name, tid }: Props) => {
  return (
    <Link href={`/?sort_by=hot&tid=${tid}`}>
      <a className='inline-flex h-8 items-center justify-center rounded-lg pl-3 pr-3 text-sm font-bold text-blue-400 hover:bg-blue-400 hover:text-white'>
        {name}
      </a>
    </Link>
  );
};

export default Tag;
