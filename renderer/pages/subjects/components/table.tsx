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

type PropType = {
	data: SubjectsGetResponse;
	search?: string;
	status?: boolean;
	refetch: CallableFunction;
};

export function SubjectsTable({ data, search, status, refetch }: PropType) {
	const { setNotification } = useNotificationContext();
	const [tableData, setTableData] = useState<SubjectsGetResponse>([]);

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
					value.subject_name.toLowerCase().includes(search) ||
					value.form.form_name.toLowerCase().includes(search),
			);
		}

		if (status !== undefined) {
			if (status) {
				filteredData = filteredData.filter(value => value.is_active);
			} else {
				filteredData = filteredData.filter(value => !value.is_active);
			}
		}

		setTableData(filteredData);
	}, [data, search, status]);

	return (
		<table className={TableClass}>
			<thead className={clsx(THeadClass, THeadStickyClass)}>
				<tr>
					<th className={clsx(THeadCellClass, 'w-[5rem]')}>No</th>
					<th className={THeadCellClass}>Form</th>
					<th className={THeadCellClass}>Subject Name</th>
					<th className={THeadCellClass}>Status</th>
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
								<td className={CellClass}>{index + 1}</td>
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
