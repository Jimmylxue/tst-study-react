// 引入css
import "./App.css";
// 引入mobx模块，让数据响应式
import { observer } from "mobx-react-lite";
// 引入store
import useStore from "./Store/index";
// 引如antd中的组件
import { Button, Space, Modal } from "antd";
// 引入React方法
import { useState } from "react";

const Row = observer(({ row, rowIndex }: any) => {
  /**
   * Row代表着每一行的数据，需要将row便利出来
   * @param rowIndex 每行的行索引，一共三行
   * @param row 每行的数据
   */
  // 获取实例并解构
  const { chessControl } = useStore();

  // 下子操作
  function handleClick(cluIndex: number) {
    // clu列索引
    chessControl.chessClick(rowIndex, cluIndex);
  }

  return (
    <div className="row">
      {row.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              handleClick(index);
            }}
          >
            {item === 0 ? "-" : item === 1 ? "O" : "X"}
          </button>
        );
      })}
    </div>
  );
});

function App() {
  // 获取实例并解构
  const { chessControl } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

	const handleOk = () => {
		console.log('确认');
		setIsModalOpen(false);
	}

	const handleCancel = () => {
		console.log('取消');
		setIsModalOpen(false);
	}

  return (
    <>
      <div className="chess">
        {chessControl.chess.map((item, index) => {
          // 将当前这一行的数据传过去，然后还需要将当前的行索引传过去
          return <Row key={index} row={item} rowIndex={index} />;
        })}
      </div>
      <Button type="primary" onClick={handleClick}>
        重新开始
      </Button>
      <Modal
        title="提醒"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>确定要重新开始吗</p>
      </Modal>
    </>
  );
}

export default observer(App);
