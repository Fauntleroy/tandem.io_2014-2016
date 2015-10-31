import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';

import move from '../../utils/move.js';

import Item from './Item.jsx';

const NO_OP = () => {};

class List extends Component {
  static propTypes = {
    onSortStart: PropTypes.func,
    onSortChange: PropTypes.func,
    onSortEnd: PropTypes.func
  };
  static defaultProps = {
    onSortStart: NO_OP,
    onSortChange: NO_OP,
    onSortEnd: NO_OP
  };
  constructor( props ){
    super( props );
    this.moveItem = this.moveItem.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.state = {
      order: this.props.children.map(child => child.key)
    };
  };
  componentWillReceiveProps( next_props ){
    this.setState({
      order: next_props.children.map(child => child.key)
    });
  };
  onDragStart( index ){
    this.setState({
      start_index: index
    });
    this.props.onSortStart();
  };
  onDragEnd( index ){
    this.props.onSortEnd( this.state.start_index, index );
    this.setState({
      start_index: undefined
    });
  };
  moveItem( drag_index, hover_index ){
    var new_order = [ ...this.state.order ];
    move( new_order, drag_index, hover_index );
    this.setState({
      order: new_order
    });
    this.props.onSortChange( drag_index, hover_index );
  };
  render(){
    var classes = ' ' + this.props.className;
    var children = React.Children.toArray(this.props.children);
    children = this.state.order.map((key, index) => {
      // TODO determine if this is a brittle way to do this or not
      var child = _.find(children, child => child.key.indexOf(key) > -1);
      return React.cloneElement( child, {
        moveItem: this.moveItem,
        index: index,
        onDragStart: this.onDragStart,
        onDragEnd: this.onDragEnd
      });
    });
    return (
      <div className={classes}>
        {children}
      </div>
    );
  };
}

List = DragDropContext(HTML5Backend)(List);

export default List;
