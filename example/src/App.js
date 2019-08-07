import React from 'react'
import { PaneGroup, Pane } from 'react-panes'

const style = {
  height: '100%',
  border: '2px solid #a7a7a7',
  boxSizing: 'border-box'
}

export default () => {
  return (
    <div style={style}>
      <PaneGroup by="row">
        <Pane>
          <PaneGroup by="col">
            <Pane></Pane>
            <Pane></Pane>
            <Pane></Pane>
            <Pane></Pane>
          </PaneGroup>
        </Pane>
        <Pane></Pane>
        <Pane></Pane>
      </PaneGroup>
    </div>
  )
}
