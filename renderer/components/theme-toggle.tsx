import clsx from 'clsx';
import { Moon, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';

const moonClass = clsx(
	'absolute',
	'scale-0',
	'dark:scale-100',
	'rotate-90',
	'dark:rotate-0',
	'transition-all',
);
const sunClass = clsx(
	'absolute',
	'scale-100',
	'dark:scale-0',
	'rotate-0',
	'dark:rotate-90',
	'transition-all',
);

export function ThemeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="relative">
			<div className="w-[24px] h-[24px]">
				<Moon className={moonClass} />
				<SunMedium className={sunClass} />
				<span className="sr-only">Toggle theme</span>
			</div>
		</button>
	);
}
