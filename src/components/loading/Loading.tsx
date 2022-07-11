import LoadingSvg from './loading.svg';

export default function Loading() {
  return (
    <div className='flex items-center justify-center space-x-2 pt-4 pb-4'>
      <LoadingSvg className='animate-spin text-3xl' />
    </div>
  );
}
