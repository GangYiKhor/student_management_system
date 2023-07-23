import clsx from 'clsx';
import {
	AlternateRowClass,
	AlternateRowClassWithHover,
	CellClass,
	NormalRowHoverClass,
	THeadCellClass,
	THeadClass,
	THeadStickyClass,
	TableClass,
} from '../../../utils/class/table';
import React, { useCallback, useEffect, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { Sorter } from '../../../components/sorter';
import { PackagesEditModal } from './edit-modal';
import { PackagesGetResponse } from '../../../responses/packages/get';
import { PackagesUpdateDto } from '../../../dtos/packages/update';
import { QueryObserverResult } from '@tanstack/react-query';
import { ErrorResponse } from '../../../responses/error';

export type EditData = {
	id: number;
	start_date?: Date;
	end_date?: Date;
	form_id?: number;
	subject_count_from?: number;
	subject_count_to?: number;
	discount_per_subject?: number;
};

type PropType = {
	data: PackagesGetResponse[];
	search?: string;
	refetch: () => Promise<
		QueryObserverResult<PackagesGetResponse[], AxiosError<ErrorResponse, any>>
	>;
	setOrderBy: (value: string) => void;
};

export function PackagesTable({ data, search, refetch, setOrderBy }: PropType) {
	const { setNotification } = useNotificationContext();
	const [tableData, setTableData] = useState<PackagesGetResponse[]>([]);
	const [sortBy, setSortBy] = useState<{
		field:
			| 'id'
			| 'start_date'
			| 'end_date'
			| 'form_name'
			| 'subject_count_from'
			| 'subject_count_to'
			| 'discount_per_subject';
		asc: boolean;
	}>({
		field: 'form_name',
		asc: true,
	});
	const [selected, setSelected] = useState<EditData>(undefined);
	const [edit, setEdit] = useState<boolean>(false);

	const handleEdit = useCallback(
		(data: EditData) => {
			setSelected(data);
			setEdit(true);
		},
		[setSelected, setEdit],
	);

	const handleUpdate = useCallback(
		async (id: number, data: PackagesUpdateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, PackagesUpdateDto>(
					`/api/packages/${id}/`,
					data,
				);

				await refetch();
			} catch (error: any) {
				if (error instanceof AxiosError) {
					setNotification({
						title: error.response.data.error.title,
						message: error.response.data.error.message,
						source: error.response.data.error.source,
						type: 'ERROR',
					});
				} else {
					setNotification({ title: 'Server Error', message: error.message });
				}
				throw error;
			}
		},
		[refetch],
	);

	useEffect(() => {
		let filteredData = data;
		if (search) {
			search = search.trim().toLowerCase();
			filteredData = filteredData.filter(
				value =>
					'#' + value.id.toString() === search ||
					value.form.form_name.toLowerCase().includes(search) ||
					('RM ' + value.discount_per_subject).includes(search) ||
					value.start_date.toLocaleDateString().includes(search) ||
					value.end_date.toLocaleDateString().includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, search]);

	useEffect(() => {
		setOrderBy(`${sortBy.field} ${sortBy.asc ? 'asc' : 'desc'}`);
	}, [sortBy]);

	return (
		<React.Fragment>
			<table className={TableClass}>
				<thead className={clsx(THeadClass, THeadStickyClass)}>
					<tr>
						<th className={clsx(THeadCellClass, 'w-[5rem]')}>
							<Sorter
								title="ID"
								asc={sortBy.field === 'id' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'id', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="Form"
								asc={sortBy.field === 'form_name' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'form_name', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="Start Date"
								asc={sortBy.field === 'start_date' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'start_date', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="End Date"
								asc={sortBy.field === 'end_date' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'end_date', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="Number of Subject"
								asc={sortBy.field === 'subject_count_from' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'subject_count_from', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="Discount (RM)"
								asc={sortBy.field === 'discount_per_subject' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'discount_per_subject', asc });
								}}
							/>
						</th>
					</tr>
				</thead>
				<tbody>
					{tableData?.length > 0 ? (
						tableData.map((value, index) => {
							const rowClass = clsx(
								index % 2 === 0 ? AlternateRowClassWithHover : NormalRowHoverClass,
								'hover:cursor-pointer',
							);

							return (
								<tr
									key={value.id}
									className={clsx(rowClass)}
									onClick={() => {
										handleEdit(value);
									}}
								>
									<td className={CellClass}>{value.id}</td>
									<td className={CellClass}>{value.form.form_name}</td>
									<td className={CellClass}>{value.start_date.toLocaleDateString()}</td>
									<td className={CellClass}>
										{value.end_date ? value.end_date.toLocaleDateString() : '-'}
									</td>
									<td className={CellClass}>
										{value.subject_count_from +
											(value.subject_count_to === null ? '+' : ' - ' + value.subject_count_to)}
									</td>
									<td className={CellClass}>{'RM ' + value.discount_per_subject.toFixed(2)}</td>
								</tr>
							);
						})
					) : (
						<tr className={AlternateRowClass}>
							<td className={CellClass}>-</td>
							<td className={CellClass}>-</td>
							<td className={CellClass}>-</td>
							<td className={CellClass}>-</td>
							<td className={CellClass}>-</td>
							<td className={CellClass}>-</td>
						</tr>
					)}
				</tbody>
			</table>
			{edit ? (
				<PackagesEditModal
					closeModal={() => setEdit(false)}
					handleUpdate={handleUpdate}
					data={selected}
				/>
			) : null}
		</React.Fragment>
	);
}
