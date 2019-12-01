import React from "react";
//import "./NavBar.css";



class Site extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        // typeOfPlayer: players[state],
        // fitness: 0.5,
        // x_pos: i,
        // y_pos: 
        colors : {cooperator: "#00a12e",  //green 
                    defector: "#fc0303"} //red
    };
  }

  render() {
    const { colors} = this.state;
    const {typeOfPlayer, fitness, x_pos, y_pos, N} = this.props;

    const node_color = typeOfPlayer === "cooperator" ? colors.cooperator : colors.defector;
    return (
    <div className={N===100? "grid-item": "grid-itemXXL"} style={{backgroundColor  :node_color}} onClick={()=> this.props.switchStrategy(typeOfPlayer, fitness, x_pos, y_pos)}   >
          {N!==100 &&fitness}
    </div>
    );
  }
}

export default Site;
