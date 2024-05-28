import { QueryObserverResult } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import {
	DefaultSort,
	TableColumnType,
	TableTemplate,
} from '../../../components/tables/table-template';
import { SERVER_CONNECTION_ERROR } from '../../../utils/constants/ErrorResponses';
import { HolidayUpdateDto } from '../../../utils/types/dtos/holidays/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import { HolidaysGetResponses } from '../../../utils/types/responses/holidays/get';
import { formDefaultValueFilled } from '../constants';
import { EditData } from '../types';
import { HolidaysModal } from './holidays-modal';

const columns: TableColumnType[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]', notSortable: true },
	{
		title: 'Date',
		columnName: 'date',
		valueParser: value => value.date.toLocaleDateString(),
	},
	{ title: 'Description', columnName: 'description', notSortable: true },
];

const defaultSort: DefaultSort = {
	field: 'date',
	asc: true,
};

type PropType = {
	data: HolidaysGetResponses;
	search?: string;
	refetch: () => Promise<QueryObserverResult<HolidaysGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: 'date asc' | 'date desc') => void;
};

export function HolidaysTable({ data, search, refetch, setOrderBy }: Readonly<PropType>) {
	const { setNotification } = useNotificationContext();
	const [tableData, setTableData] = useState<HolidaysGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const [edit, setEdit] = useState<boolean>(false);

	const handleEdit = useCallback((data: EditData) => {
		setSelected(data);
		setEdit(true);
	}, []);

	const handleUpdate = useCallback(
		async (data: HolidayUpdateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, HolidayUpdateDto>(
					`/api/holidays/${selected.id}`,
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
			filteredData = filteredData.filter(
				value =>
					'#' + value.id.toString() === search || value.description.toLowerCase().includes(search),
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
					<HolidaysModal closeModal={() => setEdit(false)} handler={handleUpdate} data={selected} />
				</FormProvider>
			) : null}
		</React.Fragment>
	);
}
