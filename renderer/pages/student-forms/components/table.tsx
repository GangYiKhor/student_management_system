import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { FormProvider } from '../../../components/providers/form-providers';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import { GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { GreenBoldText, RedBoldText } from '../../../utils/class/text';
import { StudentFormUpdateDto } from '../../../utils/types/dtos/student-forms/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import { StudentFormsGetResponses } from '../../../utils/types/responses/student-forms/get';
import { BackendPath, defaultSort, formDefaultValueFilled } from '../constants';
import { EditData } from '../types';
import { StudentFormsModal } from './student-forms-modal';

const columns = (handleAction: CallableFunction): TableColumnType<EditData>[] => {
	return [
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
		},
	];
};

type PropType = {
	data: StudentFormsGetResponses;
	search?: string;
	status?: boolean;
	refetch: () => Promise<
		QueryObserverResult<StudentFormsGetResponses, AxiosError<ErrorResponse, any>>
	>;
	handler: (id: number, status: boolean) => Promise<void>;
	setOrderBy: (value: string) => void;
};

export function StudentFormsTable({
	data,
	search,
	status,
	refetch,
	handler,
	setOrderBy,
}: Readonly<PropType>) {
	const [tableData, setTableData] = useState<StudentFormsGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const postForm = usePost<StudentFormUpdateDto, void>(BackendPath);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (data: StudentFormUpdateDto) => {
		await postForm(data, selected.id.toString());
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
		if (search.trim()) {
			search = search.trim().toLowerCase();
			filteredData = filteredData.filter(
				value =>
					'#' + value.id?.toString() === search || value.form_name?.toLowerCase().includes(search),
			);
		}

		if (status !== undefined) {
			filteredData = filteredData.filter(value => value.is_active === status);
		}

		setTableData(filteredData);
	}, [data, search, status]);

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
				<FormProvider defaultValue={formDefaultValueFilled(selected)}>
					<StudentFormsModal
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
