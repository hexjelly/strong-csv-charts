import React, { FC } from "react";
import { Box } from "@material-ui/core";

interface TabContentProps {
  value: number;
  index: number;
}

const TabContent: FC<TabContentProps> = ({ value, index, ...rest }) => (
  <Box hidden={value !== index} role="tabpanel" {...rest} />
);

export default TabContent;
