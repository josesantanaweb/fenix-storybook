import type { Meta, StoryObj } from '@storybook/react'
import Icon from '@/src/components/V2/UI/Icon'

const meta = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'regular',
    name: 'settings',
  },
}
