import React from 'react';
import { connect } from 'react-redux';
import { reject, slice, get } from 'lodash';
import { setSelectedItems } from '../actions';
import { makeStyles, FormHelperText } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {CSSTransition} from 'react-transition-group';

import Product from '../product/Product';
import { Paper, Typography, Box } from '@material-ui/core';

const styles = makeStyles(theme => ({
  root: {
    width: '100%',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
    boxSizing: 'border-box',
    overflow: 'hidden'
  },
  itemWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: theme.spacing(1)
  },
  dragItem: {
    flex: '1 1 20%',
    transition: 'flex 0.15s, opacity 0.15s',
    '&:empty': {
      flex: 0
    },
    '@media(min-width: 450px)': {
      maxWidth: '50%',
    },
    '@media(min-width: 800px)': {
      maxWidth: '25%',
    },
    '@media(min-width: 1024px)': {
      maxWidth: '20%',
    }
  },
  title: {
    fontWeight: 700
  },
  items: {
    position: 'relative',
    zIndex: 2
  },
  errorWrapper: {
    height: '20px'
  },
  error: {
    marginTop: 0,
    '&.errors-enter': {
      opacity: 0,
      transform: 'translate(0, -20px)'
    },
    '&.errors-enter-active': {
      opacity: 1,
      transform: 'translate(0, 0)',
      transition: 'opacity 0.3s, transform 0.3s'
    },
    '&.errors-exit-active': {
      opacity: 0,
      transform: 'translate(0, -20px)',
      transition: 'opacity 0.3s, transform 0.3s'
    }
  }
}));

const itemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  userSelect: 'none',
  opacity: isDragging ? 0.8 : 1
});

const SelectedProductsComponent = params => {
  const classes = styles();
  const {minItems, maxItems} = get(params.SDK, 'field.schema', {});

  const reorder = ({source, destination}) => {
    if (!destination) {
      return;
    }
    const itemToMove = params.selectedItems[source.index];
    const remainingItems = reject(params.selectedItems, {id:  itemToMove.id});
    params.setSelectedItems([
      ...slice(remainingItems, 0, destination.index),
      itemToMove,
      ...slice(remainingItems, destination.index)
    ]);
  };

  const items = params.selectedItems.map((item, index) => (
    <Draggable 
      key={item.id} 
      draggableId={item.id} 
      index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classes.dragItem}>
              <Product 
                style={itemStyle(snapshot.isDragging, provided.draggableProps.style)}
                className={classes.dragItem}
                item={item}
                variant="removable" />
            </div>
        )}
    </Draggable>
  ));

  const empty = (
    <Typography component="div" variant="body2">
      <Box fontWeight="fontWeightLight">No items selected.</Box>
    </Typography>);
  return (
    <Paper className={'selected-products ' + classes.root}>
      <Typography variant="subtitle1" component="h2" className={classes.title}>Selected products</Typography>
      <div className={classes.items}>
        <DragDropContext onDragEnd={reorder}>
          <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className={classes.itemWrapper}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >       
              {params.selectedItems.length ? items : empty}
              {provided.placeholder}
            </div>
          )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className={classes.errorWrapper}>
        <CSSTransition 
          in={params.touched && minItems && params.selectedItems.length < minItems} 
          timeout={300}
          unmountOnExit 
          classNames="errors"
        >
          <FormHelperText error={true} className={classes.error}>You must select a minimum of {minItems} items</FormHelperText>
        </CSSTransition>
        <CSSTransition 
          in={params.touched && maxItems && params.selectedItems.length > maxItems} 
          timeout={300}
          unmountOnExit
          classNames="errors"
        >
          <FormHelperText error={true} className={classes.error}>You must select a maximum of {maxItems} items</FormHelperText>
        </CSSTransition>
      </div>
    </Paper>
  );
}

const SelectedProducts = connect(
  state => ({
    selectedItems: state.selectedItems,
    SDK: state.SDK,
    touched: state.touched
  }),
  {setSelectedItems}
)(SelectedProductsComponent)

export default SelectedProducts;