import type { Meta, StoryObj } from '@storybook/react-vite';

import Swipebtn from '.';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'MyUi/animeFormation/Swipebtn',
  component: Swipebtn,
  parameters: {
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof Swipebtn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
