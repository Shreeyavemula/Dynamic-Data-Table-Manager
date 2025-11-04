'use client';
import './globals.css';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import EmotionThemeProvider from '../src/theme/EmotionThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <EmotionThemeProvider>{children}</EmotionThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
