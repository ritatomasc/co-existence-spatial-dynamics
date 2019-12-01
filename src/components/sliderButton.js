import React from "react";
import {withStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    width: 270
  },
  input: {
    width: 55
  }
});

function InputSlider({valueName,defaultValue , setConfigurations}) {
  //const {valueName} = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(defaultValue);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = event => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < -50) {
      setValue(-50);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="input-slider" gutterBottom>
      {valueName}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item />
        <Grid item xs>
          <Slider
            value={typeof value === "number" ? value : 0}
            min={0}
            max={100}
            step={0.01}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 0.01,
              min: 0,
              max: 100,
              type: "number",
              "aria-labelledby": "input-slider"
            }}
          />
        </Grid>
      </Grid>

      <Button variant="outlined" color="primary" onClick={() => setConfigurations(value)}> 
      Update
  </Button>
    </div>
  );
}

export default InputSlider;