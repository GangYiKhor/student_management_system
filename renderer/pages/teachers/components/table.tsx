import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { FormProvider } from '../../../components/providers/form-providers';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import { getToday } from '../../../utils/dateOperations';
import { GreenBoldText, RedBoldText } from '../../../utils/tailwindClass/text';
import { TeacherUpdateDto } from '../../../utils/types/dtos/teachers/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import {
	TeachersGetResponse,
	TeachersGetResponses,
} from '../../../utils/types/responses/teachers/get';
import { BackendPath, defaultSort, formDefaultValueFilled } from '../constants';
import { EditData } from '../types';
import { TeachersModal } from './teachers-modal';

const columns: TableColumnType<TeachersGetResponse>[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
	{ title: 'Name', columnName: 'teacher_name' },
	{
		title: 'Status',
		columnName: 'is_active',
		valueParser: value => (
			<span className={value.is_active ? GreenBoldText : RedBoldText}>
				{value.is_active ? 'Active' : 'Inactive'}
			</span>
		),
	},
];

type PropType = {
	data: TeachersGetResponses;
	search?: string;
	refetch: () => Promise<QueryObserverResult<TeachersGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function TeachersTable({ data, search, refetch, setOrderBy }: Readonly<PropType>) {
	const [tableData, setTableData] = useState<TeachersGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const postTeacher = usePost<TeacherUpdateDto, void>(BackendPath);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (data: TeacherUpdateDto) => {
		await postTeacher(data, selected.id);
		await refetch();
	};

	const handleActivate = async () => {
		await handleUpdate({ is_active: !selected.is_active });
		setSelected((prev: EditData) => ({
			...prev,
			end_date: !selected.is_active === true ? null : getToday(),
			is_active: !selected.is_active,
		}));
	};

	useEffect(() => {
		let filteredData = data;
		if (search) {
			search = search.trim().toLowerCase();
			filteredData = filteredData.filter(
				value =>
					'#' + value.id === search ||
					value.teacher_name?.toLowerCase().includes(search) ||
					value.phone_number?.includes(search) ||
					value.phone_number?.replace(/-/g, '').replace(/\s/g, '').includes(search) ||
					value.ic?.includes(search) ||
					value.ic?.replace(/-/g, '').includes(search),
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

			{selected ? (
				<FormProvider defaultValue={formDefaultValueFilled(selected)}>
					<TeachersModal
						closeModal={() => setSelected(undefined)}
						handler={handleUpdate}
						handleActivate={handleActivate}
						data={selected}
					/>
				</FormProvider>
			) : null}
		</React.Fragment>
	);
}
