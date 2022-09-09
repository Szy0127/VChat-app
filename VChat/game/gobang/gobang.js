import React, {useContext, useEffect, useState} from "react";
import {checkWin} from "./lib";
import {SocketContext} from "../../services/socketContext";
import { Toast } from "@ant-design/react-native";

const /**
     * 五子棋行数
     */
    ROW_COUNT = 15,
    /**
     * 五子棋列数
     */
    COL_COUNT = 15,
    /**
     * 值对应的显示文本
     */
    VALUE_TEXT = {
        0: "",
        1: "O",
        2: "X"
    };

/**
 * 创建原始数据
 */
function crateGridArr(row, col) {
    let outData = [],
        rowData = [];

    for (let i = 0; i < col; i++) {
        rowData.push(0);
    }
    for (let i = 0; i < row; i++) {
        outData.push(rowData.concat());
    }

    return outData;
}

// 栈，只存放设定长度的数据
class StepStack {
    constructor(maxLength) {
        this.maxLength = maxLength;
        this.stack = [];
    }

    push(item) {
        if (this.stack.length > this.maxLength) {
            this.shift();
        }
        this.stack.push(item);
    }

    shift() {
        if (this.stack.length > 0) {
            this.stack.shift();
        }
    }

    rollback(index) {
        return this.stack.splice(index);
    }

    stacks() {
        return this.stack.concat();
    }

    reset() {
        this.stack = [];
    }
}

/**
 * 棋子单元格
 */
function Square(props) {
    return (
        <label
            className={`square ${props.active ? "active" : ""}`}
            datarow={props.row}
            datacol={props.col}
        >
            {VALUE_TEXT[props.value]}
        </label>
    );
}

/**
 * 每一步的button
 */
function Step(props) {
    return (
        <li className="step" dataindex={props.index}>{`[${
            VALUE_TEXT[props.user]
        }] Moves To [${props.coordinate}]`}</li>
    );
}

/**
 * 五子棋
 */
function Gobang(props){


    // const {socket} = useContext(SocketContext);
    const socket = props.socket;
    // 生成15X15的网格数据，O:1，X:2
    let curUser = props.tag;

    const [grid,setGrid] = useState(crateGridArr(ROW_COUNT, COL_COUNT));
    const [steps,setSteps]=useState([]);
    const [canMove,setCanMove]=useState(curUser===1);

    let gameOver = false;
    let result = [];
    // 只保留最近20步的记录
    let stepStack = new StepStack(20);


    useEffect(()=> {
        socket.on('opponentMove', (data) => {
            console.log('opponent:', data.grid);

            setGrid(data.grid);
            setCanMove(true);

            let result=data.nodeList;

            setStaticState(data.nodeList);
            if (result && result.length === 5) alert("He Wins!!");
        })
    },[])

    const gobangMove=(data,result)=> {
        // console.log('me:', [x,y]);
        socket.emit('gobangMove', {
            opponent: props.opponentID,
            grid:data,
            nodeList:result
        })
    }

    /**
     * 下棋
     */
    const handleClick=(e)=> {
        if (!canMove) {
            Toast.fail("未到你的回合，请等待对方落子！", 3);
            return;
        }
        let target = e.target;
        if (gameOver || !target.getAttribute("datarow")) {
            return;
        }

        let row = +target.getAttribute("datarow"),
            col = +target.getAttribute("datacol");
        if (grid[row][col] !== 0) {
            console.log("当前单元格已被使用.");
            return;
        }

        let data = grid.concat();
        data[row][col] = curUser;
        addStack(row, col, curUser);
        let result = checkWin(data, row, col);

        gobangMove(data,result);

        setStaticState(result);

        setGrid(data);
        setSteps(stepStack.stacks());
        setCanMove(false);
        if (result && result.length === 5) alert("You Win!!");

    }

    const setStaticState=(result)=> {
        result = [];
        if (result && result.length === 5) {
            gameOver = true;
            result.forEach(item => {
                result.push(`${item.x}-${item.y}`);
            });
            console.log(result);
        } else {
            gameOver = false;
        }
    }

    /**
     * 添加记录
     */
    const addStack=(x, y, user)=> {
        stepStack.push({
            x,
            y,
            user
        });
    }

    /**
     * 悔棋
     */
    const rollback=(e)=> {
        if (e.target.className !== "step") {
            return;
        }

        let target = e.target,
            index = +target.getAttribute("dataindex");

        let rollData = stepStack.rollback(index + 1);
        if (rollData.length === 0) {
            return;
        }

        let data = grid.concat();
        rollData.forEach(item => {
            data[item.x][item.y] = 0;
        });

        setStaticState([], rollData[0].user);
        setGrid(data);
        setSteps(stepStack.stacks());
    }

    const reSet=()=> {
        setStaticState([], 1);
        stepStack.reset();
        setGrid(crateGridArr(ROW_COUNT, COL_COUNT));
        setSteps([]);
    }

        let text = gameOver
            ? `Winner: ${VALUE_TEXT[curUser === 1 ? 2 : 1]}`
            : `Next Player: ${VALUE_TEXT[curUser]}`;

        return (
            <div className="gomoku-box" onClick={e => handleClick(e)}>
                <div className="gomoku-bar">
                    <button onClick={reSet}>Restart</button>
                    <label>{text}</label>
                </div>

                <div className="game-box">
                    <div className="square-box">
                        {grid.map((row, i) => {
                            return (
                                <div key={i} className="square-row">
                                    {row.map((cell, j) => {
                                        let key = `${i}-${j}`;
                                        return (
                                            <Square
                                                key={key}
                                                active={gameOver && result.includes(key)}
                                                value={cell}
                                                row={i}
                                                col={j}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                    <ul className="step-box" onClick={e => rollback(e)}>
                        {steps.map((step, i) => {
                            let coordinate = `${step.x},${step.y}`;
                            return (
                                <Step
                                    key={coordinate}
                                    index={i}
                                    coordinate={coordinate}
                                    user={step.user}
                                />
                            );
                        })}
                    </ul>
                </div>
            </div>
        );

}

export default Gobang;
