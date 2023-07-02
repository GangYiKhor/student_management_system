import clsx from 'clsx';

export type TableColumnType = { title: string; columnName: string }[];

const tableClass = clsx('table-auto', 'w-full');
const theadClass = clsx(
	'border-b-2',
	'border-t-2',
	'border-gray-300',
	'hover:bg-[rgba(0,0,0,0.05)]',
	'active:bg-[rgba(0,0,0,0.1)]',
	'dark:hover:bg-[rgba(255,255,255,0.05)]',
	'dark:active:bg-[rgba(255,255,255,0.1)]',
);
const cellClass = clsx('pt-1', 'pb-1', 'pl-4', 'pr-5', 'text-center');

type PropType = {
	columns: TableColumnType;
	children: any;
	showNumber?: boolean;
};

export function TableTemplate({ columns, children, showNumber }: PropType) {
	return (
		<table className={tableClass}>
			<thead className={theadClass}>
				<tr>
					{showNumber ? <th className={clsx(cellClass, 'w-1')}>No</th> : null}
					{columns.map(({ title }) => (
						<th key={title} className={cellClass}>
							{title}
						</th>
					))}
				</tr>
			</thead>
			<tbody>{children}</tbody>
		</table>
	);
}
