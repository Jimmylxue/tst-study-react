import { useState } from 'react'


// 子组件
function Square({ value,onSquareClick }){
	return <button className='square' onClick={onSquareClick}>{value}</button>;
}

// 父组件
function Board({ xIsNext,squares,onPlay}){
	// const [xIsNext,setXIsNext] = useState(true);	//交替落子
	// // 创建了一个包含9个元素的数组
	// const [squares,setSquares] = useState(Array(9).fill(null));		//方块数组

	// 更新并保存棋盘state的squares数组
	function handleClick(i){
		if(squares[i] || calculateWinner(squares)){  //检查方块是否填满 或 是否获胜
			return;
		}
		const nextSquares = squares.slice();	 // 创建一个新的数组副本
		if(xIsNext){
			nextSquares[i] = "X";	//方块的索引
		}else{
			nextSquares[i] = "O";	//方块的索引
		}
		// setSquares(nextSquares);	//更新方块数组副本
		// setXIsNext(!xIsNext);

		onPlay(nextSquares);	//单击方块时更新Board
	}
	
	let flag = true;
	//遍历判断棋盘是否已满
	for (let i = 0;i<squares.length;i++){
		if(squares[i] === null){
			flag = false;
		}
	}

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
			
			<div className="board-row">
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
			</div>
		</>
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

//顶层组件
export default function Game(){
	//交替落子
	// const [xIsNext,setXIsNext] = useState(true);

	// [Array(9).fill(null)]是一个包含单个元素的数组，它本身是一个包含9个null的数组
	const [history,setHistory] = useState([Array(9).fill(null)]);	//方块数组
	//跟踪用户当前正在查看的步骤
	const [currentMove,setCurrentMove] = useState(0);
	const xIsNext = currentMove % 2 === 0;	// 下一个玩家是谁，可以根据currentMove计算出来

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

	const moves = history.map((squares,move)=>{		//squares参数遍历history的每个元素，move参数遍历每个数组索引
		let description;
		if(move>0){
			description = "回到第 " + move + " 步";
		}else{
			description = "开始游戏"
		}
		return (
			//落子不会被重新排序，删除或从中间插入，所以使用落子的索引作为key是安全的。
			<li key={move}>
				<button onClick={()=> jumpTo(move)}>{description}</button>
			</li>
		)
	})

	return (
		<div className='game'>
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
			</div>
			<div className="game-info">
				<ol>{moves}</ol>
			</div>
		</div>
	)
}
