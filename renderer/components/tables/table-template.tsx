import clsx from 'clsx';
import { ReactElement, useEffect, useState } from 'react';
import {
	AlternateRowClass,
	AlternateRowClassWithHover,
	CellClass,
	NormalRowHoverClass,
	THeadCellClass,
	THeadClass,
	THeadStickyClass,
	TableClass,
} from '../../utils/class/table';
import { Sorter } from './sorter';

export type TableColumnType<T = any> = {
	title: string;
	columnName: string;
	addOnClass?: string;
	valueParser?: (value: T) => string | ReactElement;
	notSortable?: boolean;
	notClickable?: boolean;
};

export type DefaultSort = {
	field: string;
	asc: boolean;
};

type PropType = {
	columns: TableColumnType[];
	data: any[];
	setOrderBy?: (value: string) => void;
	defaultSort?: { field: string; asc: boolean };
	handleEdit?: (value: any) => void;
};

export function TableTemplate({
	columns,
	data,
	setOrderBy,
	defaultSort,
	handleEdit,
}: Readonly<PropType>) {
	const [sortBy, setSortBy] = useState<{ field: string; asc: boolean }>(defaultSort);

	useEffect(() => {
		if (setOrderBy) {
			setOrderBy(`${sortBy.field} ${sortBy.asc ? 'asc' : 'desc'}`);
		}
	}, [sortBy]);

	return (
		<table className={TableClass}>
			<thead className={clsx(THeadClass, THeadStickyClass)}>
				<tr>
					{columns.map(({ title, columnName, addOnClass, notSortable }) => (
						<th key={title} className={clsx(THeadCellClass, addOnClass ?? '')}>
							<Sorter
								title={title}
								asc={sortBy.field === columnName ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: columnName, asc });
								}}
								notSortable={notSortable ?? false}
							/>
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data?.length > 0 ? (
					data.map((value, index) => {
						const rowClass = clsx(
							index % 2 === 0 ? AlternateRowClassWithHover : NormalRowHoverClass,
							'hover:cursor-pointer',
						);

						return (
							<tr key={value.id} className={rowClass}>
								{columns.map(({ columnName, valueParser, notClickable }) => (
									<td
										key={columnName}
										className={CellClass}
										onClick={() => (!notClickable && handleEdit ? handleEdit(value) : null)}
									>
										{valueParser?.(value) ?? value[columnName]}
									</td>
								))}
							</tr>
						);
					})
				) : (
					<tr className={AlternateRowClass}>
						{columns.map(({ title }) => (
							<td key={title} className={CellClass}>
								-
							</td>
						))}
					</tr>
				)}
			</tbody>
		</table>
	);
}
