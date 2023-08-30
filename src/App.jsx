import { useEffect, useState } from "react";
import { Button, Modal } from "antd";

// 子组件
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// 父组件
function Board({ xIsNext, squares, onPlay, onRestart }) {
  // 更新并保存棋盘state的squares数组
  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) {
      //检查方块是否填满 或 是否获胜
      return;
    }
    const nextSquares = squares.slice(); // 创建一个新的数组副本
    nextSquares[i] = xIsNext ? "X" : "O";

    onPlay(nextSquares); //单击方块时更新Board
  };

  const [isSquareFull, setSquareFull] = useState(false);
  const [status, setStatus] = useState(null);
  const [winner, setWinner] = useState(null);

  const onSquareCheckFunc = () => {
    // 遍历判断棋盘是否已满
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        setSquareFull(false);
      }
    }
  };

  useEffect(() => {
    onSquareCheckFunc();

    setWinner(calculateWinner(squares));
    calculateStatus();
  }, [squares, status]);

  const calculateStatus = () => {
    //判断status
    if (winner) {
      setStatus("赢的是：" + winner);
    } else {
      if (isSquareFull) {
        setStatus("平局了");
      } else {
        setStatus("下一个玩家是：" + (xIsNext ? "X" : "O"));
      }
    }
  };

  return (
    <>
      <div className="status">{status}</div>
      {/* ==============使用循环来渲染棋盘的格子============== */}
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const index = 3 * row + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
      <Button type="primary" onClick={onRestart}>
        重新开始
      </Button>
    </>
  );
}

//顶层组件
export default function Game() {
  // [Array(9).fill(null)]是一个包含单个元素的数组，它本身是一个包含9个null的数组
  const [history, setHistory] = useState([Array(9).fill(null)]); //方块数组
  //跟踪用户当前正在查看的步骤
  const [currentMove, setCurrentMove] = useState(0);
  // 下一个玩家是谁，可以根据currentMove计算出来
  const xIsNext = currentMove % 2 === 0;

  //渲染当前选定的着法
  const currentSquares = history[currentMove];

  const [winnerName, setWinnerName] = useState(null); // 添加获胜者名称变量

  const handlePlay = (nextSquares) => {
    //在所有项目之后添加它，只保留旧历史部分
    //向数组中插入元素：插入点之前的元素
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1); //指向最新的历史条目

    // 判断获胜者
    const winner = calculateWinner(nextSquares);
    if (winner) {
      setWinnerName(winner); // 设置获胜者名称
    }
  };

  //跳转到过去
  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  //跳转到指定的历史记录
  const moves = history.map((squares, move) => {
    //squares参数当前元素的值，move参数当前元素的索引值
    const desc = move ? "回到第 " + move + " 步" : "开始游戏";
    return (
      //落子不会被重新排序，删除或从中间插入，所以使用落子的索引作为key是安全的。
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  //设置重新开始游戏
  const restart = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  };
  //游戏结束处理
  const end = () => {
    setWinnerName(null);
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setIsModalOpen(false);
  };
  //  通用对话框
  const dialog = (title, diaFlag, content) => {
    return Modal.confirm({
      title: title,
      content: content,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        switch (diaFlag) {
          case "restart":
            restart();
            break;
          case "end":
            end();
            break;
        }
      },
    });
  };

  const handleRestart = () => {
    dialog("确认", "restart", "确定重新开始游戏吗？");
  };

  useEffect(() => {
    if (winnerName !== null) {
      dialog("游戏结束", "end", "恭喜获胜者：" + winnerName);
    }
  }, [winnerName]);

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          onRestart={handleRestart}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

//判断输赢的函数
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], //水平线
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], //垂直线
    [0, 4, 8],
    [2, 4, 6], //对角线
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    //如果相等且不为null或undefined，则返回该取值
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};
