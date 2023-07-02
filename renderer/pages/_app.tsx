import React from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { NotificationProvider } from '../components/providers/notification-providers';
import { CustomNotification } from '../components/notification';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class">
				<NotificationProvider>
					<div className="transition-colors">
						<Component {...pageProps} />
					</div>
					<CustomNotification />
				</NotificationProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default MyApp;
