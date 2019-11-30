import { createMuiTheme } from "@material-ui/core/styles";
import blueGrey from "@material-ui/core/colors/blueGrey";
import deepOrange from "@material-ui/core/colors/deepOrange";

export default createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: deepOrange,
    type: "dark"
  },
  typography: {
    h2: {
      fontSize: "1.1rem"
    }
  },
  overrides: {
    MuiAppBar: {
      root: {
        padding: 0,
        margin: 0
      }
    },
    MuiPaper: {
      root: {
        marginTop: "1.3rem",
        padding: "1rem"
      }
    }
  }
});
