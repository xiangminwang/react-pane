/**
 * @class PaneGroupComponent
 */

import * as React from 'react'
import { useComponentSize } from 'react-use-size/dist/useComponentSize'

import styles from './styles.css'

export type Props = {
  by: 'row' | 'col'
  dividerWidth: number
  children: React.ReactNode[]
}

type DeltaGroup = {
  [key: string]: number
}

type DividerProps = {
  style: object
  rowSpliting: boolean
  siblings: number
  deltaKey: number
  groupRef: React.RefObject<HTMLDivElement>
  delta: DeltaGroup
  setDelta: (arg: DeltaGroup) => void
}

// Contants
const MIN_SIZE = 10
const SPACER_THINKNESS = 1
const DIVIDER_THINKNESS = 2

const properlyDivide = (total: number, pieces: number) => {
  return { divider: Math.trunc(total / pieces), remainder: total % pieces }
}

const Spacer = (props: any) => <div className={styles.spacer} style={props.style}></div>

const Divider = (props: DividerProps) => {
  const handlerRef = React.useRef<HTMLDivElement>(null)
  const groupRef = props.groupRef
  const [ dragging, setDragging ] = React.useState(false)
  const [ prevPos, setPrevPos ] = React.useState({ x: 0, y: 0 })
  const [ currPos, setCurrPos ] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    if (!handlerRef || !handlerRef.current) return
    if (!groupRef || !groupRef.current) return

    const mouseDownHandler = (e: MouseEvent) => {
      setDragging(true)

      if (!prevPos.x && !currPos.x && !prevPos.y && !currPos.y) {
        setPrevPos({ x: e.pageX, y: e.pageY })
        setCurrPos({ x: e.pageX, y: e.pageY })
      }
    }

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!dragging) return

      if (window) {
        const selection = window.getSelection()
        selection && selection.removeAllRanges()
      }

      setCurrPos({ x: e.pageX, y: e.pageY })

      const delta = props.rowSpliting ? currPos.x - prevPos.x : currPos.y - prevPos.y

      if (Math.round(groupRef.current!.clientWidth / props.siblings) - Math.abs(delta) > MIN_SIZE) {
        props.setDelta({...props.delta, [props.deltaKey.toString()]: delta})
      }
    }

    const mouseUpHandler = () => {
      if (!dragging) return
      setDragging(false)
      setCurrPos({ x: 0, y: 0 })
    }

    handlerRef.current.addEventListener('mousedown', mouseDownHandler)
    groupRef.current.addEventListener('mousemove', mouseMoveHandler)
    groupRef.current.addEventListener('mouseup', mouseUpHandler)

    return () => {
      handlerRef.current!.removeEventListener('mousedown', mouseDownHandler)
      groupRef.current && groupRef.current.removeEventListener('mousemove', mouseMoveHandler)
      groupRef.current && groupRef.current.removeEventListener('mouseup', mouseUpHandler)
    }
  }, [handlerRef, dragging, prevPos, currPos])

  return (
    <div className={styles.divider} style={props.style}>
      <div ref={handlerRef} className={props.rowSpliting ? styles.rowHandler : styles.colHandler}></div>
    </div>
  )
}

const WrappedPane = (props: any) => {
  const { style, delta, deltaKey, component, rowSpliting } = props
  const beforeDividerKey = (deltaKey - 1).toString()
  const afterDividerKey = (deltaKey + 1).toString()

  if (delta.hasOwnProperty(beforeDividerKey)) {
    if (rowSpliting) {
      style.width -= delta[beforeDividerKey]
    } else {
      style.height -= delta[beforeDividerKey]
    }
  }

  if (delta.hasOwnProperty(afterDividerKey)) {
    if (rowSpliting) {
      style.width += delta[afterDividerKey]
    } else {
      style.height += delta[afterDividerKey]
    }
  }

  return <div className={styles.pane} style={style}>{component.props.children}</div>
}

export const Pane = (props: any) => <div className={styles.pane}>{props.children.props.children}</div>

export const PaneGroup = (props: Props) => {
  const { ref: groupRef, width, height } = useComponentSize()
  const [ delta, setDelta ] = React.useState<DeltaGroup>({})

  const dividerWidth = props.dividerWidth ? props.dividerWidth : DIVIDER_THINKNESS
  const rowSpliting = props.by === 'row'
  const siblings = props.children.length

  // Things that actually rendered
  const children:React.ReactNode[] = []

  // Figure out actual box dimension by not including the dividers
  const boxStyle = {
    width: rowSpliting ? width - (siblings - 1) * dividerWidth : width,
    height: rowSpliting ? height : height - (siblings - 1) * dividerWidth,
  }

  // Since offsetWidth / offsetHeight never being floats,
  // have to split the box by its childs + spacers
  const divided = properlyDivide(rowSpliting ? boxStyle.width : boxStyle.height, siblings)

  for (const child of props.children) {
    if (divided.remainder) {
      divided.remainder--
      children.push('spacer')
    }

    children.push(child)
    children.push('divider')
  }

  // Take the extra divider out
  children.pop()

  // Dict Key for neighbor-awareness
  let deltaKey = 0

  return (
    <div className={styles.paneGroup} ref={groupRef}>
      {
        children.map((child: React.ReactNode | string, key: number) => {
          if (typeof child === 'string' && child === 'spacer') {
            return (
              <Spacer
                key={key}
                style={{
                  width: rowSpliting ? SPACER_THINKNESS : boxStyle.width,
                  height: rowSpliting ? boxStyle.height : SPACER_THINKNESS,
                }}
              />
            )
          }

          if (typeof child === 'string' && child === 'divider') {
            const dividerProps = {
              key,
              delta,
              deltaKey: deltaKey++,
              setDelta,
              rowSpliting,
              siblings,
              groupRef,
              style: {
                width: rowSpliting ? dividerWidth : boxStyle.width,
                height: rowSpliting ? boxStyle.height : dividerWidth,
              }
            }

            return <Divider {...dividerProps}/>
          }

          const wrapperProps = {
            key,
            delta,
            deltaKey: deltaKey++,
            rowSpliting,
            component: child,
            style: {
              width: rowSpliting ? divided.divider : boxStyle.width,
              height: rowSpliting ? boxStyle.height : divided.divider,
            }
          }

          return <WrappedPane {...wrapperProps} />
        })
      }
    </div>
  )
}
