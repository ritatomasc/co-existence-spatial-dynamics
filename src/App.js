import React from 'react';
import './App.css';
import './components/Site';
import Site from './components/Site';
import {getRandomItem, getRandomInt} from  './utils';

import SliderMenu from './components/SliderMenu';
import ConfigurationsBox from "./components/ConfigurationsBox";
import Board from "./components/Board";
import StaticBoard from "./components/StaticBoard";
import { color } from '@material-ui/system';
import PlotLine from './components/PlotLine';

const data4 = require("./data/data4neighboors.json");
const data8 = require("./data/data8neighboors.json");
const hd4neighboors = require("./data/HD4neighboors.json");
const hd8neighboors = require("./data/HD8neighboors.json");

class App extends React.Component {
  constructor(props) {
    super(props);
    
  //variaveis
    this.state = {
      N: 100,
      cost: 1.24,
      benefit: 1.62,
      board: "",
      cooperatorsCount: 0,
      neighboorsNumber: 4,
      players: ["cooperator",  "defector"],
      colors : ["#fc0303", "#0011fa"],      
      games: ["sd", "pd"],
      selectedGame: "sd",
      generations: 0,
      updates: ["DeathBirth1",   "DeathBirth2",  "BirthDeath"],
      typeOfUpdate :  "DeathBirth1",
      frequencies: [ {r: "r", frequency: "frequency"}],
     
    }
    this.setConfigurations = this.setConfigurations.bind(this);
    this.switchStrategy= this.switchStrategy.bind(this);
    this.multipleUpdate= this.multipleUpdate.bind(this);
    
  }
  componentDidMount() {
    const { N } = this.state;
    //this.createRandomLatice(N, players);
    this.createRandomLatice(N);
  }

  getCooperatorFrequency(cooperatorsCount){
    const {N} = this.state;
    const frequency = (cooperatorsCount/ (N*N))*100;

    return frequency;

  }

  setConfigurations(newcost , newbenefit){
    const {cost, benefit} = this.state;
    const _cost = newcost !== "null" ? newcost : cost;
    const _benefit = newbenefit !== "null" ? newbenefit : benefit;
    this.setState({cost:_cost, benefit: _benefit});
  }

  calculatePayoff(strategy1, strategy2){
    const {selectedGame} = this.state;
    let payoff = 0;
    const { cost, benefit} = this.state;
    if (strategy1 === "cooperator" ){
      if (strategy2 === "cooperator"){
        if (selectedGame === "hd") {
          payoff =   (benefit /2); 
        }else{
          payoff =  selectedGame==="sd"? benefit -(cost/2)  :  (benefit - cost); 
        }
      }else if (strategy2 === "defector"){
        if (selectedGame === "hd") {
          payoff =  0; 
        }else{
          payoff = selectedGame==="sd"? benefit-cost : (-cost);
        }
      }
    }else if (strategy1 === "defector"){
      if (strategy2 === "cooperator"){        
        payoff = benefit;
      }else if (strategy2 === "defector"){
        if (selectedGame === "hd") {
          payoff =  (benefit - cost)/2; 
        }else{
          payoff = 0;
        }
       
      }
    }
    return payoff;
  }


 

  calculateStrategy(current_fitness, neighboors){
    const strategies = [];
    const weights = [];
    for (var i= 0; i<neighboors.length; i++){
      
      const diff =  neighboors[i].fitness - current_fitness;
      if (diff >= 0) {
        const  p= (1/(1+Math.exp(-diff)));
        weights.push(p) ;
        strategies.push(neighboors[i].typeOfPlayer);
      }
    }
  
    const newStrategy = getRandomItem(strategies, weights);

    return newStrategy;
  }

  calculateStrategy2(current_node, neighboors){ //metodo do paper
  
    let  weights = []
    const y = getRandomInt(0, neighboors.length);
 
    const neighboorRandom = neighboors[y];

    let diff =    neighboorRandom.fitness-  current_node.fitness ;
    const sum = neighboorRandom.fitness + current_node.fitness;

    let p = 0.5;
    if (diff > 0 && sum > 0 ){
      p=diff/sum;
    }
    else if(diff<0 && sum > 0 ){
      p = 0;
    }
    weights = [p, 1-p];  
    const strategies = [neighboorRandom.typeOfPlayer, current_node.typeOfPlayer];


    
    const newStrategy = getRandomItem(strategies, weights);
    
    return newStrategy;
  }


  switchStrategy(typeOfPlayer, fitness, x_pos, y_pos){
    let {board} =this.state;
    const newStrategy = typeOfPlayer === "cooperator" ? "defector"  :"cooperator";

    let _fitness = fitness;
    // const left = (x_pos!== board[y_pos].length-1) && board[y_pos][x_pos+1];
    // const right = (x_pos!== 0) && board[y_pos][x_pos-1];
    // const top = (y_pos!== 0) && board[y_pos-1][x_pos];
    // const bottom = (y_pos!== board.length-1) && board[y_pos+1][x_pos];
    
    // _fitness += left && this.calculatePayoff(newStrategy, left.typeOfPlayer);
    // _fitness += right && this.calculatePayoff(newStrategy, right.typeOfPlayer);
    // _fitness += top && this.calculatePayoff(newStrategy, top.typeOfPlayer);
    // _fitness += bottom && this.calculatePayoff(newStrategy, bottom.typeOfPlayer);

    board[y_pos][x_pos] = {
      typeOfPlayer: newStrategy,
      fitness: _fitness,
      x_pos,
      y_pos,
      }
    this.setState({board});
  }

  updateFitness(board){
   const {neighboorsNumber} = this.state;
    let _board = board;
    for (var j= 0; j<board.length; j++){
      let line = [];
      for (var i= 0; i<board[j].length; i++){
        const current_node = board[j][i];
      
        const right = (i!== board[j].length-1) && board[j][i+1];
        const left = (i!== 0) && board[j][i-1];
        const top = (j!== 0) && board[j-1][i];
        const bottom = (j!== board.length-1) && board[j+1][i];
        
        

        let _fitness = 0;
        if (neighboorsNumber === 8) {
          const leftTop =  (i!== 0 && j!== 0) && board[j-1][i-1];
          const rightTop =(i!== board[j].length-1 && j!== 0) && board[j-1][i+1];
          const leftBottom = ( i!== 0 && j!== board.length-1) && board[j+1][i-1];
          const rightBottom = (i!== board[j].length-1 && j!== board.length-1) && board[j+1][i+1];
          _fitness += leftTop && this.calculatePayoff(current_node.typeOfPlayer, leftTop.typeOfPlayer);
          _fitness += rightTop && this.calculatePayoff(current_node.typeOfPlayer, rightTop.typeOfPlayer);
          _fitness += leftBottom && this.calculatePayoff(current_node.typeOfPlayer, leftBottom.typeOfPlayer);
          _fitness += rightBottom && this.calculatePayoff(current_node.typeOfPlayer, rightBottom.typeOfPlayer);
        }
        _fitness += left && this.calculatePayoff(current_node.typeOfPlayer, left.typeOfPlayer);
        _fitness += right && this.calculatePayoff(current_node.typeOfPlayer, right.typeOfPlayer);
        _fitness += top && this.calculatePayoff(current_node.typeOfPlayer, top.typeOfPlayer);
        _fitness += bottom && this.calculatePayoff(current_node.typeOfPlayer, bottom.typeOfPlayer);
        
        _fitness = _fitness< 0 ? 0: _fitness;
        _board[j][i] = {typeOfPlayer: current_node.typeOfPlayer,
                    fitness: _fitness,
                    x_pos: i,
                    y_pos: j,
                    }
        // line.push({typeOfPlayer: current_node.typeOfPlayer,
        //           fitness: _fitness,
        //           x_pos: i,
        //           y_pos: j,
        //           })
      }       
      // _board.push(line);
    } 
    return _board;
  }

  imitationGame(board){
    const {typeOfUpdate, neighboorsNumber} =  this.state;
    let _board = [];
    let count = 0;
    for (var j= 0; j<board.length; j++){
      let line = [];
      for (var i= 0; i<board[j].length; i++){
        const current_node = board[j][i];
        const neighboors = [];
        let fitnessSum = 0;
        const right = (i!== board[j].length-1) && board[j][i+1];
        const left = (i!== 0) && board[j][i-1];
        const top = (j!== 0) && board[j-1][i];
        const bottom = (j!== board.length-1) && board[j+1][i];

        typeOfUpdate ==="DeathBirth1" && neighboors.push(current_node);
        left && neighboors.push(left);
        right && neighboors.push(right);
        top && neighboors.push(top);
        bottom && neighboors.push(bottom);


        if (neighboorsNumber === 8) {
          const leftTop =  (i!== 0 && j!== 0) && board[j-1][i-1];
          const rightTop =(i!== board[j].length-1 && j!== 0) && board[j-1][i+1];
          const leftBottom = ( i!== 0 && j!== board.length-1) && board[j+1][i-1];
          const rightBottom = (i!== board[j].length-1 && j!== board.length-1) && board[j+1][i+1];
         leftTop && neighboors.push( leftTop);
         rightTop && neighboors.push( rightTop);
         leftBottom && neighboors.push(leftBottom);
          rightBottom && neighboors.push(rightBottom);
        }

        const  _strategy = typeOfUpdate ==="DeathBirth2" ?this.calculateStrategy2(current_node, neighboors) :this.calculateStrategy(current_node.fitness, neighboors);
        count += _strategy === "cooperator" ? 1 : 0;  
        line.push({typeOfPlayer: _strategy,
                  fitness: current_node.fitness,
                  x_pos: i,
                  y_pos: j,
                  })
      }
      
      _board.push(line);
    } 
    this.setState({cooperatorsCount:count});
   return _board;
  } 

  takeOverGame(board){
    const {neighboorsNumber} = this.state;
    let _board = board;
    let count = 0;
    for (var j= 0; j<board.length; j++){
      let line = [];
      for (var i= 0; i<board[j].length; i++){
        const current_node = board[j][i];
        const neighboors = [];
        let fitnessSum = 0;
        const right = (i!== board[j].length-1) && board[j][i+1];
        const left = (i!== 0) && board[j][i-1];
        const top = (j!== 0) && board[j-1][i];
        const bottom = (j!== board.length-1) && board[j+1][i];

        //!birthDeadUpdate && neighboors.push(current_node);
        left && neighboors.push(left);
        right && neighboors.push(right);
        top && neighboors.push(top);
        bottom && neighboors.push(bottom);

        if (neighboorsNumber === 8) {
          
          const leftTop =  (i!== 0 && j!== 0) && board[j-1][i-1];
          const rightTop =(i!== board[j].length-1 && j!== 0) && board[j-1][i+1];
          const leftBottom = ( i!== 0 && j!== board.length-1) && board[j+1][i-1];
          const rightBottom = (i!== board[j].length-1 && j!== board.length-1) && board[j+1][i+1];
          leftTop && neighboors.push( leftTop);
          rightTop && neighboors.push( rightTop);
          leftBottom && neighboors.push(leftBottom);
           rightBottom && neighboors.push(rightBottom);
        }


        const y = getRandomInt(0, neighboors.length);
        const neighboorRandom = neighboors[y];

        let diff = current_node.fitness - neighboorRandom.fitness;
        const sum = neighboorRandom.fitness + current_node.fitness;

        let p = 0.5;
        if (diff > 0 && sum > 0 ){
          p=diff/sum;
        }
        else if(diff<0 && sum > 0 ){
          p = 0;
        }
       
        const weights = [1-p, p];  
        const actions = [neighboorRandom.typeOfPlayer, current_node.typeOfPlayer];
        const _strategy = getRandomItem(actions, weights);

        count += _strategy === "cooperator" ? 1 : 0;  
        _board[neighboorRandom.y_pos][neighboorRandom.x_pos] = {typeOfPlayer: _strategy,
          fitness: neighboorRandom.fitness,
          x_pos: neighboorRandom.x_pos,
          y_pos: neighboorRandom.y_pos,
          }
      }
      
 
    } 
    this.setState({cooperatorsCount:count});
   return _board;
  } 

  countCooperators(board){
    const {N} = this.state;
    let count = 0;
    for (var j= 0; j<board.length; j++){
      for (var i= 0; i<board[j].length; i++){
        const strategy = board[j][i].typeOfPlayer;
        count += strategy === "cooperator" ? 1 : 0;  
      
      }
    } 
   return count/(N*N);
  }

  updateLatice( N, colors, board) {  //delete this probably
    let _board = [];
    const count = 0;
    for (var j= 0; j<board.length; j++){
      let line = [];
      for (var i= 0; i<board[j].length; i++){
        const current_node = board[j][i];
        const neighboors = [];
        let _fitness = current_node.fitness;
        const left = (i!== board[j].length-1) && board[j][i+1];
        const right = (i!== 0) && board[j][i-1];
        const top = (j!== 0) && board[j-1][i];
        const bottom = (j!== board.length-1) && board[j+1][i];
        
        _fitness += left && this.calculatePayoff(current_node.typeOfPlayer, left.typeOfPlayer);
        _fitness += right && this.calculatePayoff(current_node.typeOfPlayer, right.typeOfPlayer);
        _fitness += top && this.calculatePayoff(current_node.typeOfPlayer, top.typeOfPlayer);
        _fitness += bottom && this.calculatePayoff(current_node.typeOfPlayer, bottom.typeOfPlayer);
    
        neighboors.push({typeOfPlayer: current_node.typeOfPlayer,
                        fitness: _fitness,
                        x_pos: i,
                        y_pos: j,
                        });
        left && neighboors.push(left);
        right && neighboors.push(right);
        top && neighboors.push(top);
        bottom && neighboors.push(bottom);

        const  _strategy = this.calculateStrategy(_fitness, neighboors);
        count += _strategy === "cooperator" ? 1 : 0;      
        line.push({typeOfPlayer: _strategy,
                  fitness: _fitness,
                  x_pos: i,
                  y_pos: j,
                  })
      }
      
      _board.push(line);
    } 
    this.setState({cooperatorsCount:count});
   return _board;
  }

  createSameStrategyLatice (N, typeOfPlayer) {
    let _board = [];
    
    for (var j= 0; j<N; j++){
      let line = [];
      for (var i= 0; i<N; i++){
       
        line.push({typeOfPlayer: typeOfPlayer,
                  fitness: 0,
                  x_pos: i,
                  y_pos: j,
                  })
      }
      //_board.push(<div class="container-row" key={j}>{line} </div>);
      _board.push(line);
    }
    const count = typeOfPlayer ==="cooperator" ? N*N : 0;
    this.setState({board : _board ,
        cooperatorsCount: count,
      generations: 0});
  }

  createRandomLatice (N) {
    const {players} = this.state;
    let _board = [];
    let count=  0;
    for (var j= 0; j<N; j++){
      let line = [];
      for (var i= 0; i<N; i++){
        // var color = colors[Math.floor(Math.random()*colors.length)];
        // line.push(<Site color={color}/>)
        var state = Math.floor(Math.random()*players.length);
        //var state = (i+j)%2;
        count += players[state] === "cooperator" ? 1 : 0;
        line.push({typeOfPlayer: players[state],
                  fitness: 0,
                  x_pos: i,
                  y_pos: j,
                  })
      }
      //_board.push(<div class="container-row" key={j}>{line} </div>);
      _board.push(line);
    }
  
    this.setState({board : _board ,
             cooperatorsCount: count,
             generations: 0});
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
          line.push(<Site N={board.length} typeOfPlayer={board[j][i].typeOfPlayer} fitness={board[j][i].fitness} x_pos={i} y_pos={j} switchStrategy={this.switchStrategy} key={1+i*j}>  </Site>)
        }
        //_board.push(<div class="container-row" key={j}>{line} </div>);
        _board.push(<div className="container-row" key={j}>{line} </div>);
      }
    }
    return _board;
  }

  multipleUpdate(board, numberOfUpdates) {
    const {generations, typeOfUpdate} = this.state;
    let _board = board;
    for (var i= 0 ; i<numberOfUpdates; i++){
      //_board = this.updateLatice(N,colors, _board);
     
      _board = typeOfUpdate ==="BirthDeath" ? this.takeOverGame(_board) :this.imitationGame(_board);
      _board=  this.updateFitness(_board);
   
    }

    this.setState({board : _board ,
    generations: generations+numberOfUpdates});
   //return _board;
  }

  FindEquilibriumFrequency (board ) {
    const {typeOfUpdate, selectedGame ,frequencies, cost, benefit, generations} = this.state;
    let _frequencies = frequencies;
    const r =selectedGame==="hd"? (benefit/cost) : cost/ (2* benefit- cost);
    let _board = board;
    for (var i= 0 ; i<1000; i++){
      _board = typeOfUpdate ==="BirthDeath" ? this.takeOverGame(_board) :this.imitationGame(_board);
      _board=  this.updateFitness(_board);
    }

    let frequencySum= this.countCooperators(_board)*100;

    for (var i= 0 ; i<5000; i++){
      _board = typeOfUpdate ==="BirthDeath" ? this.takeOverGame(_board) :this.imitationGame(_board);
      _board=  this.updateFitness(_board);
      const _newFreq = this.countCooperators(_board)*100;
     
      frequencySum= frequencySum + _newFreq;
      
    }
    
    const freq  = frequencySum/5001;
    
    _frequencies.push( {r, frequency: freq });
    this.setState({board : _board, frequencies: _frequencies, generations: generations+1000+5000 });
    
  }

  selectPrisionersDillemaGame() {
    const {N} = this.state;
    this.createRandomLatice(N);
    this.setState({
      selectedGame: "pd"
    });
  }
  selectSnowdriftGame(){
    const {N} = this.state;
    this.createRandomLatice(N);
    this.setState({
      selectedGame: "sd"
    });
  }
  selectHawkDoveGame(){
    const {N} = this.state;
    this.createRandomLatice(N);
    this.setState({
      selectedGame: "hd"
    });
  }
  setBirthDead(mode){
    this.setState({typeOfUpdate: mode})
  }
  setPattern(N){
    this.createRandomLatice(N);
    this.setState({N});
  }
  setNumberOfNeighbors(number){
    const {N} = this.state;
    this.createRandomLatice(N);
    this.setState({neighboorsNumber : number});
  }

  renderFrequencies(frequencies){
    let output = []
    for (var i =0; i< frequencies.length; i++){
        output.push(   
          <div key={i}> {frequencies[i].r}  ----  {frequencies[i].frequency}  </div>
        );
    }
    return output;
  }
  render() {
    const { N,neighboorsNumber ,generations , players, board, cost, benefit, cooperatorsCount, frequencies, selectedGame, typeOfUpdate} = this.state;
   
    return (
      <div className="App">
        <div className="ExperienceContainer"> 
        <div className="ExperienceWrapper"> 
         <div className="Latice">

           <div className="grid-container">  {this.renderLattice(board)  }  </div>  
           {/* <Board board={board}  multipleUpdate={() => this.multipleUpdate(N,colors, board, 1)} generations={generations}/> */}
         <ConfigurationsBox cost={cost} benefit={benefit} frequency={this.getCooperatorFrequency(cooperatorsCount)}  generations={generations}/>
         </div>
        <div className="Commands"> Pattern Size:
          <div className="ButtonsWrapper"> 
            <div className={N!==100 ? "NormalButton": "SelectedButton"}  onClick={()=> this.setPattern(100 )}> 100 x 100 Pattern</div>
            <div className={N===100 ? "NormalButton": "SelectedButton"}   onClick={()=> this.setPattern(7)}> Microscopic Pattern</div>   
            </div>
          Number of neighboors:
          <div className="ButtonsWrapper"> 
              <div className={neighboorsNumber !== 4? "NormalButton": "SelectedButton"}  onClick={()=> this.setNumberOfNeighbors(4)}> 4 closest neighboors</div>
              <div className={neighboorsNumber !== 8? "NormalButton": "SelectedButton"}   onClick={()=> this.setNumberOfNeighbors(8)}> 8 closest neighboors</div>
          </div>
          Type of update:
          <div className="ButtonsWrapper"> 
            <div className={typeOfUpdate!=="DeathBirth1" ? "NormalButton": "SelectedButton"}  onClick={()=> this.setBirthDead("DeathBirth1" )}> Death -> Birth (with all neighboors)</div>
            <div className={typeOfUpdate !== "DeathBirth2" ? "NormalButton": "SelectedButton"}  onClick={()=> this.setBirthDead("DeathBirth2" )}> Death -> Birth (with only one neighboor)</div>
            <div className={typeOfUpdate !== "BirthDeath" ? "NormalButton": "SelectedButton"}   onClick={()=> this.setBirthDead( "BirthDeath")}> Birth -> Death</div>
        </div> Choose a Game: 
        <div className="ButtonsWrapper">
          <div className={selectedGame !=="pd" ? "NormalButton": "SelectedButton"}  onClick={()=> this.selectPrisionersDillemaGame( )}> Prisioner's Dillema</div>
          <div className={selectedGame !=="sd" ? "NormalButton": "SelectedButton"}   onClick={()=> this.selectSnowdriftGame( board, 10)}> Snowdrift</div>
          <div className={selectedGame !=="hd" ? "NormalButton": "SelectedButton"}   onClick={()=> this.selectHawkDoveGame()}> Hawk Dove</div>
       </div>
        <div className="ButtonsWrapper"> 
          <div className="NormalButton" onClick={()=> this.multipleUpdate( board, 1)}> Update Latice</div>
          <div className="NormalButton"  onClick={()=> this.multipleUpdate( board, 10)}> Update Latice x10</div>
          <div className="NormalButton"  onClick={()=> this.multipleUpdate( board, 100)}> Update Latice x100</div>
        </div>
        {/* <div className="ButtonsWrapper"> 
          <div className="NormalButton" onClick={()=> this.multipleRelax(N, board, 1)}> Relaxation Time</div>
          <div className="NormalButton"  onClick={()=> this.multipleRelax(N, board, 100)}> Relaxation Time x100</div>
          <div className="NormalButton"  onClick={()=> this.multipleRelax(N,board, 500)}> Relaxation Time x500</div>
        </div> */}
      

        <div className="ButtonsWrapper"> 
        <div className="NormalButton" style={{backgroundColor  :"lightsalmon"}} onClick={()=> this.createRandomLatice(N, players)}> Reset</div>
        <div className="NormalButton" style={{backgroundColor  :"darksalmon"}}  onClick={()=> this.createSameStrategyLatice(N, players[1])}> All defectors</div>
        <div className="NormalButton" style={{backgroundColor  :"lightgreen"}}  onClick={()=> this.createSameStrategyLatice(N, players[0])}> All Cooperators</div>
        </div>
        <SliderMenu cost={cost} benefit={benefit} setConfigurations={(newcost, newbenefit) => this.setConfigurations(newcost,newbenefit)}/>
    
        {/* <div className="ButtonsWrapper"> 
          <div className="NormalButton" onClick={()=> this.FindEquilibriumFrequency(board)}> Get Average</div>
      <div> {this.renderFrequencies(frequencies)}</div>
        </div> */}
        </div>
        </div>
        </div>
        <div className="PlotContainer">   <PlotLine data={data4} />Frequency  of  cooperators in the Snowdrift game in a Lattice with N=4</div> 
        <div className="PlotContainer">   <PlotLine data={data8} /> Frequency  of  cooperators in the Snowdrift game in a Lattice with N=8</div> 
        <div className="PlotContainer">   <PlotLine data={hd4neighboors} /> Frequency  of  cooperators in the Hawk - Dove game in a Lattice with N=4</div> 
        <div className="PlotContainer">   <PlotLine data={hd8neighboors} /> Frequency  of  cooperators in the Hawk - Dove game in a Lattice with N=8</div> 
        
      </div>
      //(page !=="login") ? this.renderGame(page) : this.renderLogin()
      
    );
  }
}

export default App;
