import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import Button from '@/src/components/V2/UI/Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Connect your Wallet',
    iconPosition: 'right',
    iconClassName: 'icon-arrow-top-right',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Connect your Wallet',
    iconPosition: 'right',
    iconClassName: 'icon-arrow-top-right',
  },
}

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Connect your Wallet',
    iconPosition: 'right',
    iconClassName: 'icon-arrow-top-right',
  },
}

export const Green: Story = {
  args: {
    variant: 'green',
    children: 'Boost - 20s',
    iconPosition: 'right',
    iconClassName: 'icon-arrow-top-right',
  },
}

export const Red: Story = {
  args: {
    variant: 'red',
    children: 'Boost - 20s',
    iconPosition: 'right',
    iconClassName: 'icon-arrow-top-right',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Connect your Wallet',
  },
}
