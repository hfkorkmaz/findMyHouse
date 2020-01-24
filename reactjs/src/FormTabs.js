import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import DiscreteSlider from "./FormSliders";
import MapWithASearchBox from "./MapWithASearchBox";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "700px",
    backgroundColor: theme.palette.background.paper
  }
}));

export default function SimpleTabs(props) {
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    props.changeTab(newValue);
  };

  const tabs = [];
  const tabPanels = [];
  props.tabs.forEach(tab => {
    tabs.push(<Tab label={`User ${tab + 1}`} key={tab} {...a11yProps(tab)} />);
    tabPanels.push(
      <TabPanel
        value={props.shownTab}
        key={tab}
        index={tab}
        style={{ color: "black" }}
      >
        Enter workplace/school location.
        <MapWithASearchBox key={tab} />

        <DiscreteSlider
          key={tab}
          index={tab}
          value={props.formValues[`${tab}`]}
          handleSliderChange={props.handleSliderChange}
        />
      </TabPanel>
    );
  });

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={props.shownTab}
          onChange={handleChange}
          aria-label="simple tabs example"
          variant="scrollable"
          scrollButtons="on"
        >
          {tabs}
        </Tabs>
      </AppBar>

      {tabPanels}
    </div>
  );
}
