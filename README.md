# react-pane

![screenshot](https://github.com/xiangminwang/react-pane/blob/master/screenshot.png)

[![NPM](https://img.shields.io/npm/v/react-pane.svg)](https://www.npmjs.com/package/react-pane) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-pane
```

## Usage

```tsx
import * as React from 'react'

import { PaneGroup, Pane } from 'react-pane'

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
