import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import './App.css';
import {
  oldVnode,
  diff,
  cloneNodePath,
  isPrimitive,
  valueToJsonStrign,
  valueToClassName,
  newVnode,
  statusClassName,
  jsonTostringify,
  DataFormObserve,
} from './utils/index.js';

function App() {
  const codeRef = useRef();
  let [dataFormObserve, setDataFormObserve] = useState(
    new DataFormObserve({
      onUpdate(newItem) {
        setLine(newItem.nodeStrinSplice);
      },
    })
  );

  // 行数
  const [line, setLine] = useState([]);

  // 缩进
  const [retract, setRetract] = useState(40);
  // 行高
  const [inlineHeight, setInlineHeight] = useState(30);

  const heightStyle = useMemo(() => {
    // height: inlineHeight + 'px'
    return { lineHeight: inlineHeight + 'px' };
  }, [inlineHeight]);

  // jsonData
  const [jsonData, setJsonData] = useState(oldVnode);

  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (codeRef.current) {
      dataFormObserve.container = codeRef.current;
      dataFormObserve.updata(jsonData);
    }
  }, [jsonData]);

  const update = useCallback(() => {
    setJsonData(!isUpdate ? newVnode : oldVnode);
    setIsUpdate(!isUpdate);
  }, [isUpdate, jsonData]);

  function handleExtend(item) {
    if (!item.isNode) return;
    dataFormObserve.handleExtendsNode(item);
  }

  const renderJsonView = (data, diffData) => {
    const PrimitiveJsx = ({ data, item, i, parentPath, lineNum }) => {
      const isArray = Array.isArray(data);
      const keys = Object.keys(data);
      const statusClass = statusClassName([...parentPath, keys[i]], diffData);
      return (
        <div
          style={{
            marginLeft: retract,
            ...heightStyle,
          }}
          key={keys + i}
        >
          <span className={statusClass}>
            {/* {lineNum} */}
            {!isArray && (
              <>
                <span className={'hljs-string'}>{keys[i]}</span>:
              </>
            )}
            <span className={valueToClassName(item)}>
              {valueToJsonStrign(item)}
            </span>
          </span>
          {i + 1 === keys.length ? null : ','}
        </div>
      );
    };

    function render(data, parentPath = [], diffData, lineNum = 1) {
      if (isPrimitive(data)) {
        return <>{valueToJsonStrign(data)}</>;
      }
      let childrens = [];
      const isArray = Array.isArray(data);
      const keys = Object.keys(data);

      for (let i = 0; i < keys.length; i++) {
        const statusClass = statusClassName([...parentPath, keys[i]], diffData);
        const item = data[keys[i]];
        const itemIsArray = Array.isArray(item);
        if (isPrimitive(item)) {
          let children = (
            <PrimitiveJsx
              {...{ data, i, item, parentPath, lineNum: lineNum }}
            />
          );
          childrens.push(children);
        } else {
          if (isArray && itemIsArray) {
            childrens.push(
              render(item, [...parentPath, keys[i]], diffData, (lineNum += 1))
            );
            continue;
          }

          let jsx = (
            <>
              <div
                className={statusClass}
                style={{
                  marginLeft: retract,
                  display: statusClass ? 'inline-block' : 'block',
                }}
                key={keys + i}
              >
                <div
                  style={{
                    ...heightStyle,
                  }}
                >
                  <span style={{ cursor: 'pointer' }}>{/* {lineNum}+ */}</span>
                  {!isArray && (
                    <span className={'hljs-string '}>{keys[i]}:</span>
                  )}
                  <span>
                    {itemIsArray ? (
                      <>
                        [<br />
                      </>
                    ) : (
                      '{'
                    )}
                  </span>
                </div>

                {render(item, [...parentPath, keys[i]], diffData, lineNum + 1)}
                <div
                  style={{
                    ...heightStyle,
                  }}
                >
                  <span>
                    {itemIsArray ? ']' : '}'}
                    {i + 1 === data.length ? null : ','}
                  </span>
                </div>
              </div>
              {statusClass ? <br /> : ''}
            </>
          );
          if (Object.keys(item).length === 0) {
            jsx = (
              <>
                <div
                  className={statusClass}
                  style={{
                    marginLeft: retract,
                    display: statusClass ? 'inline-block' : 'block',
                  }}
                  key={keys + i}
                >
                  <div
                    style={{
                      ...heightStyle,
                    }}
                  >
                    <span style={{ cursor: 'pointer', marginLeft: '-10px' }}>
                      {/* {lineNum}+ */}
                    </span>
                    {!isArray && (
                      <span className={'hljs-string '}>"{keys[i]}":</span>
                    )}
                    <span>
                      {itemIsArray ? (
                        <span>
                          []
                          {i + 1 === data.length ? null : ','}
                        </span>
                      ) : (
                        <span>
                          {'{}'}'{i + 1 === data.length ? null : ','}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                {statusClass ? <br /> : ''}
              </>
            );
          }
          childrens.push(jsx);
        }
      }

      return childrens;
    }

    return (
      <>
        <div style={{ ...heightStyle }}>
          {Array.isArray(data) ? '[' : isPrimitive(data) ? null : '{'}
        </div>
        {render(data, [], diffData, 0)}
        <div style={{ ...heightStyle }}>
          {Array.isArray(data) ? ']' : isPrimitive(data) ? null : '}'}
        </div>
      </>
    );
  };

  return (
    <>
      <button onClick={() => update()}>更新数据</button>

      <div style={{ display: 'flex' }}>
        <div
          style={{
            paddingBlock: '1em',
            marginTop: '1em',
          }}
        >
          {line.map((item, index) => (
            <div
              onClick={() => handleExtend(item)}
              style={{
                ...heightStyle,
                paddingInline: 10,
                display: 'flex',
                justifyContent: 'space-between',
                columnGap: '10px',
              }}
            >
              <div
                style={{ color: '#666666', width: '20px', textAlign: 'right' }}
              >
                {index + 1}
              </div>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  lineHeight: item.isExpansion ? '9px' : '12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: item.isNode ? '1px solid #333333' : '',
                }}
              >
                {item.isNode ? (item.isExpansion ? '-' : '+') : ''}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex' }}>
          {/* <pre>
            <code className="hljs" style={{ width: '50vw', overflow: 'auto' }}>
              {renderJsonView(jsonData, diffData)}
            </code>
          </pre> */}
          <pre>
            <code
              ref={codeRef}
              className="hljs"
              style={{ width: '100vw', ...heightStyle, overflow: 'auto' }}
            ></code>
          </pre>
        </div>
      </div>
    </>
  );
}

export default App;
