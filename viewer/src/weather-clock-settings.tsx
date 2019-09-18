import * as React from "react";
import { WithStyles, Theme, withStyles, createStyles } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

const styles = (theme: Theme): Record<string, {}> => createStyles({
  formControl: {
    margin: theme.spacing(2, 1)
  }
});

interface Props extends WithStyles<typeof styles> {
  onTemperatureUnitChange: (unit: string) => void;
}
interface State {
  temperatureUnit: string;
}

class WeatherClockSettings extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { temperatureUnit: "celsius" };
  }

  onTemperatureChange = (event: React.ChangeEvent<{}>, value: string): void => {
    this.setState({ temperatureUnit: value });
    this.props.onTemperatureUnitChange(value);
  }

  render(): React.ReactNode {
    return (
      <>
        <FormControl component="fieldset" className={this.props.classes.formControl}>
          <FormLabel component="legend">Unit</FormLabel>
          <RadioGroup aria-label="temperature unit" name="temperature unit" value={this.state.temperatureUnit} onChange={this.onTemperatureChange}>
            <FormControlLabel value="celsius" control={<Radio color="primary" />} label="celsius" />
            <FormControlLabel value="fahrenheit" control={<Radio color="primary" />} label="fahrenheit" />
          </RadioGroup>
        </FormControl>
      </>
    );
  }

}

export default withStyles(styles)(WeatherClockSettings);