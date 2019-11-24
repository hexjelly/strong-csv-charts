import React, { FC, useState, ChangeEvent } from "react";
import { CssBaseline, Container } from "@material-ui/core";

import ImportModule from "./modules/Import";
import AppBar from "./components/AppBar";
import TabContent from "./components/TabContent";

const tabs = [{ label: "Import" }];

const App: FC = () => {
  const [tab, setTab] = useState(0);

  const handleChange = (_event: ChangeEvent<{}>, index: number): void => {
    setTab(index);
  };

  return (
    <>
      <CssBaseline />
      <AppBar handleChange={handleChange} value={tab} tabs={tabs} />
      <Container>
        <TabContent value={tab} index={0}>
          <ImportModule />
        </TabContent>
      </Container>
    </>
  );
};

export default App;
