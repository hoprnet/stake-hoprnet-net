export const onNotSelectingClick = (() => {
    let clickTime = 0;
    let pos = {x: 0, y: 0};
  
    return onClick => ({
      onMouseDown: ({nativeEvent: e}) => {clickTime = Date.now(); pos.x = e.x; pos.y = e.y;},
      onMouseUp: ({nativeEvent: e}) => {Date.now() - clickTime < 500 && pos.x === e.x && pos.y === e.y && onClick()},
    });
})();