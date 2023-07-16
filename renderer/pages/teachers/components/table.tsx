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
import { TeachersGetResponse } from '../../../responses/teachers/get';
import { TeachersUpdateDto } from '../../../dtos/teachers/update';
import { TeachersEditModal } from './edit-modal';

export type EditData = {
	id: number;
	teacher_name?: string;
	ic?: string;
	phone_number?: string;
	email?: string;
	address?: string;
	start_date?: Date;
	end_date?: Date;
	is_active?: boolean;
};

type PropType = {
	data: TeachersGetResponse;
	search?: string;
	status?: boolean;
	refetch: CallableFunction;
	setOrderBy: CallableFunction;
};

export function TeachersTable({ data, search, status, refetch, setOrderBy }: PropType) {
	const { setNotification } = useNotificationContext();
	const [tableData, setTableData] = useState<TeachersGetResponse>([]);
	const [sortBy, setSortBy] = useState<{
		field: 'id' | 'teacher_name' | 'phone_number' | 'ic' | 'is_active';
		asc: boolean;
	}>({
		field: 'teacher_name',
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
		async (id: number, data: TeachersUpdateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, TeachersUpdateDto>(
					`/api/teachers/${id}/`,
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
					value.teacher_name.toLowerCase().includes(search) ||
					value.phone_number.includes(search) ||
					value.phone_number.replace(/-/g, '').replace(/\s/g, '').includes(search) ||
					value.ic.includes(search) ||
					value.ic.replace(/-/g, '').includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, search, status]);

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
								title="Name"
								asc={sortBy.field === 'teacher_name' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'teacher_name', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="Phone Number"
								asc={sortBy.field === 'phone_number' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'phone_number', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="IC"
								asc={sortBy.field === 'ic' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'ic', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="Status"
								asc={sortBy.field === 'is_active' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'is_active', asc });
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
									<td className={CellClass}>{value.teacher_name}</td>
									<td className={CellClass}>{value.phone_number}</td>
									<td className={CellClass}>
										{value.ic?.length === 14 ? 'XXXXXX-XX-' + value.ic.slice(10) : value.ic}
									</td>
									<td
										className={clsx(
											CellClass,
											'font-bold',
											value.is_active
												? 'text-green-600 dark:text-green-400'
												: 'text-red-600 dark:text-red-400',
										)}
									>
										{value.is_active ? 'Active' : 'Inactive'}
									</td>
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
						</tr>
					)}
				</tbody>
			</table>
			{edit ? (
				<TeachersEditModal
					closeModal={() => setEdit(false)}
					handleUpdate={handleUpdate}
					data={selected}
					setData={setSelected}
				/>
			) : null}
		</React.Fragment>
	);
}
