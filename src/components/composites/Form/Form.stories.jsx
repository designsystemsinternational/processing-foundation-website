import Input from '@/components/primitives/Input';
import Selector from '@/components/primitives/Selector';

import { initSelector } from '@/components/primitives/Selector/selector.ts';

import Form from './Form.astro';
// storybook-astro's SSR render doesn't deliver CSS Modules on its own; these
// imports make Storybook's Vite bundle inject the stylesheets instead.
import '@/components/composites/Form/Form.module.css';

import './Form.module.css';

const topics = [
  { label: 'Organize', value: 'organize' },
  { label: 'Volunteer', value: 'volunteer' },
  { label: 'Offer a venue', value: 'venue' },
];

const field = (props) => ({
  component: Input,
  props: { size: 'small', surface: 'default', ...props },
});

const topic = {
  component: Selector,
  props: {
    label: 'Topic',
    name: 'topic',
    options: topics,
    showLabel: true,
    size: 'small',
    surface: 'default',
  },
};

const contactFields = [
  field({ label: 'First name', name: 'firstName' }),
  field({ label: 'Last name', name: 'lastName' }),
  field({
    label: 'Email',
    name: 'email',
    type: 'email',
    className: 'sm:col-start-1',
  }),
  topic,
];

const withFields = (fields) => (args) => ({
  component: Form,
  props: args,
  slots: { default: fields },
});

export default {
  title: 'Composites/Form',
  component: Form,
  subcomponents: { Input, Selector },
  args: { title: 'Submit this form', submitLabel: 'Send' },
  // Storybook's Astro renderer never runs a component's own hoisted <script>.
  play: async ({ canvasElement }) => {
    canvasElement.querySelectorAll('[data-selector]').forEach(initSelector);
  },
};

/** The field set ContactForm composes, so the two stay comparable. */
export const Default = {
  render: withFields(contactFields),
};

export const SingleColumn = {
  render: withFields(
    contactFields.map((c) => ({
      ...c,
      props: { ...c.props, className: 'col-span-2' },
    })),
  ),
};

export const WithoutTitle = {
  args: { title: undefined },
  render: withFields(contactFields),
};

export const CustomSubmitLabel = {
  args: { submitLabel: 'Get in touch' },
  render: withFields(contactFields),
};

export const SingleField = {
  render: withFields([field({ label: 'Email', name: 'email', type: 'email' })]),
};

export const TwoFields = {
  render: withFields([
    field({ label: 'First name', name: 'firstName' }),
    field({ label: 'Last name', name: 'lastName' }),
  ]),
};

export const MoreFields = {
  render: withFields([
    ...contactFields,
    field({
      label: 'Tell us more',
      name: 'message',
      multiline: true,
      className: 'sm:col-span-2',
    }),
  ]),
};
