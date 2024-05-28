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
import { ClassUpdateDto } from '../../../utils/types/dtos/classes/update';
import { ClassesGetResponses } from '../../../utils/types/responses/classes/get';
import { ErrorResponse } from '../../../utils/types/responses/error';
import { formDefaultValueFilled } from '../constants';
import { EditData } from '../types';
import { ClassesModal } from './classes-modal';

const columns: TableColumnType[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
	{ title: 'Class', columnName: 'class_name' },
	{
		title: 'Teacher',
		columnName: 'teacher_name',
		valueParser: value => value.teacher.teacher_name,
	},
	{ title: 'Form', columnName: 'form_name', valueParser: value => value.form.form_name },
	{
		title: 'Start Date',
		columnName: 'start_date',
		valueParser: value => value.start_date.toLocaleDateString(),
	},
	{
		title: 'End Date',
		columnName: 'end_date',
		valueParser: value => value.end_date.toLocaleDateString(),
	},
	{ title: 'Day', columnName: 'day' },
	{
		title: 'Start Time',
		columnName: 'start_time',
		valueParser: value => value.start_time.toLocaleTimeString(),
	},
	{
		title: 'End Time',
		columnName: 'end_time',
		valueParser: value => value.end_time.toLocaleTimeString(),
	},
	{
		title: 'Fees',
		columnName: 'fees',
		valueParser: value => 'RM ' + value.fees.toFixed(2),
	},
	{
		title: 'Package',
		columnName: 'is_package',
		valueParser: value => (value.is_package ? 'Yes' : 'No'),
	},
];

const defaultSort: DefaultSort = {
	field: 'teacher_name',
	asc: true,
};

type PropType = {
	data: ClassesGetResponses;
	search?: string;
	refetch: () => Promise<QueryObserverResult<ClassesGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function ClassTable({ data, search, refetch, setOrderBy }: Readonly<PropType>) {
	const { setNotification } = useNotificationContext();
	const [tableData, setTableData] = useState<ClassesGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const [edit, setEdit] = useState<boolean>(false);

	const handleEdit = useCallback((data: EditData) => {
		setSelected(data);
		setEdit(true);
	}, []);

	const handleUpdate = useCallback(
		async (data: ClassUpdateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, ClassUpdateDto>(
					`/api/classes/${selected.id}`,
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
					'#' + value.id.toString() === search ||
					value.form.form_name.toLowerCase().includes(search) ||
					value.teacher.teacher_name.toLowerCase().includes(search) ||
					value.class_name.toLowerCase().includes(search),
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
					<ClassesModal closeModal={() => setEdit(false)} handler={handleUpdate} data={selected} />
				</FormProvider>
			) : null}
		</React.Fragment>
	);
}
