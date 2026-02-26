import type { Meta, StoryObj } from '@storybook/react-vite';

import TextIntro from '.';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'MyUi/TextIntro',
  component: TextIntro,
  parameters: {
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof TextIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
