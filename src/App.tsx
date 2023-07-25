// 引入css
import "./App.css";
// 引入mobx模块，让数据响应式
import { observer } from "mobx-react-lite";
// 引入store
import useStore from "./Store/index";
// 引如antd中的组件
import { Button, Modal, Layout } from "antd";
// 引入React方法
import { useState } from "react";

const MyRow = observer(({ row, rowIndex, setIsGameOver }: any) => {
  /**
   * Row代表着每一行的数据，需要将row便利出来
   * @param rowIndex 每行的行索引，一共三行
   * @param row 每行的数据
	 * @param setIsGameOver 方法，设置最后提示框的显示与隐藏
   */
  // 获取实例并解构
  const { chessControl } = useStore();

  // 下子操作
  function handleClick(cluIndex: number) {
    if (chessControl.chessClick(rowIndex, cluIndex)) {
      // 代表赢了
			setIsGameOver(true);		//	将消息框显示
			chessControl.initChess();		//	重置棋盘
    }
  }

  return (
    <div className="row">
      {row.map((item, index) => {
        return (
          <Button
            key={index}
            onClick={() => {handleClick(index)}}
            className={item === 0 ? "" : item === 1 ? "black" : "white"}
          >
            {item === 0 ? "-" : item === 1 ? "黑" : "白"}
          </Button>
        );
      })}
    </div>
  );
});

function App() {
  // 获取实例并解构
  const { chessControl } = useStore();
  const [ isModalOpen, setIsModalOpen ] = useState(false);
	const [ isGameOver, setIsGameOver] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    chessControl.initChess();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

	const handleCancelGame = () => {
		setIsGameOver(false);
	}

  return (
    <Layout>
      <div className="chess">
        {chessControl.chess.map((item, index) => {
          // 将当前这一行的数据传过去，然后还需要将当前的行索引传过去
          return <MyRow setIsGameOver={setIsGameOver} key={index} row={item} rowIndex={index} />;
        })}
      </div>
      <Modal
        title="提醒"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>确定要重新开始吗</p>
      </Modal>
      <Button type="primary" onClick={handleClick} className="btn">
        重新开始
      </Button>
      <Modal
        title="游戏结束"
        open={isGameOver}
        onOk={handleCancelGame}
        onCancel={handleCancelGame}
      >
        <p>{ (chessControl.active === 1 ? '白' : '黑') }棋赢了</p>
      </Modal>
    </Layout>
  );
}

export default observer(App);
