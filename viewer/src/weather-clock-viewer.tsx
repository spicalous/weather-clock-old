import * as React from "react";
import { WithStyles, Theme, withStyles, createStyles } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import WeatherClock from "../../src/index";
import WeatherClockSettings from "./weather-clock-settings";

const styles = (theme: Theme): Record<string, {}> => createStyles({
  drawer: {
    display: "flex"
  },
  drawerContent: {
    flexGrow: 1
  },
  drawerFooter: {
    flexGrow: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: theme.spacing(0, 1),
  },
  button: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: theme.spacing(1)
  }
});

type Props = WithStyles<typeof styles>;
type State = { drawerOpen: boolean };

class WeatherClockViewer extends React.Component<Props, State> {
  
  private _weatherClock?: WeatherClock;

  constructor(props: Props) {
    super(props);
    this.state = { drawerOpen: false };
  }

  componentDidMount(): void {
    const containerElement = document.querySelector("#weather-clock-container");
    if (containerElement) {
      this._weatherClock = new WeatherClock(containerElement);
    }
  }

  toggleDrawer = (): void => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }

  onTemperatureUnitChange = (value: string) => {
    console.log("temperature unit changed", value);
  }

  render(): React.ReactNode {
    return (
      <>
        <div id="weather-clock-container"></div>
        <IconButton color="primary" className={this.props.classes.button} onClick={this.toggleDrawer}>
          <SettingsOutlinedIcon />
        </IconButton>
        <Drawer anchor="right" open={this.state.drawerOpen} onClose={this.toggleDrawer}>
          <div className={this.props.classes.drawerContent}>
            <WeatherClockSettings onTemperatureUnitChange={this.onTemperatureUnitChange}/>
            <Divider />
          </div>
          <div className={this.props.classes.drawerFooter}>
            <IconButton onClick={this.toggleDrawer}><ChevronRightIcon /></IconButton>
          </div>
        </Drawer>
      </>
    );
  }

}

export default withStyles(styles)(WeatherClockViewer);
