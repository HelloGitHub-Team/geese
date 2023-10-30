import { HomeItem } from '@/types/home';

export const maxTotal = 15;

export interface TagPageProps {
  tag_name: string;
  items: HomeItem[];
}

export interface TagPage {
  page: number;
  data: HomeItem[];
  tid: string;
  tag_name: string;
  has_more: boolean;
}

export interface TagItems {
  success: boolean;
  page: number;
  data: Tag[];
  has_more: boolean;
}

export interface Tag {
  name: string;
  tid: string;
  icon_name: string;
}

export interface SelectTag {
  name: string;
  tid: string;
  is_selected: boolean;
}

export interface SelectTagItems {
  success: boolean;
  data: PortalTagGroup[];
  effected: string[];
}

export interface TagType {
  name: string;
  tid: string;
}
export interface PortalTag {
  name: string;
  tid: string;
  icon_name: string;
  is_selected: boolean;
}

export interface PortalTagGroup {
  group_name: string;
  tags: PortalTag[];
}
