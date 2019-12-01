import React from "react";



class ConfigurationsBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        cost:"",
        benefit:""
    };
  }

  render() {
    const {cost, benefit, frequency, generations} = this.props;
    return (
    <div  className="ConfigBox"  >
  <div>  <div>  Cost: {cost}</div>
       <div>  Benefit: {benefit}</div></div>   
    <div>Frequency of cooperators: {frequency.toFixed(2)} %</div>
  <div>Iterations:  {generations}</div>
    </div>
    );
  }
}

export default ConfigurationsBox;
