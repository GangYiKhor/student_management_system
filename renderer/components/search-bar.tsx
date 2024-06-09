import clsx from 'clsx';
import { SearchBarButtons } from '../utils/types/search-bar-button';

type PropType = {
	buttons?: SearchBarButtons;
	children: React.ReactNode;
};

export function SearchBar({ buttons, children }: Readonly<PropType>) {
	return (
		<div className={clsx('flex', 'justify-between')}>
			<div className={clsx('flex', 'flex-wrap', 'flex-row', 'items-baseline', 'gap-2')}>
				{children}
			</div>
			<div className={clsx('flex', 'justify-end', 'gap-4', 'items-center')}>
				{buttons?.map(({ text, className, onClick }) => (
					<button key={text} className={className} onClick={onClick}>
						{text}
					</button>
				))}
			</div>
		</div>
	);
}
