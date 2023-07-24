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
import { ClassEditModal } from './edit-modal';
import { ClassGetResponse } from '../../../responses/class/get';
import { ClassUpdateDto } from '../../../dtos/class/update';
import { QueryObserverResult } from '@tanstack/react-query';
import { ErrorResponse } from '../../../responses/error';
import { parseFloatOrUndefined } from '../../../utils/parser';

export type EditData = {
	id: number;
	teacher_id?: number;
	start_date?: Date;
	end_date?: Date;
	class_year?: number;
	form_id?: number;
	day?: number;
	start_time?: Date;
	end_time?: Date;
	fees?: number;
	is_package?: boolean;
	class_name?: string;
};

type PropType = {
	data: ClassGetResponse[];
	search?: string;
	refetch: () => Promise<QueryObserverResult<ClassGetResponse[], AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function ClassTable({ data, search, refetch, setOrderBy }: PropType) {
	const { setNotification } = useNotificationContext();
	const [tableData, setTableData] = useState<ClassGetResponse[]>([]);
	const [sortBy, setSortBy] = useState<{
		field:
			| 'id'
			| 'start_date'
			| 'end_date'
			| 'form_name'
			| 'teacher_name'
			| 'start_time'
			| 'end_time'
			| 'day'
			| 'class_year'
			| 'fees'
			| 'is_package'
			| 'class_name';
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
		async (id: number, data: ClassUpdateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, ClassUpdateDto>(`/api/class/${id}/`, data);

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
					value.teacher.teacher_name.toLowerCase().includes(search) ||
					value.class_name.toLowerCase().includes(search),
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
								title="Class"
								asc={sortBy.field === 'class_name' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'class_name', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="Teacher"
								asc={sortBy.field === 'teacher_name' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'teacher_name', asc });
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
								title="Day"
								asc={sortBy.field === 'day' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'day', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="Start Time"
								asc={sortBy.field === 'start_time' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'start_time', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="End Time"
								asc={sortBy.field === 'end_time' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'end_time', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="Fees"
								asc={sortBy.field === 'fees' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'fees', asc });
								}}
							/>
						</th>
						<th className={THeadCellClass}>
							<Sorter
								title="Package"
								asc={sortBy.field === 'is_package' ? sortBy.asc : undefined}
								sortHandler={(asc: boolean) => {
									setSortBy({ field: 'is_package', asc });
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
									<td className={CellClass}>{value.class_name}</td>
									<td className={CellClass}>{value.teacher.teacher_name}</td>
									<td className={CellClass}>{value.form.form_name}</td>
									<td className={CellClass}>{value.start_date.toLocaleDateString()}</td>
									<td className={CellClass}>{value.end_date.toLocaleDateString()}</td>
									<td className={CellClass}>{value.day}</td>
									<td className={CellClass}>{value.start_time.toLocaleTimeString()}</td>
									<td className={CellClass}>{value.end_time.toLocaleTimeString()}</td>
									<td className={CellClass}>
										{'RM ' + parseFloatOrUndefined(value.fees.toString(), 2)}
									</td>
									<td className={CellClass}>{value.is_package ? 'Yes' : 'No'}</td>
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
				<ClassEditModal
					closeModal={() => setEdit(false)}
					handleUpdate={handleUpdate}
					data={selected}
				/>
			) : null}
		</React.Fragment>
	);
}
