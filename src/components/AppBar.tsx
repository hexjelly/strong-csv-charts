import React, { FC, ChangeEvent, ReactElement } from "react";
import { AppBar as MaterialAppBar, Tabs, Tab } from "@material-ui/core";

export interface TabProps {
  label: string;
  icon?: ReactElement;
}

interface AppBarProps {
  value: number;
  handleChange: (event: ChangeEvent<{}>, value: number) => void;
  tabs: Array<TabProps>;
}

const AppBar: FC<AppBarProps> = ({ value, handleChange, tabs }) => (
  <MaterialAppBar position="static" color="primary">
    <Tabs
      value={value}
      onChange={handleChange}
      centered
      aria-label="tab menu navigation"
    >
      {tabs.map(tab => (
        <Tab label={tab.label} icon={tab.icon} key={tab.label} />
      ))}
    </Tabs>
  </MaterialAppBar>
);

export default AppBar;
