import React from "react";
import InputSlider from "./sliderButton";

class SliderMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        // cost: 1.24,
        // benefit: 1.62
    };
  
    }
    setBenefit (benefit) {
        this.setState({benefit});
    }
    setCost (cost) {
        this.setState({cost});
    }


  render() {
      const {benefit, cost} = this.props;
    return (
        <div>
            <div className="InputSliderWrapper"> 
                <InputSlider valueName="Benefit" defaultValue={benefit} setConfigurations={(benefit) => this.props.setConfigurations("null",benefit)}/>
            </div>
            <div className="InputSliderWrapper"> 
            <InputSlider valueName="Cost" defaultValue={cost} setConfigurations={(cost) => this.props.setConfigurations(cost,"null")}/>
            </div>
        </div>
        
    );
  }
}

export default SliderMenu;