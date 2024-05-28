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
import { PackageUpdateDto } from '../../../utils/types/dtos/packages/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import { PackagesGetResponses } from '../../../utils/types/responses/packages/get';
import { formDefaultValueFilled } from '../constants';
import { EditData } from '../types';
import { PackagesModal } from './packages-modal';

const columns: TableColumnType[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
	{ title: 'Form', columnName: 'form_name', valueParser: value => value.form.form_name },
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
	},
	{
		title: 'Number of Subject',
		columnName: 'subject_count_from',
		valueParser: value =>
			value.subject_count_from +
			(value.subject_count_to === null ? '+' : ' - ' + value.subject_count_to),
	},
	{
		title: 'Discount',
		columnName: 'discount_per_subject',
		valueParser: value => 'RM ' + value.discount_per_subject.toFixed(2),
		notSortable: true,
	},
];

const defaultSort: DefaultSort = {
	field: 'form_name',
	asc: true,
};

type PropType = {
	data: PackagesGetResponses;
	search?: string;
	refetch: () => Promise<QueryObserverResult<PackagesGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function PackagesTable({ data, search, refetch, setOrderBy }: Readonly<PropType>) {
	const { setNotification } = useNotificationContext();
	const [tableData, setTableData] = useState<PackagesGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const [edit, setEdit] = useState<boolean>(false);

	const handleEdit = useCallback((data: EditData) => {
		setSelected(data);
		setEdit(true);
	}, []);

	const handleUpdate = useCallback(
		async (data: PackageUpdateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, PackageUpdateDto>(
					`/api/packages/${selected.id}`,
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
		[refetch, selected],
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

	return (
		<React.Fragment>
			<TableTemplate
				columns={columns}
				data={tableData}
				setOrderBy={setOrderBy}
				defaultSort={defaultSort}
				handleEdit={handleEdit}
			/>

			{edit ? (
				<FormProvider defaultValue={formDefaultValueFilled(selected)}>
					<PackagesModal closeModal={() => setEdit(false)} handler={handleUpdate} data={selected} />
				</FormProvider>
			) : null}
		</React.Fragment>
	);
}
