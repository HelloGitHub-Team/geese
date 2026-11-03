type User = {
  uid: string;
  nickname: string;
  avatar_path: string | null;
};
export type Tag = {
  tid: string;
  name: string;
  name_zh: string;
  description: string;
  description_zh: string;
  tag_type?: string;
  show?: boolean;
};

export type LicenseDetailData = {
  lid: string;
  spdx_id: string;
  name: string;
  remark: string;
  user: User | null;
  text: string;
  text_zh: string;
  description: string;
  description_zh: string;
  permissions: Tag[];
  conditions: Tag[];
  limitations: Tag[];
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
  title_zh: string;
  key: string;
  bgColor: string;
  content: Tag[];
};

export type LicenseTagsFetchData = {
  success: boolean;
  data: Tag[];
};
