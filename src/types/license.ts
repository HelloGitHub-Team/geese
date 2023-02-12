type User = {
  uid: string;
  nickname: string;
  avatar: string;
};
type Tag = {
  tid?: string;
  name: string;
  'name_zh?': string;
  'description?': string;
  'description_zh?': string;
  show?: boolean;
};

export type LicenseDetailData = {
  lid: string;
  spdx_id: string;
  name: string;
  remark: string;
  user: User;
  text: string;
  text_zh: string;
  header_text: string;
  header_text_zh: string;
  html: string;
  header_html: string;
  description: string;
  status: number;
  featured: boolean;
  permissions: Tag;
  conditions: Tag;
  limitations: Tag;
  is_osi: boolean;
  is_fsf: boolean;
  is_deprecate: boolean;
  created_at: string;
  updated_at: string;
  edit_at: string;
};

export type LicenseDetailFetchData = {
  success: boolean;
  data: LicenseDetailData;
};

export type TagListItem = {
  title: string;
  key: string;
  content: Tag[];
};

type LicenseListItem = {
  lid: string;
  spdx_id: string;
  name: string;
  pv: string;
  uv: number;
  featured: boolean;
  tags: any[];
  status: number;
  is_show: boolean;
  is_osi: boolean;
  is_fsf: boolean;
  is_deprecate: boolean;
  created_at: string;
  updated_at: string;
  publish_at: string;
};
export type LicenseListFetchData = {
  success: boolean;
  page: number;
  pageSize: number;
  data: LicenseListItem[];
  has_more: boolean;
  page_total: number;
  total: number;
};

export type LicenseTagsFetchData = {
  success: boolean;
  data: Tag[];
};
