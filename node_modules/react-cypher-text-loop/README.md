# React Cypher Text Loop Component

> A React component that accepts a list of strings and loops through them with a text cypher transition effect.

[![NPM](https://img.shields.io/npm/v/react-cypher-text-loop.svg)](https://www.npmjs.com/package/react-cypher-text-loop) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

### [**Live Demo**](https://cartermcalister.github.io/react-cypher-text-loop/)

## Install

```bash
npm i react-cypher-text-loop
```

## Usage

```jsx
import React, { Component } from 'react'

import CypherText from 'react-cypher-text-loop'

class Example extends Component {
  render() {
    return <CypherText textList={['React', 'Cypher', 'Text', 'Loop']} />
  }
}
```

## Properties

| Property       | Type   | Required | Default value                       | Description                                                    |
| :------------- | :----- | :------- | :---------------------------------- | :------------------------------------------------------------- |
| `textList`     | array  | yes      |                                     | Array of text to loop through.                                 |
| `delay`        | number | no       | 800                                 | Delay between switching to the next item.                      |
| `placeholders` | string | no       | "**\_\_\_\_**-\_\\/[]{}—=+\*^?#!<>" | Characters used for cypher effect when switching between text. |

---

## License

MIT © [Carter McAlister](https://github.com/CarterMcAlister)
