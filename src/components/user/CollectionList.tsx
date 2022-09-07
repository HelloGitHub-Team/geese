import useCollectionData from '@/hooks/useCollectionData';

import Button from '@/components/buttons/Button';
import Loading from '@/components/loading/Loading';
import Pagination from '@/components/pagination/Pagination';

interface Props {
  uid: string;
}

export default function CollectionList(props: Props) {
  const { data, setPage } = useCollectionData(props.uid);

  return data ? (
    <>
      {data.data.map((item) => (
        <div key={item.repo.rid}>
          <div>
            {item.repo.name}: {item.repo.description}
          </div>
          <div>
            主语言：{item.repo.primary_lang} star: {item.repo.stars}k 中文：
            {item.repo.has_chinese ? '是' : '否'}
          </div>
          <Button>
            <a href={item.repo.url} target='_blank' rel='noreferrer'>
              查看
            </a>
          </Button>
        </div>
      ))}
      <Pagination
        PreviousText='上一页'
        NextText='下一页'
        current={data.page}
        total={data.page_total}
        onPageChange={setPage}
      />
    </>
  ) : (
    <Loading />
  );
}
