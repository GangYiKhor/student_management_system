import clsx from 'clsx';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useTooltipContext } from './providers/tooltip-providers';

const tooltipClass = clsx(
	'tooltip',
	'absolute',
	'z-[100]',
	'min-w-[50px]',
	'max-w-[200px]',
	'px-[10px]',
	'py-[3px]',
	'rounded-md',
	'text-center',
	'bg-slate-100',
	'border-[1px]',
	'border-slate-400',
	'dark:bg-slate-800',
);

export function Tooltip() {
	const { tooltip } = useTooltipContext();
	const [visible, setVisible] = useState(false);
	const callback = debounce(() => {
		setVisible(true);
	}, 500);

	const handleMouseMove = (e: MouseEvent) => {
		setVisible(false);
		document.documentElement.style.setProperty('--x', (e.clientX + 10).toString() + 'px');
		document.documentElement.style.setProperty('--y', (e.clientY - 30).toString() + 'px');
		callback();
	};

	useEffect(() => {
		if (tooltip) {
			window.addEventListener('mousemove', handleMouseMove);
			return () => window.removeEventListener('mousemove', handleMouseMove);
		} else {
			callback.cancel();
		}
		setVisible(false);
	}, [tooltip]);

	return tooltip ? (
		<div className={clsx(tooltipClass, visible ? '' : 'invisible')}>{tooltip}</div>
	) : null;
}
