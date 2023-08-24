import { useState } from 'react'
import { Button } from 'antd';
import 'antd/dist/antd.css'

// 子组件
function Square({ value,onSquareClick }){
	return <button className='square' onClick={onSquareClick}>{value}</button>;
}

// 父组件
function Board({ xIsNext,squares,onPlay}){
	// 更新并保存棋盘state的squares数组
	function handleClick(i){
		if(squares[i] || calculateWinner(squares)){  //检查方块是否填满 或 是否获胜
			return;
		}
		const nextSquares = squares.slice();	 // 创建一个新的数组副本
		nextSquares[i] = xIsNext ? 'X':'O';

		onPlay(nextSquares);	//单击方块时更新Board
	}

	let flag = true;
	//遍历判断棋盘是否已满
	for (let i = 0;i<squares.length;i++){
		if(squares[i] === null){
			flag = false;
		}
	}
	//判断是否平局或获胜者
	const winner = calculateWinner(squares);
	let status;
	if(winner){
		status = "赢的是：" + winner;
	}else{
		if(flag){
			status = "平局了";
		}else{
			status = "下一个玩家是：" + (xIsNext ? "X":"O");
		}
	}

	return (
		<>
			<div className="status">{status}</div>
			{/* ==============使用循环来渲染棋盘的格子============== */}
			{[0,1,2].map((row)=>(
				<div className="board-row" key={row}>
					{[0,1,2].map((col)=>{
						const index = 3 * row + col;
						return (
							<Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
						);
					})}
				</div>
			))}
			
			{/* ==============官网的方法渲染棋盘============== */}
			{/* <div className="board-row">
				<Square value={squares[0]} onSquareClick={() => handleClick(0)} />
				<Square value={squares[1]} onSquareClick={() => handleClick(1)} />
				<Square value={squares[2]} onSquareClick={() => handleClick(2)} />
			</div>
			<div className="board-row">
				<Square value={squares[3]} onSquareClick={() => handleClick(3)} />
				<Square value={squares[4]} onSquareClick={() => handleClick(4)} />
				<Square value={squares[5]} onSquareClick={() => handleClick(5)} />
			</div>
			<div className="board-row">
				<Square value={squares[6]} onSquareClick={() => handleClick(6)}  />
				<Square value={squares[7]} onSquareClick={() => handleClick(7)}  />
				<Square value={squares[8]} onSquareClick={() => handleClick(8)}  />
			</div> */}
		</>
	)

}



//顶层组件
export default function Game(){
	// [Array(9).fill(null)]是一个包含单个元素的数组，它本身是一个包含9个null的数组
	const [history,setHistory] = useState([Array(9).fill(null)]);	//方块数组
	//跟踪用户当前正在查看的步骤
	const [currentMove,setCurrentMove] = useState(0);
	// 下一个玩家是谁，可以根据currentMove计算出来
	const xIsNext = currentMove % 2 === 0;

	// //渲染当前落子的方块，需要从history中读取最后一个squares数组
	// const currentSquares = history[history.length - 1];

	//渲染当前选定的着法
	const currentSquares = history[currentMove];

	function handlePlay(nextSquares){
		//在所有项目之后添加它，只保留旧历史部分
		const nextHistory = [...history.slice(0,currentMove+1),nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length-1);	//指向最新的历史条目
		// setXIsNext(!xIsNext);
	}

	//跳转到过去
	function jumpTo(nextMove){
		setCurrentMove(nextMove);
		// setXIsNext(nextMove % 2 ===0);
	}

	//重新开始游戏
	function restartGame() {
		setHistory([Array(9).fill(null)]);
		setCurrentMove(0);
	}

	//跳转到指定的历史记录
	const moves = history.map((squares,move)=>{		//squares参数当前元素的值，move参数当前元素的索引值
		const desc = move ? 
			"回到第 " + move + " 步" : 
			"开始游戏";
		return (
			//落子不会被重新排序，删除或从中间插入，所以使用落子的索引作为key是安全的。
			<li key={move}>
				<button onClick={()=> jumpTo(move)}>{desc}</button>
			</li>
		)
	})

	return (
		<div className='game'>
        <Button>121212</Button>
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
				<button className="restart" onClick={restartGame}>重新开始</button>
			</div>
			<div className="game-info">
				<ol>{moves}</ol>
			</div>
		</div>
	)
}

//判断输赢的函数
function calculateWinner(squares) {
	const lines = [
	  [0, 1, 2],[3, 4, 5],[6, 7, 8],	//水平线
	  [0, 3, 6],[1, 4, 7],[2, 5, 8],	//垂直线
	  [0, 4, 8],[2, 4, 6]				//对角线
	];
	for (let i = 0; i < lines.length; i++) {
	  const [a, b, c] = lines[i];
	  //如果相等且不为null或undefined，则返回该取值
	  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
		return squares[a];
	  }
	}
	return null;
}
