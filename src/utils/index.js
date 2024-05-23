export const oldVnode = {
  bid: 1,
  b: { a: '1111', c: '这是一个长长的文本\n12133123' },
  formData: [
    {
      name: '213',
      materialPackId: '',
      taskReadyStatus: 0,
      b: [
        '1',
        3,
        'ab',
        undefined,
        function () {
          console.log(123);
        },
        null,
        Symbol(123),
        { a: '1111' },
      ],
      id: null,
    },
    {
      customContent: {
        project: {
          landing_type: 'LINK',
          delivery_mode: 'PROCEDURAL',
          marketing_goal: 'VIDEO_AND_IMAGE',
          ad_type: 'ALL',
          keywords: [],
          search_bid_ratio: 1.3,
          audience_extend: 'ON',
          delivery_range: {
            inventory_catalog: 'UNIVERSAL_SMART',
          },
          delivery_setting: {
            pricing: 'PRICING_OCPM',
            bid_type: 'CUSTOM',
            cpa_bid: 0.1,
            schedule_type: 'SCHEDULE_START_END',
            start_time: '2024-05-02',
            end_time: '2024-06-02',
          },
          bid: {
            method: 0,
            bidMin: 500,
          },
          customA: '1234',
          customC: '1234',
        },
        advertising: {
          native_setting: {},
          promotion_materials: {
            video_select_type: 'FIXED',
            title_material_list: [undefined],
            title_select_number: 10,
            call_to_action_buttons: [],
            intelligent_generation: 'ON',
            product_info: {
              titles: [null],
              image_ids: [],
              selling_points: [],
            },
          },
          source: '',
          is_comment_disable: 'ON',
        },
      },
    },
    {
      taskInfo: {
        ad_count: 1,
        video_count: 5,
        repeat_run: true,
        ad_init_status: true,
        ad_interval: 0,
        repeat_run_cycle: [1, 2, 3, 4, 5],
        repeat_run_time: '12',
        ad_interval_time: 4,
      },
    },
  ],
};

export const newVnode = {
  formData: [
    {
      name: '223',
      materialPackId: '',
      taskReadyStatus: 0,
      id: null,
      cc: {
        a: 1,
      },
    },
    {
      customContent: {
        project: {
          landing_type: 'LINK',
          delivery_mode: 'PROCEDURAL',
          marketing_goal: 'VIDEO_AND_IMAGE',
          ad_type: 'ALL',
          keywords: [
            {
              key: '1',
            },
            {
              key: '2',
            },
          ],
          search_bid_ratio: 1.3,
          audience_extend: 'ON',
          delivery_range: {
            inventory_catalog: 'UNIVERSAL_SMART',
          },
          delivery_setting: {
            pricing: 'PRICING_OCPM',
            bid_type: 'CUSTOM',
            cpa_bid: 0.1,
            schedule_type: 'SCHEDULE_START_END',
            start_time: '2024-05-02',
            end_time: '2024-06-02',
          },
          bid: {
            method: 1,
            bidMin: 500,
          },
          customA: '1234',
          customD: '1234',
          customE: '1234',
        },
        advertising: {
          native_setting: {},
          promotion_materials: {
            video_select_type: 'FIXED',
            title_material_list: [],
            title_select_number: 10,
            call_to_action_buttons: [],
            intelligent_generation: 'ON',
            product_info: {
              titles: ['今天是应允', '哈哈哈'],
              image_ids: [1, 2, 3],
              selling_points: [],
            },
          },
          source: '',
          is_comment_disable: 'ON',
        },
      },
    },
    {
      taskInfo: null,
    },
  ],
  bid: 2,
};

// export const oldVnode = {
//   a: 1,
//   b: 2,
//   d: {
//     a: 1,
//     b: 2,
//   },
// };
// export const newVnode = {
//   b: 2,
//   a: 1,
//   c: 3,
//   d: {
//     a: 1,
//     b: 2,
//   },
// };
/**
 *
 * @param {*} oldVnode
 * @param {*} newVnode
 * @return {
 *    add: [],
 *    remove: [],
 *    update: []
 * }
 *
 */

export function diff(oldVnode, newVnode) {
  const add = [];
  const remove = [];
  const update = [];
  function vNodeDiff(oldVnode, newVnode, parentPath = []) {
    function subDiff(oldKey, newKey) {
      if (oldKey === newKey) {
        vNodeDiff(oldVnode[oldKey], newVnode[newKey], [...parentPath, newKey]);
      } else {
        add.push({
          path: [...parentPath, newKey],
          payload: newVnode[newKey],
        });
        remove.push({
          path: [...parentPath, oldKey],
          payload: oldVnode[oldKey],
        });
      }
    }

    if (isPrimitive(newVnode)) {
      if (oldVnode !== newVnode) {
        update.push({
          payload: [oldVnode, newVnode],
          path: parentPath,
        });
      }
      return oldVnode === newVnode;
    }

    if (Array.isArray(newVnode)) {
      if (newVnode.length === oldVnode.length) {
        for (let i = 0; i < newVnode.length; i++) {
          vNodeDiff(oldVnode[i], newVnode[i], [...parentPath, i]);
        }
      }
      if (newVnode.length > oldVnode.length) {
        for (let i = 0; i < newVnode.length; i++) {
          if (i + 1 > oldVnode.length) {
            add.push({
              path: [...parentPath, i],
              payload: newVnode[i],
            });
            continue;
          }
          vNodeDiff(oldVnode[i], newVnode[i], [...parentPath, i]);
        }
      }

      if (newVnode.length < oldVnode.length) {
        for (let i = 0; i < oldVnode.length; i++) {
          if (i + 1 > newVnode.length) {
            remove.push({
              path: [...parentPath, i],
              payload: oldVnode[i],
            });
            continue;
          }
          vNodeDiff(oldVnode[i], newVnode[i], [...parentPath, i]);
        }
      }
      return;
    }
    const newKeys = Object.keys(newVnode);

    const oldKeys = Object.keys(isPrimitive(oldVnode) ? {} : oldVnode);

    const owendByAll = newKeys.filter((key) => oldKeys.includes(key));
    const addByAll = newKeys.filter((key) => !oldKeys.includes(key));
    const remoteByAll = oldKeys.filter((key) => !newKeys.includes(key));

    owendByAll.forEach((key) => {
      subDiff(key, key);
    });
    addByAll.forEach((key) => {
      add.push({
        path: [...parentPath, key],
        payload: newVnode[key],
      });
    });
    remoteByAll.forEach((key) => {
      remove.push({
        path: [...parentPath, key],
        payload: oldVnode[key],
      });
    });
  }
  vNodeDiff(oldVnode, newVnode);
  return { add, remove, update };
}

export function cloneNodePath(vnode) {
  if (vnode == null) {
    return null;
  }

  const cloneVnode = JSON.parse(JSON.stringify(vnode));

  function clone(cloneVnode, parentPath = [], parentCloneVnode = null) {
    if (isPrimitive(cloneVnode)) {
      if (parentPath.length > 0 && parentCloneVnode) {
        parentCloneVnode[parentPath.at(-1)] = parentPath.join('.');
        return;
      }
    }

    if (Array.isArray(cloneVnode)) {
      if (cloneVnode.length === 0) {
        if (parentPath.length > 0 && parentCloneVnode) {
          parentCloneVnode[parentPath.at(-1)] = parentPath.join('.');
          return;
        }
      }
      for (let i = 0; i < cloneVnode.length; i++) {
        clone(cloneVnode[i], [...parentPath, i], cloneVnode);
      }
      return;
    }
    const keys = Object.keys(cloneVnode);
    if (keys.length === 0) {
      if (parentPath.length > 0 && parentCloneVnode) {
        parentCloneVnode[parentPath.at(-1)] = parentPath.join('.');
        return;
      }
    }

    keys.forEach((key) => {
      clone(cloneVnode[key], [...parentPath, key], cloneVnode);
    });
    return;
  }
  clone(cloneVnode);

  return cloneVnode;
}

export function isPrimitive(value) {
  return (
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    typeof value === 'function' ||
    typeof value === 'symbol' ||
    value === null
  );
}

export function valueToJsonStrign(value, isNode = false) {
  if (value === null) {
    if (isNode) {
      return '<span class="hljs-literal">null</span>';
    }
    return 'null';
  }
  if (typeof value === 'undefined') {
    if (isNode) {
      return '<span class="hljs-literal">undefined</span>';
    }
    return 'undefined';
  }

  if (typeof value === 'string') {
    if (isNode) {
      return '<span class="hljs-string">"' + value + '"</span>';
    }
    return '"' + value + '"';
  }

  if (
    typeof value === 'function' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  ) {
    if (isNode) {
      return '<span class="hljs-literal">' + value.toString() + '</span>';
    }
    return value.toString();
  }

  if (typeof value === 'number') {
    if (isNode) {
      return '<span class="hljs-literal">' + value + '</span>';
    }
    return value;
  }

  if (isNode) {
    return '<span class="hljs-string">"' + value + '"</span>';
  }

  return value;
}

export function valueToClassName(value) {
  if (value === null) {
    return 'hljs-literal';
  }
  if (typeof value === 'undefined') {
    return 'hljs-literal';
  }

  if (typeof value === 'string') {
    return 'hljs-string';
  }

  if (
    typeof value === 'function' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  ) {
    return 'hljs-literal';
  }

  if (typeof value === 'number') {
    return 'hljs-literal';
  }

  return 'hljs-string';
}

export const isUpdata = (customParentPath, diffData) => {
  return diffData.update.some((item) => {
    return customParentPath.join('.') === item.path.join('.');
  });
};

export const isAdd = (customParentPath, diffData) => {
  return diffData.add.some((item) => {
    return customParentPath.join('.') === item.path.join('.');
  });
};

export const statusClassName = (customParentPath, diffData) => {
  if (isUpdata(customParentPath, diffData)) {
    return 'update_status';
  }

  if (isAdd(customParentPath, diffData)) {
    return 'add_status';
  }

  return '';
};

function _jsonTostringify(value, container, diffData, extendsNodePath = []) {
  const { add, remove, update } = diffData;
  const addStatusHtml =
    '<span class="hljs-string" style="display:inline-block;border:1px solid #666666;width:12px;height:12px;line-height:14px;text-align:center;cursor: text;">+</span>';
  const updateStatusHtml =
    '<span class="hljs-string" style="display:inline-block;border:1px solid #666666;width:12px;height:12px;line-height:8px;text-align:center;cursor: text;">o</span>';

  function stringify(value, tierNum = 0, parentPath = []) {
    const t = Array.from({ length: tierNum })
      .map(() => ' ')
      .join('');

    if (isPrimitive(value)) {
      const isAdd = add
        .map((item) => item.path.join('.'))
        .includes([...parentPath].join('.'));
      const isUpdate = update
        .map((item) => item.path.join('.'))
        .includes([...parentPath].join('.'));
      const diffFlgString = () => {
        return `${isAdd ? addStatusHtml : isUpdate ? updateStatusHtml : ''}`;
      };
      if (typeof value === 'string' && value.split('\n').length > 1) {
        return value
          .split('\n')
          .map((item, index) => {
            if (index > 0) {
              return '\n' + t + item;
            }
            return item;
          })
          .join('');
      }

      return valueToJsonStrign(value, true) + diffFlgString();
    }
    const isArray = Array.isArray(value);
    let txt = '';
    const keys = Object.keys(value);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const data = value[key];
      const itemIsAraay = Array.isArray(data);
      const pathArr = [...parentPath, key];
      const currentPath = pathArr.join('.');
      const isAdd = add
        .map((item) => item.path.join('.'))
        .includes(currentPath);
      const isUpdate = update
        .map((item) => item.path.join('.'))
        .includes(currentPath);
      const diffFlgString = () => {
        return `${isAdd ? addStatusHtml : isUpdate ? updateStatusHtml : ''}`;
      };
      const isClodeNode = extendsNodePath.includes(currentPath);

      if (isClodeNode) {
        txt +=
          `<div style="display:inline;" data-path="${pathArr.join(
            '.'
          )}_node">` +
          `${t}` +
          `${stringify(key)}:` +
          `${itemIsAraay ? `[...]` : `{...}`}` +
          `${i + 1 === keys.length ? '' : ',\n'}</div>`;
        continue;
      }

      if (isPrimitive(data)) {
        txt +=
          `<div style="display:inline;" data-path="${pathArr.join('.')}">${t}${
            !isArray ? `${stringify(key)}:` : ''
          }` +
          `${stringify(data, tierNum + 2, pathArr)}` +
          `${i + 1 === keys.length ? '' : ',\n'}</div>`;
        continue;
      }
      const keysLen = Object.keys(data).length;
      if (keysLen === 0) {
        txt +=
          `<div style="display:inline;" >${t}${stringify(key) + ':'}${
            itemIsAraay ? '[]' : '{}'
          }` +
          `${diffFlgString()}` +
          `${i + 1 === keys.length ? '' : ',\n'}</div>`;
        continue;
      }
      if (isArray) {
        txt +=
          `${
            diffFlgString()
              ? Array.from({ length: tierNum - 2 })
                  .map(() => ' ')
                  .join('')
              : t
          }${diffFlgString()}<div style="display:inline;" data-path="${
            pathArr.join('.') + '_node'
          }">${itemIsAraay ? '[\n' : '{\n'}` +
          `${stringify(data, tierNum + 2, pathArr)}` +
          `${
            itemIsAraay
              ? i + 1 === keys.length
                ? '\n' + t + ']'
                : '\n' + t + '],\n'
              : i + 1 === keys.length
              ? '\n' + t + '}'
              : '\n' + t + '},\n'
          }</div>`;
        continue;
      }

      txt +=
        `${
          diffFlgString()
            ? Array.from({ length: tierNum - 2 })
                .map(() => ' ')
                .join('')
            : t
        }${diffFlgString()}${stringify(key) + ':'}` +
        `<div style="display:inline;" data-path="${
          pathArr.join('.') + '_node'
        }">` +
        `${itemIsAraay ? '[\n' : '{\n'}` +
        `${stringify(data, tierNum + 2, pathArr)}` +
        `${
          itemIsAraay
            ? i + 1 === keys.length
              ? '\n' + t + ']'
              : '\n' + t + '],\n'
            : i + 1 === keys.length
            ? '\n' + t + '}'
            : '\n' + t + '},\n'
        }</div>`;
    }
    return txt;
  }
  const html =
    `${Array.isArray(value) ? '[\n' : '{\n'}` +
    stringify(value, 2) +
    `${Array.isArray(value) ? '\n]' : '\n}'}`;
  if (container) {
    container.innerHTML = html;
  }
  const lineArr = html.split('\n');
  return {
    lineNum: lineArr.length,
    lineArr: lineArr,
  };
}

export const jsonTostringify = _jsonTostringify;

export class DataFormObserve {
  _jsonTostringify = _jsonTostringify;
  container = null;
  nodeStrinSplice = [];
  diffData = [];
  oldData = null;
  lineNum = 0;
  extendsNodePath = [];
  constructor({ container, onUpdate } = {}) {
    this.container = container || null;
    this.onUpdate = onUpdate || null;
  }
  set container(container) {
    this.container = container;
  }
  updata = (newData, isUploadOldData = true) => {
    if (isUploadOldData) {
      this.diffData = diff(this.oldData, newData);
    }
    const { lineNum, lineArr } = this._jsonTostringify(
      newData,
      this.container,
      this.diffData,
      this.extendsNodePath
    );
    if (isUploadOldData) {
      this.oldData = newData;
    }

    const reg = /(?<=data-path=").+(?=_node)/;
    this.nodeStrinSplice = lineArr.map((item, index) => {
      const match = item.match(reg);
      return {
        line: index + 1,
        isNode: item.includes('_node'),
        path: match ? match[0] : '',
        isExpansion: !this.extendsNodePath.includes(match ? match[0] : ''),
      };
    });
    this.lineNum = lineNum;
    this.onUpdate({
      lineNum,
      nodeStrinSplice: this.nodeStrinSplice,
    });
  };
  handleExtendsNode(item) {
    if (this.extendsNodePath.includes(item.path)) {
      this.extendsNodePath = this.extendsNodePath.filter(
        (path) => path != item.path
      );
    } else {
      this.extendsNodePath.push(item.path);
    }
    this.updata(this.oldData, false);
  }
}
