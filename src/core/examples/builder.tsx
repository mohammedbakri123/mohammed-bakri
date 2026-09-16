import React from 'react'
import type { AppDefinition, ComponentNodeIR, FrameNodeIR } from '../ir'
import { parseColor } from '../ir'
import { renderToUINode } from '../react'
import { DashboardScreen, LoginScreen, SettingsScreen } from './screens'

void React

/**
 * Reusable Button Component Definition for Figma Component Registry
 */
export function createButtonComponentDefinition(): ComponentNodeIR {
  return {
    type: 'component',
    name: 'Button',
    componentName: 'Button',
    layout: {
      direction: 'horizontal',
      gap: 8,
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 24,
      paddingRight: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    style: {
      fill: parseColor('#1D9BF0'),
      cornerRadius: 10,
    },
    children: [
      {
        type: 'text',
        name: 'label',
        content: 'Button',
        style: {
          fontSize: 15,
          fontWeight: 'semibold',
          color: parseColor('#FFFFFF'),
          textAlign: 'center',
        },
      },
    ],
  }
}

/**
 * Compiles the 3 React screens and reusable Button into a full AppDefinition
 */
export function buildAppDefinition(): AppDefinition {
  const loginRoot = renderToUINode(<LoginScreen />) as FrameNodeIR
  const dashboardRoot = renderToUINode(<DashboardScreen />) as FrameNodeIR
  const settingsRoot = renderToUINode(<SettingsScreen />) as FrameNodeIR

  const buttonComponent = createButtonComponentDefinition()

  return {
    name: 'Wisal Chat App • React to Figma',
    components: [buttonComponent],
    screens: [
      {
        id: 'Login',
        name: 'Login Screen',
        root: loginRoot,
      },
      {
        id: 'Dashboard',
        name: 'Dashboard Screen',
        root: dashboardRoot,
      },
      {
        id: 'Settings',
        name: 'Settings Screen',
        root: settingsRoot,
      },
    ],
  }
}
