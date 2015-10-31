import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

const NO_OP = () => {};

const sort_source = {
  beginDrag: function( props ){
    if( props.onDragStart ){
      props.onDragStart( props.index );
    }
    return {
      index: props.index
    };
  },
  endDrag: function( props ){
    if( props.onDragEnd ){
      props.onDragEnd( props.index );
    }
  }
};

const sort_target = {
  hover: function( props, monitor, component ){
    const drag_index = monitor.getItem().index;
    const hover_index = props.index;

    // Don't replace self
    if( drag_index === hover_index ){
      return;
    }

    const hover_bound = findDOMNode( component ).getBoundingClientRect();
    const hover_middle_y = (hover_bound.bottom - hover_bound.top) / 2;
    const client_offset = monitor.getClientOffset();
    const hover_client_y = client_offset.y - hover_bound.top;

    if( drag_index < hover_index && hover_client_y < hover_middle_y ){
      return;
    }

    if( drag_index > hover_index && hover_client_y > hover_middle_y ){
      return;
    }

    props.moveItem( drag_index, hover_index );
    monitor.getItem().index = hover_index;
  }
};

class Item extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    children: PropTypes.any.isRequired,
    moveItem: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func
  };
  static defaultProps = {
    onDragStart: NO_OP,
    onDragEnd: NO_OP
  };
  render(){
    const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
    const style = {
      visibility: isDragging ? 'hidden' : 'visible'
    };
    return connectDragSource(connectDropTarget(
      <div>
        {this.props.children}
      </div>
    ));
  };
};

Item = DropTarget('item', sort_target, function( connect ){
  return {
    connectDropTarget: connect.dropTarget()
  };
})(Item);
Item = DragSource('item', sort_source, function( connect, monitor ){
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
})(Item);

export default Item;
