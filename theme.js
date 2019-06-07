import { createMuiTheme } from '@material-ui/core/styles';
import {  } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});
console.log("Theme", theme)

export default theme;