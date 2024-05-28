import { QueryObserverResult } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { FormProvider } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import {
	DefaultSort,
	TableColumnType,
	TableTemplate,
} from '../../../components/tables/table-template';
import { SERVER_CONNECTION_ERROR } from '../../../utils/constants/ErrorResponses';
import { StudentClassCreateDto } from '../../../utils/types/dtos/student-classes/create';
import { StudentsUpdateDto } from '../../../utils/types/dtos/students/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import { StudentsGetResponses } from '../../../utils/types/responses/students/get';
import { formDefaultValueFilled } from '../constants';
import { StudentsModal } from './students-modal';

export type EditData = {
	id: number;
	student_name: string;
	form_id: number;
	reg_date: Date;
	reg_year: number;
	gender?: string;
	ic?: string;
	school?: string;
	phone_number?: string;
	parent_phone_number?: string;
	email?: string;
	address?: string;
	is_active?: boolean;
};

const columns: TableColumnType[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
	{ title: 'Name', columnName: 'student_name' },
	{
		title: 'Form',
		columnName: 'form',
		valueParser: value => value.form.form_name,
	},
	{ title: 'Year', columnName: 'reg_year' },
	{
		title: 'Status',
		columnName: 'is_active',
		valueParser: value => (
			<span
				className={clsx(
					'font-bold',
					value.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
				)}
			>
				{value.is_active ? 'Active' : 'Inactive'}
			</span>
		),
	},
];

const defaultSort: DefaultSort = {
	field: 'student_name',
	asc: true,
};

type PropType = {
	data: StudentsGetResponses;
	refetch: () => Promise<QueryObserverResult<StudentsGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function StudentsTable({ data, refetch, setOrderBy }: Readonly<PropType>) {
	const { setNotification } = useNotificationContext();
	const [selected, setSelected] = useState<EditData>(undefined);
	const [edit, setEdit] = useState<boolean>(false);

	const handleEdit = useCallback((data: EditData) => {
		setSelected(data);
		setEdit(true);
	}, []);

	const handleUpdate = useCallback(
		async (data: StudentsUpdateDto, classIds: number[]) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, StudentsUpdateDto>(
					`/api/students/${selected.id}`,
					data,
				);

				await axios.post<any, AxiosResponse<any, any>, StudentClassCreateDto>(
					`/api/student-classes/${selected.id}`,
					classIds.map(value => ({ class_id: value })),
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

	const handleActivate = useCallback(async () => {
		const newStatus = !selected.is_active;
		await handleUpdate({ is_active: newStatus }, []);
		setSelected((prev: EditData) => ({
			...prev,
			is_active: newStatus,
		}));
	}, [handleUpdate, selected]);

	return (
		<React.Fragment>
			<TableTemplate
				columns={columns}
				data={data}
				setOrderBy={setOrderBy}
				defaultSort={defaultSort}
				handleEdit={handleEdit}
			/>

			{edit ? (
				<FormProvider defaultValue={formDefaultValueFilled(selected)}>
					<StudentsModal
						closeModal={() => setEdit(false)}
						handler={handleUpdate}
						handleActivate={handleActivate}
						data={selected}
					/>
				</FormProvider>
			) : null}
		</React.Fragment>
	);
}
