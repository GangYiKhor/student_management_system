import clsx from 'clsx';
import { Menu } from 'lucide-react';
import Image from 'next/future/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTooltip } from '../hooks/use-tooltip';
import { MENU_ITEMS } from '../utils/constants/constants';
import { EmptyLightButtonClass } from '../utils/tailwindClass/button';

const navigationClass = clsx(
	'bg-[rgb(203,227,245)]',
	'dark:bg-[rgb(33,37,41)]',
	'min-h-screen',
	'max-h-screen',
	'overflow-x-hidden',
	'overflow-y-auto',
	'hide-scrollbar',
	'transition-[width]',
);
const separatorClass = clsx('border-0', 'h-1', 'bg-[rgba(255,255,255,0.5)]');
const buttonClass = clsx(
	'relative',
	'gap-5',
	'pl-3',
	'pt-3',
	'pb-3',
	'text-xl',
	'h-[60px]',
	EmptyLightButtonClass,
);
const imageClass = clsx(
	'absolute',
	'left-[10px]',
	'min-w-[30[x]',
	'min-h-[30px]',
	'w-[30px]',
	'h-[30px]',
);
const textClass = clsx('absolute', 'left-[55px]', 'top-[13px]');

export function NavigationBar() {
	const { tooltip } = useTooltip();
	const [collapse, setCollapse] = useState(true);

	return (
		<nav className={clsx(navigationClass, collapse ? 'w-[54px]' : 'w-[191px]')}>
			<button
				className="w-full"
				onClick={() => setCollapse(!collapse)}
				{...tooltip(collapse ? 'Expand' : 'Collapse')}
			>
				<div className={clsx(buttonClass, collapse ? 'pr-3' : 'pr-8')}>
					<Menu width={30} height={30} className={imageClass} />
					<p className={textClass}>Menu</p>
				</div>
			</button>
			<hr className={clsx(separatorClass)} />
			<div>
				{MENU_ITEMS.map(({ image, href, text }) => (
					<Link href={href} key={text}>
						<div className={clsx(buttonClass, collapse ? 'pr-3' : 'pr-8')} {...tooltip(text)}>
							<Image
								src={image}
								width={30}
								height={30}
								alt=""
								className={clsx(imageClass, 'dark:invert')}
							/>
							<p className={textClass}>{text}</p>
						</div>
					</Link>
				))}
			</div>
		</nav>
	);
}
