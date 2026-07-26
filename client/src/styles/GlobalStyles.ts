import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: ${theme.fonts.body};
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.gray[800]};
    background: ${theme.colors.background};
    line-height: 1.6;
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Focus styles for accessibility */
  :focus-visible {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Remove default focus for non-keyboard users */
  :focus:not(:focus-visible) {
    outline: none;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: ${theme.fontWeights.bold};
    line-height: 1.3;
    color: ${theme.colors.gray[900]};
  }

  a {
    color: ${theme.colors.primary[600]};
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary[700]};
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray[300]};
    border-radius: ${theme.radii.full};

    &:hover {
      background: ${theme.colors.gray[400]};
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
