// src/pages/_app.tsx

import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { QueryClient } from 'react-query';
import { QueryClientProvider } from 'react-query';

import 'tailwindcss/tailwind.css'; // tailwind styles
export function createQueryClient() {
  return new QueryClient();
}
// 테마 색상 정의
const theme = {
  colors: {
    primary: '#0070f3',
  },
   ColorsetArray : ["red", "blue", "green", "yellow", "purple", "orange"]

};
/**
 * @description 글로벌 스타일 정의
 */
const GlobalStyle = createGlobalStyle`
html {
  font-size: 14px;  // 기본 폰트 크기
}

@media (min-width: 576px) {  // 예: sm
  html {
    font-size: 12px;
  }
}

@media (min-width: 768px) {  // 예: md
  html {
    font-size: 13px;
  }
}

`;

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const queryClient = createQueryClient();

  return (
    <QueryClientProvider client={queryClient}>

    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
    </QueryClientProvider>

  );
}

export default MyApp;
