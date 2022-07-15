export interface TagsProps {
  tagItems: Tag[];
}

export interface TagItems {
  page: number;
  data: Tag[];
  has_more: boolean;
}

export interface Tag extends TagType {
  repo_total: number;
  created_at: string;
  udpated_at: string;
}

export interface TagType {
  name: string;
  tid: string;
}
