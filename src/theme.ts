import { createMuiTheme } from '@material-ui/core/styles';
import { deepOrange, indigo } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: deepOrange,
    secondary: indigo
  },
});

export default theme;