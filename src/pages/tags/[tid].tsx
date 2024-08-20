import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ItemBottom from '@/components/home/ItemBottom';
import Items from '@/components/home/Items';
import Navbar from '@/components/navbar/Navbar';
import Seo from '@/components/Seo';
import ToTop from '@/components/toTop/ToTop';

import { getTagPageItems } from '@/services/tag';
import { getClientIP } from '@/utils/util';

import { TagPageProps } from '@/types/tag';

const TagPage: NextPage<TagPageProps> = ({ items, tag_name }) => {
  const { t, i18n } = useTranslation('topic');

  return (
    <>
      <Seo
        title={t('title', { name: tag_name })}
        description={t('description', { name: tag_name })}
      />
      <Navbar middleText={tag_name} endText={t('navbar')} />
      <div className='h-screen'>
        <Items repositories={items} i18n_lang={i18n.language} />
        <ItemBottom endText={t('bottom_text')} />
        <div className='hidden md:block'>
          <ToTop />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  locale,
}) => {
  const ip = getClientIP(req);
  const tid = query?.tid as string;
  const data = await getTagPageItems(ip, tid);
  if (data.success) {
    const tag_name =
      locale == 'en' && data.tag_name_en ? data.tag_name_en : data.tag_name;
    return {
      props: {
        ...(await serverSideTranslations(locale as string, [
          'common',
          'topic',
        ])),
        items: data.data,
        tag_name: tag_name,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default TagPage;
