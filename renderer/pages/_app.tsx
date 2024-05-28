import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { CustomNotification } from '../components/notification';
import { NotificationProvider } from '../components/providers/notification-providers';
import { TooltipProvider } from '../components/providers/tooltip-providers';
import { Tooltip } from '../components/tooltip';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute="class">
				<TooltipProvider>
					<NotificationProvider>
						<Tooltip />
						<div className="transition-colors">
							<Component {...pageProps} />
						</div>
						<CustomNotification />
					</NotificationProvider>
				</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default MyApp;
