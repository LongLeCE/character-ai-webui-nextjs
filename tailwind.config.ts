import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in-to': {
          '0%': {
            opacity: '0',
            transform: 'translate3d(0, -100%, 0)'
          }
        },
        'slide-out-to': {
          '100%': {
            opacity: '0',
            transform: 'translate3d(0, -100%, 0)'
          }
        },
        'slide-in-r': {
          '0%': {
            transform: 'translate3d(100%, 0, 0)'
          }
        },
        'slide-out-r': {
          '100%': {
            transform: 'translate3d(100%, 0, 0)'
          }
        }
      },
      animation: {
        'slide-in-to': 'slide-in-to 150ms ease-out both',
        'slide-out-to': 'slide-out-to 150ms ease-out both',
        'slide-in-r': 'slide-in-r 150ms ease-out both',
        'slide-out-r': 'slide-out-r 150ms ease-out both'
      }
    }
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        /* Hide scrollbar for Chrome, Safari and Opera */
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none'
        },
        /* Hide scrollbar for IE, Edge and Firefox */
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          /* IE and Edge */
          'scrollbar-width': 'none'
          /* Firefox */
        },
        '.size-screen': {
          width: '100vw',
          height: '100vh'
        },
        '.center-screen': {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate3d(-50%, -50%, 0)'
        }
      });
    }),
    plugin(({ addVariant }) => {
      addVariant('has-hover', '@media (hover: hover) and (pointer: fine)');
      addVariant('no-hover', '@media not all and (hover: hover) and (pointer: fine)');
    })
  ]
};
export default config;
