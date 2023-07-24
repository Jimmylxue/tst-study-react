// 引入mobx
import { makeAutoObservable } from "mobx";

export default class ChessControl {
  /***
   * 井字棋以二维数组方式的方式存在
   * 数组中第一二三维分别代表着井字棋的第一二三行
   * 没一维数组中有三个数，0代表着未落子在此
   * 1代表一方，-1代表另一方
   * 更换为五子棋的话，扩容数组即可，然后将棋盘的长宽分别修改
   */
  chess : number[][] = [
    [0, 0, 0], 
    [0, 0, 0], 
    [0, 0, 0], 
  ];
  // active-当前应该下的棋子
  active : number = 1;

  constructor() {
    makeAutoObservable(this);
  }

  // 落子操作
  chessClick = (rowIndex : number, cluIndex : number ) => {
    if (this.chess[rowIndex][cluIndex] === 0) {
      // 将当前应该下的子下在这个地方
      this.chess[rowIndex][cluIndex] = this.active;
      // 切换下一步
      this.active = this.active === 1 ? -1 : 1;
    }
    this.checkWin(rowIndex , cluIndex);
  }

  // 落子后，检查各个方向的棋子是否达到赢的标准
  checkWin(rowIndex : number, cluIndex : number) {
    /**
     * 当落子后，就需要检查当前游戏是否已经结束
     * 判断井字棋的方法就是看横竖与交叉是否存在连续三个同方棋子
     */
    // 先检查当前落子的这个位置的横纵是否存在连续三颗棋子
    // 行
    let count : number = 0;   //  计数，如果为3则当前游戏结束
    const currentChess : number = this.chess[rowIndex as number][cluIndex]; //  当前的棋子
    const chessLength : number = this.chess[rowIndex as number].length;   //  当前是几阶，可推广到五子棋
    // 横
    for ( let i = 0; i < chessLength; i++) {
      if (currentChess === this.chess[rowIndex as number][i]) {
        count++;
      }else {
        // 如果有一个棋子不一样，直接跳出循环
        break;
      }
    }
    if (!this.isFinish(count, chessLength)) {
      count = 0;
    }

    // 竖
    for (let i = 0; i < chessLength; i++) {
      if (currentChess === this.chess[i][cluIndex]) {
        count++;
      }else {
        break;
      }
    }
    if (!this.isFinish(count, chessLength)) {
      count = 0;
    }
    
    let myRow : number = rowIndex - 1;
    let myClu : number = cluIndex - 1;

    // 由于是直接从左上开始，需要将当前位置的棋子算进去，所以置count为1
    count = 1;
    
    // 交叉,左上方向
    while ( myRow >= 0 && myClu>= 0 ) {
      if (this.chess[myRow][myClu] === currentChess) {  //  如果相等
        count++;
      }else {
        break;
      }
      myRow--;
      myClu--;
    }

    
    // 右下
    myRow = rowIndex + 1;
    myClu = cluIndex + 1;
    while ( myRow < chessLength && myClu < chessLength ) {
      if (this.chess[myRow][myClu] === currentChess) {  //  如果相等
        count++;
      }else {
        break;
      }
      myRow++;
      myClu++;
    }
    
    if (!this.isFinish(count, chessLength)) {
      count = 0;
    }

    // 交叉右上
    myRow = rowIndex - 1;
    myClu = cluIndex + 1;
    count = 1;
    while (myRow >= 0 && myClu < chessLength) {
      if (this.chess[myRow][myClu] === currentChess) {  //  如果相等
        count++;
      }else {
        break;
      }
      myRow--;
      myClu++;
    }

    myRow = rowIndex + 1;
    myClu = cluIndex - 1;
    while (myRow < chessLength && myClu >= 0) {
      if (this.chess[myRow][myClu] === currentChess) {  //  如果相等
        count++;
      }else {
        break;
      }
      myRow++;
      myClu--;
    }

    if (!this.isFinish(count, chessLength)) {
      count = 0;
    }
  }

  // 是否游戏结束
  isFinish( count : number, chessLength : number ) : any {
    if (count === chessLength) {
      alert('游戏结束');
      // 然后重新开始，重置数组
      this.chess = [
        [0, 0, 0], 
        [0, 0, 0], 
        [0, 0, 0], 
      ];
    }else {
      return false;
    }
  }
  
}