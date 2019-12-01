import React from "react";
import Site from "./Site";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        board: "",
        willUpdateBoard : false
    };
  }

  componentDidMount() {
    const { willUpdateBoard } = this.state;
    //this.createRandomLatice(N, players);
    const {generations} =  this.props;
    if (willUpdateBoard){
        this.interval = setInterval(() => this.props.multipleUpdate(), 1000);
        this.props.setGenerations(generations-1);
    }
    this.setState({willUpdateBoard:generations !== 0})
  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }
  

  updateBoard(board) {
    
    let _board = this.props.multipleUpdate(board);
    this.setState({board : _board });
  }

  renderLattice (board) {
    let _board = [];
    if (board === ""){
      _board = <div> Empty board</div>
    }else{
      for (var j= 0; j<board.length; j++){
        let line = [];
        for (var i= 0; i<board[j].length; i++){
          // var color = colors[Math.floor(Math.random()*colors.length)];
          line.push(<Site typeOfPlayer={board[j][i].typeOfPlayer} fitness={board[j][i].fitness} x_pos={i} y_pos={j} switchStrategy={this.switchStrategy} key={1+i*j}>  </Site>)
        }
        //_board.push(<div class="container-row" key={j}>{line} </div>);
        _board.push(<div className="container-row" key={j}>{line} </div>);
      }
    }
    return _board;
  }

  render() {
    const {board, generations} = this.props;
    //this.setState({willUpdateBoard : generations !== 0})
    return (
        <div className="grid-container">  {this.renderLattice(board)  }  </div>  
    );
  }
}

export default Board;
