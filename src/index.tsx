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

const properlyDivide = (total: number, pieces: number) => {
  return { divider: Math.trunc(total / pieces), remainder: total % pieces }
}

const Spacer = (props: any) => <div className={styles.spacer} style={props.style}></div>

const Divider = (props: any) => <div className={styles.divider} style={props.style}></div>

const WrappedPane = (props: any) => {
  const { style, component } = props

  return (
    <div
      className={styles.pane}
      style={style}
    >
      {component.props.children}
    </div>
  )
}

export const Pane = (props: any) => <div className={styles.pane}>{props.children.props.children}</div>

export const PaneGroup = (props: Props) => {
  const { ref, width, height } = useComponentSize()

  const SPACER_THINKNESS = 1
  const DIVIDER_THINKNESS = props.dividerWidth ? props.dividerWidth : 2
  const rowSpliting = props.by === 'row'
  const siblings = props.children.length
  const children:React.ReactNode[] = []

  // Figure out actual box dimension by not including the dividers
  const boxStyle = {
    width: rowSpliting ? width - (siblings - 1) * DIVIDER_THINKNESS : width,
    height: rowSpliting ? height : height - (siblings - 1) * DIVIDER_THINKNESS,
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

  return (
    <div className={styles.paneGroup} ref={ref}>
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
            return (
              <Divider
                key={key}
                style={{
                  width: rowSpliting ? DIVIDER_THINKNESS : boxStyle.width,
                  height: rowSpliting ? boxStyle.height : DIVIDER_THINKNESS,
                }}
              />
            )
          }

          const passProps = {
            key,
            component: child,
            style: {
              width: rowSpliting ? divided.divider : boxStyle.width,
              height: rowSpliting ? boxStyle.height : divided.divider,
            }
          }

          return <WrappedPane {...passProps} />
        })
      }
    </div>
  )
}
