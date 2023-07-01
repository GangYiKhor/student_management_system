import clsx from 'clsx';
import { StudentFormsGetResponse } from '../../../responses/student-forms/get';
import {
	AlternateRowClass,
	CellClass,
	THeadCellClass,
	THeadClass,
	THeadStickyClass,
	TableClass,
} from '../../../utils/class/table';
import { GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { useEffect, useState } from 'react';

type PropType = {
	data: StudentFormsGetResponse;
	search?: string;
	status?: boolean;
	handleAction: CallableFunction;
};

export function StudentFormsTable({ data, search, status, handleAction }: PropType) {
	const [tableData, setTableData] = useState<StudentFormsGetResponse>([]);

	useEffect(() => {
		let filteredData = data;
		if (search) {
			search = search.trim().toLowerCase();
			filteredData = filteredData.filter(value => value.form_name.toLowerCase().includes(search));
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

	// TODO: PUT
	return (
		<table className={TableClass}>
			<thead className={clsx(THeadClass, THeadStickyClass)}>
				<tr>
					<th className={clsx(THeadCellClass, 'w-[5rem]')}>No</th>
					<th className={THeadCellClass}>Form</th>
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
								<td className={CellClass}>{value.form_name}</td>
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
					</tr>
				)}
			</tbody>
		</table>
	);
}
