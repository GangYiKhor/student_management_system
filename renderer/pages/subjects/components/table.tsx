import clsx from 'clsx';
import {
	AlternateRowClass,
	CellClass,
	THeadCellClass,
	THeadClass,
	THeadStickyClass,
	TableClass,
} from '../../../utils/class/table';
import { GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { useCallback, useEffect, useState } from 'react';
import { SubjectsGetResponse } from '../../../responses/subjects/get';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { SubjectsUpdateDto } from '../../../dtos/subjects/update';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { Sorter } from '../../../components/sorter';

type PropType = {
	data: SubjectsGetResponse;
	search?: string;
	status?: boolean;
	refetch: CallableFunction;
	setOrderBy: CallableFunction;
};

export function SubjectsTable({ data, search, status, refetch, setOrderBy }: PropType) {
	const { setNotification } = useNotificationContext();
	const [tableData, setTableData] = useState<SubjectsGetResponse>([]);
	const [sortBy, setSortBy] = useState<{
		field: 'id' | 'form_name' | 'subject_name' | 'is_active';
		asc: boolean;
	}>({
		field: 'form_name',
		asc: true,
	});

	const handleAction = useCallback(
		async (id: number, status: boolean) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, SubjectsUpdateDto>('/api/subjects/update', {
					id,
					is_active: status,
				});

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
					value.subject_name.toLowerCase().includes(search) ||
					value.form.form_name.toLowerCase().includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, search, status]);

	useEffect(() => {
		setOrderBy(`${sortBy.field} ${sortBy.asc ? 'asc' : 'desc'}`);
	}, [sortBy]);

	return (
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
							title="Subject Name"
							asc={sortBy.field === 'subject_name' ? sortBy.asc : undefined}
							sortHandler={(asc: boolean) => {
								setSortBy({ field: 'subject_name', asc });
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
					<th className={THeadCellClass}>Action</th>
				</tr>
			</thead>
			<tbody>
				{tableData?.length > 0 ? (
					tableData.map((value, index) => {
						const rowClass = index % 2 === 0 ? AlternateRowClass : '';

						let buttonClass = value.is_active ? RedButtonClass : GreenButtonClass;

						return (
							<tr key={value.id} className={rowClass}>
								<td className={CellClass}>{value.id}</td>
								<td className={CellClass}>{value.form?.form_name}</td>
								<td className={CellClass}>{value.subject_name}</td>
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
								<td className={CellClass}>
									<button
										onClick={() => handleAction(value.id, !value.is_active)}
										className={clsx(buttonClass, 'w-[125px]')}
									>
										{value.is_active ? 'Deactivate' : 'Activate'}
									</button>
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
	);
}
