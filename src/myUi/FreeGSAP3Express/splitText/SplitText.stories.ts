import type { Meta, StoryObj } from '@storybook/react-vite';

import SplitText from '.';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'MyUi/FreeGSAP3Express/SplitText',
  component: SplitText,
  parameters: {
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof SplitText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
