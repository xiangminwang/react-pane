# react-panes

> A pane based layout manager for React, written in TypeScript!

[![NPM](https://img.shields.io/npm/v/react-panes.svg)](https://www.npmjs.com/package/react-panes) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-panes
```

## Usage

```tsx
import * as React from 'react'

import { PaneGroup, Pane } from 'react-panes'

class Layout extends React.Component {
  render () {
    return (
      <PaneGroup by="row">
        <Pane></Pane>
        <Pane></Pane>
        <Pane>
          <PaneGroup by="col">
            <Pane></Pane>
            <Pane></Pane>
          </PaneGroup>
        </Pane>
      </PaneGroup>
    )
  }
}
```

## License

MIT © [Xiangmin Wang](https://github.com/xiangminwang)
