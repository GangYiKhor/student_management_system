import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useFormContextWithId } from '../../../components/providers/form-providers';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import { GreenButtonClass, RedButtonClass } from '../../../utils/tailwindClass/button';
import { GreenBoldText, RedBoldText } from '../../../utils/tailwindClass/text';
import { StudentFormUpdateDto } from '../../../utils/types/dtos/student-forms/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import {
	StudentFormsGetResponse,
	StudentFormsGetResponses,
} from '../../../utils/types/responses/student-forms/get';
import { BackendPath, defaultSort, SearchFormId } from '../constants';
import { EditData, SearchDataType } from '../types';
import { StudentFormsModal } from './student-forms-modal';

const columns = (handleAction: CallableFunction): TableColumnType<StudentFormsGetResponse>[] => {
	return [
		{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
		{ title: 'Form', columnName: 'form_name' },
		{
			title: 'Status',
			columnName: 'is_active',
			valueParser: value => (
				<span className={value.is_active ? GreenBoldText : RedBoldText}>
					{value.is_active ? 'Active' : 'Inactive'}
				</span>
			),
		},
		{
			title: 'Action',
			columnName: 'action',
			addOnClass: 'w-[150px]',
			valueParser: value => (
				<button
					onClick={() => handleAction(value.id, !value.is_active)}
					className={clsx(value.is_active ? RedButtonClass : GreenButtonClass, 'w-[125px]')}
				>
					{value.is_active ? 'Deactivate' : 'Activate'}
				</button>
			),
			notClickable: true,
			notSortable: true,
		},
	];
};

type PropType = {
	data: StudentFormsGetResponses;
	refetch: () => Promise<
		QueryObserverResult<StudentFormsGetResponses, AxiosError<ErrorResponse, any>>
	>;
	handler: (id: number, status: boolean) => Promise<void>;
	setOrderBy: (value: string) => void;
};

export function StudentFormsTable({ data, refetch, handler, setOrderBy }: Readonly<PropType>) {
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [tableData, setTableData] = useState<StudentFormsGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const postForm = usePost<StudentFormUpdateDto, void>(BackendPath);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (data: StudentFormUpdateDto) => {
		await postForm(data, selected.id);
		await refetch();
	};

	const handleActivate = async () => {
		await handleUpdate({ is_active: !selected.is_active });
		setSelected((prev: EditData) => ({
			...prev,
			is_active: !selected.is_active,
		}));
	};

	useEffect(() => {
		let filteredData = data;
		const search = formData?.general?.value?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(
				value => '#' + value.id === search || value.form_name?.toLowerCase().includes(search),
			);
		}

		const status = formData?.status?.value;
		if (status !== undefined) {
			filteredData = filteredData.filter(value => value.is_active === status);
		}

		setTableData(filteredData);
	}, [data, formData?.general?.value, formData?.status?.value]);

	return (
		<React.Fragment>
			<TableTemplate
				columns={columns(handler)}
				data={tableData}
				setOrderBy={setOrderBy}
				defaultSort={defaultSort}
				handleEdit={handleEdit}
			/>

			{selected ? (
				<StudentFormsModal
					closeModal={() => setSelected(undefined)}
					handler={handleUpdate}
					handleActivate={handleActivate}
					data={selected}
				/>
			) : null}
		</React.Fragment>
	);
}
