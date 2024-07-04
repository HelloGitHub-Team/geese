import LoadingSvg from '~/images/loading.svg';

export default function Loading() {
  return (
    <div className='flex items-center justify-center space-x-2 pt-3 pb-3'>
      <LoadingSvg className='animate-spin text-3xl dark:invert' />
    </div>
  );
}
