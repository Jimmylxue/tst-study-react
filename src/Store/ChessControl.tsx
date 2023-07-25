// 引入mobx
import { makeAutoObservable } from "mobx";

export default class ChessControl {
  /***
   * 井字棋以二维数组方式的方式存在
   * 数组中第一二三维分别代表着井字棋的第一二三行
   * 没一维数组中有三个数，0代表着未落子在此
   * 1代表一方，-1代表另一方
   * 更换为五子棋的话，扩容数组即可，然后将棋盘的长宽分别修改
   * 
   * 五子棋玩法与井字棋类似
   */
  chess: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  // active-当前应该下的棋子，1：黑旗，-1：白旗
  active: number = 1;

  constructor() {
    makeAutoObservable(this);
  }

  // 落子操作
  chessClick = (rowIndex: number, cluIndex: number) => {
    if (this.chess[rowIndex][cluIndex] === 0) {
      // 将当前应该下的子下在这个地方
      this.chess[rowIndex][cluIndex] = this.active;
      // 切换下一步
      this.active = this.active === 1 ? -1 : 1;
    }
    return this.checkWin();
  };

  // 落子后，逐个检查各个方向的棋子是否达到赢的标准
  checkWin() {
    /**
     * 当落子后，就需要检查当前游戏是否已经结束
     * 判断井字棋的方法就是看横竖与交叉是否存在连续三个同方棋子
     */
    // 先检查当前落子的这个位置的横纵是否存在连续三颗棋子

    for (let i = 0; i < this.chess.length; i++) {
      for (let j = 0; j < this.chess[i].length; j++) {
        // 逐个便利所有的棋子，这里可以封装一个方法区使用
        if (this.chess[i][j] !== 0) {
          if (this.counter(i, j)) {
            return true;
          }
        }
      }
    }
  }

  // 数棋子
  counter(row: number, clu: number): boolean {
    // 右侧方向
    const currentChess: number = this.chess[row][clu];
    let count: number = 1; // 当前方向的棋子有多少
    for (let i = 1; i < 5; i++) {
      if (clu + i < 8 && currentChess === this.chess[row][clu + i]) {
        //  判断是否出现索引越界
        count++;
      } else {
        break; //  当数组下标越界或者是出现了不匹配的棋子，那么就退出此次循环
      }
    }
    
    if (count === 5) return true;

    // 右下方向
    count = 1; //  重置count的值
    for (let i = 1; i < 5; i++) {
      if (
        row + i < 8 &&
        clu + i < 8 &&
        currentChess === this.chess[row + i][clu + i]
      ) {
        //  判断是否出现索引越界
        count++;
      } else {
        break; //  当数组下标越界或者是出现了不匹配的棋子，那么就退出此次循环
      }
    }
    if (count === 5) return true;

    // 下侧方向
    count = 1; //  重置count的值
    for (let i = 1; i < 5; i++) {
      if (row + i < 8 && currentChess === this.chess[row + i][clu]) {
        //  判断是否出现索引越界
        count++;
      } else {
        break; //  当数组下标越界或者是出现了不匹配的棋子，那么就退出此次循环
      }
    }
    if (count === 5) return true;

    // 左下方向
    count = 1; //  重置count的值
    for (let i = 1; i < 5; i++) {
      if (row + i < 8 && clu - i >= 0 && this.chess[row + i][clu - i]) {
        //  判断是否出现索引越界
        count++;
      } else {
        break; //  当数组下标越界或者是出现了不匹配的棋子，那么就退出此次循环
      }
    }
    if (count === 5) return true;

    return false;
  }

  // 是否游戏结束
  isFinish(count: number, chessLength: number): any {
    if (count === chessLength) {
      // 然后重新开始，重置数组
      this.initChess();
    } else {
      return false;
    }
  }

  // 游戏初始化，当游戏重新开始时，调用的也是这个函数
  initChess () {
    // 初始化棋盘
    this.chess = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
  }
}
