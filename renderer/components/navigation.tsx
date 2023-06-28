import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { defaultButtonClass } from '../utils/class/button_class';

const buttonClass = clsx(
	'flex',
	'justify-start',
	'items-center',
	'gap-5',
	'pl-3',
	'pr-8',
	'pt-2',
	'pb-2',
	'text-xl',
	defaultButtonClass,
);

const buttons = [
	{ image: '/images/home.png', href: '/coming-soon', text: 'Home' },
	{ image: '/images/student.png', href: '#', text: 'Students' },
	{ image: '/images/receipt.png', href: '#', text: 'Receipts' },
	{ image: '/images/collection.png', href: '#', text: 'Collections' },
	{ image: '/images/class.png', href: '#', text: 'Classes' },
	{ image: '/images/package.png', href: '#', text: 'Packages' },
	{ image: '/images/teacher.png', href: '#', text: 'Teachers' },
	{ image: '/images/subject.png', href: '#', text: 'Subjects' },
	{ image: '/images/voucher.png', href: '#', text: 'Vouchers' },
	{ image: '/images/holiday.png', href: '#', text: 'Holidays' },
	{ image: '/images/tax.png', href: '#', text: 'Tax' },
	{ image: '/images/student_year.png', href: '#', text: 'Form' },
	{ image: '/images/setting.png', href: '#', text: 'Settings' },
	{ image: '/images/logout.png', href: '#', text: 'Logout' },
];

export function NavigationBar() {
	return (
		<React.Fragment>
			{buttons.map(({ image, href, text }) => (
				<Link href={href} key={text}>
					<div className={buttonClass}>
						<Image src={image} width={35} height={35} alt="" className="dark:invert" />
						<p>{text}</p>
					</div>
				</Link>
			))}
		</React.Fragment>
	);
}
