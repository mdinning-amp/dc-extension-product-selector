import React from 'react';
import { makeStyles, MuiThemeProvider, Container } from '@material-ui/core';

import {theme} from './theme'
import ProductsGrid from './products-grid/ProductsGrid';
import SelectedProducts from './selected-products/SelectedProducts';
import SearchBox from './search-box/SearchBox';

// @TODO: Styling
// - transition for 'no items' and prods grid
// - hover states when selected or hovering over the title
// - fade out when removed when search again / change page
// - preserve order of items instead of using the order of items returned from the server
// @TODO: Refactor/error handling/params sanitisation
// @TODO: Handle product removed from DB; if length not same set touched set value...
//@TODO: Other functions should go outside components for testing
// @TODO: integrate other APIs

const styles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

// @TODO: 'setBackend' and set in state so that itema are fetched from the correct source

const App = params => {
  const classes = styles();
  return (
    <MuiThemeProvider theme={theme}>
      <Container className={classes.root}>
        <SelectedProducts />
        <SearchBox />
        <ProductsGrid />
      </Container>
    </MuiThemeProvider>
  );
}

export default App;
