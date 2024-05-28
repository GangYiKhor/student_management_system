import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { FormProvider } from '../../../components/providers/form-providers';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import { GreenBoldText, RedBoldText } from '../../../utils/class/text';
import { getCurrentDateOnly } from '../../../utils/parsers/dateParsers';
import { TeacherUpdateDto } from '../../../utils/types/dtos/teachers/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import { TeachersGetResponses } from '../../../utils/types/responses/teachers/get';
import { BackendPath, defaultSort, formDefaultValueFilled } from '../constants';
import { EditData } from '../types';
import { TeachersModal } from './teachers-modal';

const columns: TableColumnType<EditData>[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
	{ title: 'Name', columnName: 'teacher_name' },
	{ title: 'Phone Number', columnName: 'phone_number' },
	{
		title: 'IC',
		columnName: 'ic',
		valueParser: value =>
			value.ic?.length === 14 ? 'XXXXXX-XX-' + value.ic?.slice(10) : value?.ic,
	},
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
	const postForm = usePost<TeacherUpdateDto, void>(BackendPath);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (data: TeacherUpdateDto) => {
		await postForm(data, selected.id.toString());
		await refetch();
	};

	const handleActivate = async () => {
		await handleUpdate({ is_active: !selected.is_active });
		setSelected((prev: EditData) => ({
			...prev,
			end_date: !selected.is_active === true ? null : getCurrentDateOnly(),
			is_active: !selected.is_active,
		}));
	};

	useEffect(() => {
		let filteredData = data;
		if (search) {
			search = search.trim().toLowerCase();
			filteredData = filteredData.filter(
				value =>
					'#' + value.id.toString() === search ||
					value.teacher_name.toLowerCase().includes(search) ||
					value.phone_number.includes(search) ||
					value.phone_number.replace(/-/g, '').replace(/\s/g, '').includes(search) ||
					value.ic.includes(search) ||
					value.ic.replace(/-/g, '').includes(search),
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
