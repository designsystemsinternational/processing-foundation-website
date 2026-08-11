import NewsletterSignup from './NewsletterSignup.astro';

export default {
  title: 'Components/NewsletterSignup',
  component: NewsletterSignup,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['default', 'small'],
    },
  },
  args: {
    helper: 'Sign up to our newsletter to know the latest',
    placeholder: 'Enter email address',
    label: 'Email address',
    submitLabel: 'Subscribe',
  },
};

export const Default = {};

export const Small = {
  args: { size: 'small' },
};

export const LongHelper = {
  args: {
    helper:
      'Sign up to our newsletter to hear about fellowships, community days, and everything else the Foundation is working on',
  },
};

export const NoHelper = {
  args: {
    helper: '',
  },
};
