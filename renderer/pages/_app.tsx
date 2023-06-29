import React from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class">
				<div className="transition-colors">
					<Component {...pageProps} />
				</div>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default MyApp;
