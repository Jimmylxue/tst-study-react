import ChessControl from "./ChessControl";
import React from 'react';

class RootStore {
  // 定义类型
  chessControl : ChessControl;
  constructor() {
    this.chessControl = new ChessControl;
  }
}

// 完成mobx模块化封装
const rootStore = new RootStore();
const context = React.createContext(rootStore);
const useStore = () => React.useContext(context);

// 采用默认暴露的方法暴露出去
export default useStore;