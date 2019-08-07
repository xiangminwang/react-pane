import React from 'react'
import { PaneGroup, Pane } from 'react-panes'

export default () => {
  return (
    <div style={{ margin: 0, padding: 0, height: 496, background: '#dedede', border: '2px solid #777' }}>
      <PaneGroup by="row">
        <Pane><h1>1</h1></Pane>
        <Pane><h1>2</h1></Pane>
        <Pane>
          <PaneGroup by="col">
            <Pane><h1>3</h1></Pane>
            <Pane><h1>4</h1></Pane>
          </PaneGroup>
        </Pane>
      </PaneGroup>
    </div>
  )
}
