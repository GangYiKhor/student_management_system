import { QueryObserverResult } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import {
	DefaultSort,
	TableColumnType,
	TableTemplate,
} from '../../../components/tables/table-template';
import { SERVER_CONNECTION_ERROR } from '../../../utils/constants/ErrorResponses';
import { TaxUpdateDto } from '../../../utils/types/dtos/taxes/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import { TaxesGetResponses } from '../../../utils/types/responses/taxes/get';
import { formDefaultValueFilled } from '../constants';
import { EditData } from '../types';
import { TaxesModal } from './taxes-modal';

const columns: TableColumnType[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]', notSortable: true },
	{
		title: 'Percentage',
		columnName: 'percentage',
		valueParser: value => value.percentage.toFixed(2) + '%',
		notSortable: true,
	},
	{
		title: 'Start Date',
		columnName: 'start_date',
		valueParser: value => value.start_date.toISOString().split('T')[0],
	},
	{
		title: 'End Date',
		columnName: 'end_date',
		valueParser: value => (
			<span
				className={clsx(
					'font-bold',
					value.end_date === null || value.end_date >= new Date().setHours(0, 0, 0, 0)
						? 'text-green-600 dark:text-green-400'
						: 'text-red-600 dark:text-red-400',
				)}
			>
				{value.end_date?.toISOString().split('T')[0] ?? 'Active'}
			</span>
		),
		notSortable: true,
	},
	{
		title: 'Inclusive',
		columnName: 'inclusive',
		valueParser: value => (value.inclusive ? 'Yes' : 'No'),
		notSortable: true,
	},
];

const defaultSort: DefaultSort = {
	field: 'start_date',
	asc: false,
};

type PropType = {
	data: TaxesGetResponses;
	search?: string;
	refetch: () => Promise<QueryObserverResult<TaxesGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: 'start_date asc' | 'start_date desc') => void;
};

export function HolidaysTable({ data, search, refetch, setOrderBy }: Readonly<PropType>) {
	const { setNotification } = useNotificationContext();
	const [tableData, setTableData] = useState<TaxesGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const [edit, setEdit] = useState<boolean>(false);

	const handleEdit = useCallback((data: EditData) => {
		setSelected(data);
		setEdit(true);
	}, []);

	const handleUpdate = useCallback(
		async (data: TaxUpdateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, TaxUpdateDto>(
					`/api/taxes/${selected.id}`,
					data,
				);
				await refetch();
			} catch (error: any) {
				if (error instanceof AxiosError) {
					setNotification({ ...error?.response?.data?.error });
				} else {
					setNotification(SERVER_CONNECTION_ERROR);
				}
			}
		},
		[refetch, selected?.id],
	);

	useEffect(() => {
		let filteredData = data;
		if (search) {
			search = search.trim().toLowerCase();
			filteredData = filteredData.filter(value => '#' + value.id.toString() === search);
		}

		setTableData(filteredData);
	}, [data, search]);

	return (
		<React.Fragment>
			<TableTemplate
				columns={columns}
				data={tableData}
				handleEdit={handleEdit}
				defaultSort={defaultSort}
				setOrderBy={setOrderBy}
			/>

			{edit ? (
				<FormProvider defaultValue={formDefaultValueFilled(selected)}>
					<TaxesModal closeModal={() => setEdit(false)} handler={handleUpdate} data={selected} />
				</FormProvider>
			) : null}
		</React.Fragment>
	);
}
