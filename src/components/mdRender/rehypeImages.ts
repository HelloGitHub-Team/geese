import type { Element, Root, RootContent } from 'hast';

import { getHtmlImageAttributes, mapHtmlImages } from '@/utils/image';

/** Enable embedded HTML images without enabling arbitrary raw HTML. */
export default function rehypeImages() {
  return (tree: Root) => {
    const visit = (parent: Root | Element) => {
      parent.children = parent.children.flatMap((child): RootContent[] => {
        if (child.type === 'element') visit(child);
        if (child.type !== 'raw') return [child];

        const html = String(child.value);
        const nodes: RootContent[] = [];
        let position = 0;
        mapHtmlImages(html, (tag, tagName, offset) => {
          // A source outside a picture has no effect; img srcset is supported.
          if (tagName !== 'img') return tag;
          if (offset > position) {
            nodes.push({ type: 'text', value: html.slice(position, offset) });
          }
          nodes.push({
            type: 'element',
            tagName: 'img',
            properties: getHtmlImageAttributes(tag),
            children: [],
          });
          position = offset + tag.length;
          return tag;
        });
        if (!nodes.length) return [child];
        if (position < html.length) {
          nodes.push({ type: 'text', value: html.slice(position) });
        }
        return nodes;
      });
    };
    visit(tree);
  };
}
