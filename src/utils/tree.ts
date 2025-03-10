import { chain } from 'ramda';

/**
 * Flatten an array containing a tree structure
 * @param {T[]} trees - An array containing a tree structure
 * @returns {T[]} - Flattened array
 */
export function flattenTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
  return chain((node) => {
    const children = node.children || [];
    return [node, ...flattenTrees(children)];
  }, trees);
}

export const createTree = (data: any, idKey = 'id', parentIdKey = 'parentId'): any[] => {
  const tree = {};
  const temp = {};

  data.forEach((item: any) => {
    // @ts-ignore
    temp[item[idKey]] = { ...item, children: [] };
  });

  data.forEach((item: any) => {
    // @ts-ignore
    const parent = temp[item[parentIdKey]];
    if (parent) {
      // @ts-ignore
      parent.children.push(temp[item[idKey]]);
    } else {
      // @ts-ignore
      tree[item[idKey]] = temp[item[idKey]];
    }
  });
  // @ts-ignore
  return Object.values(tree);
};

export function removeVietnameseTones(str: string) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');

  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  return str;
}
