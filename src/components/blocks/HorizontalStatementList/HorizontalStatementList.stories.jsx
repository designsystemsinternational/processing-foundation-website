import { blockMeta } from '@/components/storybook/storyDecorators.ts';
import HorizontalStatementList from './HorizontalStatementList.astro';

const statement = {
  title: 'Intersectional',
  description:
    'At our core is the philosophy and politics of FLOSS (Free, Libre, Open Source Software).',
};

export default {
  ...blockMeta,
  title: 'Blocks/HorizontalStatementList',
  component: HorizontalStatementList,
  args: {
    ...blockMeta.args,
    statements: [statement, statement, statement],
  },
};

/** Three statements, the arrangement the design is drawn at. */
export const Default = {};

export const SingleStatement = {
  args: { statements: [statement] },
};

export const TwoStatements = {
  args: { statements: [statement, statement] },
};

/** Past three, statements wrap onto a second line and the heights cycle. */
export const SixStatements = {
  args: { statements: Array.from({ length: 6 }, () => statement) },
};

export const LongDescriptions = {
  args: {
    statements: Array.from({ length: 3 }, () => ({
      ...statement,
      description: `${statement.description} ${statement.description}`,
    })),
  },
};
