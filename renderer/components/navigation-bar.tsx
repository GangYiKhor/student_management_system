import clsx from 'clsx';
import Image from 'next/future/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { EmptyLightButtonClass } from '../utils/class/button';
import { Menu } from 'lucide-react';
import { useTooltip } from '../hooks/use-tooltip';

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

const buttons = [
	{ image: '/images/home.png', href: '/coming-soon', text: 'Home' },
	{ image: '/images/student.png', href: '#', text: 'Students' },
	{ image: '/images/receipt.png', href: '#', text: 'Receipts' },
	{ image: '/images/collection.png', href: '#', text: 'Collections' },
	{ image: '/images/class.png', href: '#', text: 'Classes' },
	{ image: '/images/package.png', href: '#', text: 'Packages' },
	{ image: '/images/teacher.png', href: '/teachers', text: 'Teachers' },
	{ image: '/images/voucher.png', href: '#', text: 'Vouchers' },
	{ image: '/images/holiday.png', href: '#', text: 'Holidays' },
	{ image: '/images/tax.png', href: '#', text: 'Tax' },
	{ image: '/images/student_year.png', href: '/student-forms', text: 'Form' },
	{ image: '/images/setting.png', href: '#', text: 'Settings' },
	{ image: '/images/logout.png', href: '#', text: 'Logout' },
];

export function NavigationBar() {
	const { tooltip } = useTooltip();
	const [collapse, setCollapse] = useState(true);

	return (
		<nav className={clsx(navigationClass, collapse ? 'w-[54px]' : 'w-[191px]')}>
			<div
				className={clsx(buttonClass, collapse ? 'pr-3' : 'pr-8')}
				onClick={() => setCollapse(!collapse)}
				{...tooltip(collapse ? 'Expand' : 'Collapse')}
			>
				<Menu width={30} height={30} className={imageClass} />
				<p className={textClass}>Menu</p>
			</div>
			<hr className={clsx(separatorClass)} />
			<div>
				{buttons.map(({ image, href, text }) => (
					<Link href={href} key={text}>
						<div className={clsx(buttonClass, collapse ? 'pr-3' : 'pr-8')} {...tooltip(text)}>
							<Image
								src={image}
								width={30}
								height={30}
								alt=""
								// This is OK! The error message is incorrect!
								layout="raw"
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
