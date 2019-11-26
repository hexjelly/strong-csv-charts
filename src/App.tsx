import React, { FC, useState, ChangeEvent } from "react";
import { CssBaseline, Container } from "@material-ui/core";
import { CloudUpload, FitnessCenter } from "@material-ui/icons";
import { ThemeProvider } from "@material-ui/core/styles";

import ImportModule from "./modules/Import";
import AppBar from "./components/AppBar";
import TabContent from "./components/TabContent";
import theme from "./theme";
import StorageProvider from "./contexts/Storage";

const tabs = [
  { label: "Import", icon: <CloudUpload /> },
  { label: "PRs", icon: <FitnessCenter /> }
];

const App: FC = () => {
  const [tab, setTab] = useState(0);

  const handleChange = (_event: ChangeEvent<{}>, index: number): void => {
    setTab(index);
  };

  return (
    <StorageProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar handleChange={handleChange} value={tab} tabs={tabs} />
        <Container>
          <TabContent value={tab} index={0}>
            <ImportModule />
          </TabContent>
        </Container>
      </ThemeProvider>
    </StorageProvider>
  );
};

export default App;
