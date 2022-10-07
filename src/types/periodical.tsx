export interface VolumePageProps {
  volume: VolumeType;
}

export interface VolumeType {
  page_total: number;
  total: number;
  current_num: number;
  data: VolumeCategory[];
}

export interface VolumeCategory {
  category_id: number;
  category_name: string;
  items: VolumeItem[];
}

export interface VolumeItem {
  rid: string;
  name: string;
  description: string;
  github_url: string;
  stars: number;
  forks: number;
  watch: number;
  image_url: string | null;
}

export interface Volume {
  success: boolean;
  page_total: number;
  total: number;
  current_num: number;
  data: VolumeItem[];
}

export type VolumeAll = {
  success: boolean;
  lastNum: number;
  total: number;
  data: any[];
};

export interface CategoryPageProps {
  category: CategoryType;
}

export interface CategoryType {
  success: boolean;
  category_name: string;
  page_total: number;
  total: number;
  current_page: number;
  data: CategoryItem[];
}

export interface CategoryItem {
  rid: string;
  name: string;
  volume_num: number;
  description: string;
  github_url: string;
  stars: number;
  forks: number;
  watch: number;
  image_url: string | null;
}
