type User = {
  uid: string;
  nickname: string;
  avatar: string;
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
  status: number;
  featured: boolean;
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
