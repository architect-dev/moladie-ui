import { createGlobalStyle, css } from 'styled-components'
import { PancakeTheme } from '@uikit'

declare module 'styled-components' {
	/* eslint-disable @typescript-eslint/no-empty-interface */
	export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: Andale Mono, monospace;
    /* -ms-interpolation-mode: nearest-neighbor;
    image-rendering: -moz-crisp-edges;
    image-rendering: pixelated; */
  }
  html {
    width: 100%;
    min-width: 100%;
    min-height: 100%;
    /* overflow-x: hidden; */
  }
  body {
    display: flex;
    position: relative;
    top: 0;
    left: 0;
    margin: 0;
    min-height: 100vh;
    min-width: 100vw;

    background-color: ${({ theme }) => theme.colors.background};
    transition: 200ms background-color;

    ::-webkit-scrollbar { /* Chrome */
        display: none;
    }
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* Internet Explorer 10+ */

    img {
      height: auto;
      max-width: 100%;
    }
  }

  #root {
    min-width: 100vw;
    min-height: 100vh;
  }

  
  .popup-overlay {
    backdrop-filter: blur(1px);

    :before {
      content: ' ';
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
      isolation: isolate;

      ${({ theme }) =>
				theme.isDark
					? css`
							isolation: isolate;
							mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100% 100%' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
							background-image: radial-gradient(circle at bottom right, hsl(328 100% 54%) 0%, hsl(328 100% 54% / 0%) 150%),
								url("data:image/svg+xml,%3Csvg viewBox='0 0 100% 100%' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
							filter: brightness(0.4);
					  `
					: css`
							isolation: isolate;
							mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100% 100%' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
							background-image: radial-gradient(circle at bottom right, hsl(328 100% 54%) 0%, hsl(328 100% 54% / 0%) 150%),
								url("data:image/svg+xml,%3Csvg viewBox='0 0 100% 100%' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
							filter: brightness(0.9);
					  `}
    }
  }

  .popup-overlay.mild-overlay {
    opacity: 0.5;
    backdrop-filter: none;
  }

  .popup-arrow {
    color: ${({ theme }) => theme.colors.background};
    top: 1px;
  }
  .popup-content {
    border-radius: 4px;
  }
  [role='tooltip'].popup-content {
    box-shadow: ${({ theme }) => `0px 10px 20px ${theme.colors.text}20`};
    margin-top: 0px;
  }
  [role='dialog'].popup-content {
    margin: 95px auto auto auto !important;
    max-height: calc(100vh - 48px);
    max-width: calc(100vw - 12px);
	  box-shadow: ${({ theme }) => `0px 10px 20px ${theme.colors.text}20`};
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }

  .transparent {
    opacity: 0;
  }
`

export default GlobalStyle
