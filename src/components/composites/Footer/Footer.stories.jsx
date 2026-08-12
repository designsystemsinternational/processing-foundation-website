import Footer from './Footer.astro';

const socialLinks = [
  {
    title: 'Instagram',
    path: 'https://www.instagram.com/processingorg/',
    platform: 'instagram',
  },
  { title: 'X', path: 'https://x.com/processingOrg/', platform: 'x' },
  {
    title: 'YouTube',
    path: 'https://www.youtube.com/channel/UCeyJbY9g9spG7u8kfs2WrwQ',
    platform: 'youtube',
  },
  {
    title: 'Vimeo',
    path: 'https://vimeo.com/processingfoundation',
    platform: 'vimeo',
  },
  {
    title: 'Discord',
    path: 'https://discord.gg/mt2CnebPsJ',
    platform: 'discord',
  },
];

const legalLinks = [
  { title: 'Terms of Service', path: '/tos' },
  { title: 'Privacy Policy', path: '/privacy' },
];

export default {
  title: 'Components/Footer',
  component: Footer,
  args: {
    headline:
      'Celebrating 25 Years of promoting software in the arts and creativity in technology.',
    support: {
      title: 'Support our work',
      path: 'https://donorbox.org/support-the-processing-foundation',
    },
    socialLinks,
    newsletter: {
      helper: 'Sign up to our newsletter to know the latest',
      placeholder: 'Enter email address',
      label: 'Email address',
      submitLabel: 'Subscribe',
    },
    contact: {
      title: 'Contact us',
      email: 'foundation@processingfoundation.org',
    },
    copyright:
      '© 2026 Processing Foundation. Processing Foundation is a 501(c)(3) non-profit organization.',
    legalLinks,
  },
};

export const Default = {};

export const WithoutNewsletter = {
  args: { newsletter: undefined },
};

export const WithoutSocialLinks = {
  args: { socialLinks: [] },
};

/** Every prop is optional, so a footer with no content still renders. */
export const Empty = {
  args: {
    headline: undefined,
    support: undefined,
    socialLinks: [],
    newsletter: undefined,
    contact: undefined,
    copyright: undefined,
    legalLinks: [],
  },
};

/** A platform with no matching src/assets/social/<platform>.svg falls back to its title. */
export const MissingIcon = {
  args: {
    socialLinks: [
      ...socialLinks,
      {
        title: 'Bluesky',
        path: 'https://bsky.app/',
        platform: 'bluesky',
      },
    ],
  },
};
