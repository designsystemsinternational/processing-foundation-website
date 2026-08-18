import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import { blockSpacings } from '@/lib/constants.ts';
import StatementList from './StatementList.astro';

const statements = [
  {
    title: 'Software as a medium',
    description:
      'We support the people who make software for the arts, and the artists who make work with it.',
  },
  {
    title: 'Access over expertise',
    description:
      'Tools should be learnable by anyone, not only by those already trained to use them.',
  },
  {
    title: 'Community first',
    description:
      'Our programs are shaped by the people who take part in them, in the places where they happen.',
  },
  {
    title: 'Intersectional',
    description:
      'At our core is the philosophy and politics of FLOSS (Free, Libre, Open Source Software).',
  },
];

export default {
  ...blockMeta,
  title: 'Blocks/StatementList',
  component: StatementList,
  argTypes: {
    ...blockMeta.argTypes,
    statementSpacing: {
      control: { type: 'select' },
      options: blockSpacings,
    },
  },
  args: {
    ...blockMeta.args,
    statements,
  },
};

/** No `statementSpacing`, so the statements inherit the block's own `spacing`. */
export const Default = {};

/** The page theme's `threadSpan`, which the Dividers inherit. */
export const ThreadSpanTwo = {
  args: { threadSpan: 2 },
};

export const SingleStatement = {
  args: { statements: statements.slice(0, 1) },
};

export const ManyStatements = {
  args: { statements: [...statements, ...statements, ...statements] },
};

/** `statementSpacing` set, so it diverges from the block's `spacing`. */
export const OverridesBlockSpacing = {
  args: { spacing: 'l', statementSpacing: 'xs' },
};

export const NoSpacing = {
  args: { statementSpacing: 'none' },
};

export const LongDescriptions = {
  args: {
    statements: statements.map((statement) => ({
      ...statement,
      description: `${statement.description} ${statement.description}`,
    })),
  },
};
