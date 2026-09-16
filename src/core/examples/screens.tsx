import React from 'react'
import {
  Button,
  Frame,
  Rectangle,
  Row,
  Stack,
  Text,
} from '../react'

void React

/**
 * Screen 1: Login Screen
 */
export function LoginScreen({ onNavigate }: { onNavigate?: (dest: string) => void }) {
  return (
    <Frame
      name="Login"
      id="Login"
      width={390}
      height={844}
      background="#0A0C0F"
      direction="vertical"
      justifyContent="space-between"
      padding={32}
    >
      {/* Top Branding */}
      <Stack gap={24} width="fill">
        <Row gap={12} alignItems="center">
          <Rectangle width={40} height={40} radius={10} fill="#1D9BF0" />
          <Text size={22} weight="bold" color="#FFFFFF">
            Wisal
          </Text>
        </Row>

        <Stack gap={8} width="fill">
          <Text size={32} weight="bold" color="#FFFFFF">
            Welcome back
          </Text>
          <Text size={15} color="#94A3B8">
            Enter your credentials to access your secure chat workspace.
          </Text>
        </Stack>

        {/* Input Fields */}
        <Stack gap={16} width="fill">
          <Stack gap={6} width="fill">
            <Text size={13} weight="medium" color="#CBD5E1">
              Email address
            </Text>
            <Frame
              name="Input / Email"
              width="fill"
              height={48}
              padding={{ left: 16, right: 16 }}
              radius={10}
              background="#16181C"
              stroke="#2F3336"
              strokeWidth={1}
              direction="horizontal"
              alignItems="center"
            >
              <Text size={14} color="#64748B">
                user@example.com
              </Text>
            </Frame>
          </Stack>

          <Stack gap={6} width="fill">
            <Text size={13} weight="medium" color="#CBD5E1">
              Password
            </Text>
            <Frame
              name="Input / Password"
              width="fill"
              height={48}
              padding={{ left: 16, right: 16 }}
              radius={10}
              background="#16181C"
              stroke="#2F3336"
              strokeWidth={1}
              direction="horizontal"
              alignItems="center"
            >
              <Text size={14} color="#64748B">
                ••••••••••••
              </Text>
            </Frame>
          </Stack>
        </Stack>
      </Stack>

      {/* Action Area with Prototype Navigation */}
      <Stack gap={12} width="fill">
        <Button
          name="ContinueButton"
          variant="primary"
          width="fill"
          onPress={
            onNavigate
              ? () => onNavigate('Dashboard')
              : { action: 'navigate', destination: 'Dashboard' }
          }
        >
          Continue to Dashboard
        </Button>
        <Text size={13} align="center" color="#64748B">
          Protected by end-to-end multi-layer encryption
        </Text>
      </Stack>
    </Frame>
  )
}

/**
 * Screen 2: Dashboard Screen
 */
export function DashboardScreen({ onNavigate }: { onNavigate?: (dest: string) => void }) {
  return (
    <Frame
      name="Dashboard"
      id="Dashboard"
      width={390}
      height={844}
      background="#0A0C0F"
      direction="vertical"
      justifyContent="space-between"
      padding={28}
    >
      <Stack gap={24} width="fill">
        {/* Header */}
        <Row justifyContent="space-between" width="fill">
          <Stack gap={4}>
            <Text size={13} color="#94A3B8">
              Welcome, Mohammed
            </Text>
            <Text size={26} weight="bold" color="#FFFFFF">
              Conversations
            </Text>
          </Stack>
          <Rectangle width={44} height={44} radius={22} fill="#1D9BF0" />
        </Row>

        {/* Quick Stats Grid */}
        <Row gap={12} width="fill">
          <Frame
            name="StatCard / Active"
            width="fill"
            padding={16}
            radius={14}
            background="#16181C"
            stroke="#2F3336"
            strokeWidth={1}
            direction="vertical"
            gap={6}
          >
            <Text size={12} color="#94A3B8">
              Active Chats
            </Text>
            <Text size={24} weight="bold" color="#FFFFFF">
              18
            </Text>
          </Frame>

          <Frame
            name="StatCard / Unread"
            width="fill"
            padding={16}
            radius={14}
            background="#16181C"
            stroke="#2F3336"
            strokeWidth={1}
            direction="vertical"
            gap={6}
          >
            <Text size={12} color="#94A3B8">
              Unread Messages
            </Text>
            <Text size={24} weight="bold" color="#1D9BF0">
              4
            </Text>
          </Frame>
        </Row>

        {/* Recent Channels */}
        <Stack gap={10} width="fill">
          <Text size={15} weight="semibold" color="#CBD5E1">
            Recent Channels
          </Text>

          {['Core Engineering', 'Design Systems', 'Product Announcements'].map((channel) => (
            <Row
              key={channel}
              name={`Channel / ${channel}`}
              width="fill"
              padding={14}
              radius={12}
              background="#16181C"
              justifyContent="space-between"
            >
              <Row gap={12}>
                <Rectangle width={32} height={32} radius={8} fill="#27272A" />
                <Stack gap={2}>
                  <Text size={14} weight="medium" color="#FFFFFF">
                    {channel}
                  </Text>
                  <Text size={12} color="#64748B">
                    Latest update 5m ago
                  </Text>
                </Stack>
              </Row>
              <Text size={12} color="#1D9BF0">
                Active
              </Text>
            </Row>
          ))}
        </Stack>
      </Stack>

      {/* Navigation Buttons */}
      <Stack gap={12} width="fill">
        <Button
          name="OpenSettingsButton"
          variant="secondary"
          width="fill"
          onPress={
            onNavigate
              ? () => onNavigate('Settings')
              : { action: 'navigate', destination: 'Settings' }
          }
        >
          Open Settings
        </Button>
        <Button
          name="SignOutButton"
          variant="outline"
          width="fill"
          onPress={
            onNavigate
              ? () => onNavigate('Login')
              : { action: 'navigate', destination: 'Login' }
          }
        >
          Back to Login
        </Button>
      </Stack>
    </Frame>
  )
}

/**
 * Screen 3: Settings Screen
 */
export function SettingsScreen({ onNavigate }: { onNavigate?: (dest: string) => void }) {
  return (
    <Frame
      name="Settings"
      id="Settings"
      width={390}
      height={844}
      background="#0A0C0F"
      direction="vertical"
      justifyContent="space-between"
      padding={28}
    >
      <Stack gap={24} width="fill">
        {/* Header with Back Navigation */}
        <Row gap={12} alignItems="center" width="fill">
          <Button
            name="BackButton"
            variant="secondary"
            width="hug"
            onPress={
              onNavigate
                ? () => onNavigate('Dashboard')
                : { action: 'navigate', destination: 'Dashboard' }
            }
          >
            ← Back
          </Button>
          <Text size={22} weight="bold" color="#FFFFFF">
            Settings
          </Text>
        </Row>

        {/* Options List */}
        <Stack gap={12} width="fill">
          {[
            { title: 'Privacy & Security', desc: 'Manage encryption keys and active sessions' },
            { title: 'Notifications', desc: 'Configure instant push alerts and sound triggers' },
            { title: 'Theme & Appearance', desc: 'Dark theme, typography and display density' },
            { title: 'Connected Devices', desc: 'Manage 3 active linked devices' },
          ].map((item) => (
            <Row
              key={item.title}
              name={`Setting / ${item.title}`}
              width="fill"
              padding={16}
              radius={14}
              background="#16181C"
              stroke="#2F3336"
              strokeWidth={1}
              justifyContent="space-between"
            >
              <Stack gap={3}>
                <Text size={15} weight="medium" color="#FFFFFF">
                  {item.title}
                </Text>
                <Text size={12} color="#64748B">
                  {item.desc}
                </Text>
              </Stack>
              <Text size={16} color="#64748B">
                ›
              </Text>
            </Row>
          ))}
        </Stack>
      </Stack>

      {/* Save / Return Button */}
      <Button
        name="SaveButton"
        variant="primary"
        width="fill"
        onPress={
          onNavigate
            ? () => onNavigate('Dashboard')
            : { action: 'navigate', destination: 'Dashboard' }
        }
      >
        Save & Return to Dashboard
      </Button>
    </Frame>
  )
}
