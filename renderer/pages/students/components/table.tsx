import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useCallback, useState } from 'react';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import { STUDENT_CLASS_API_PATH } from '../../../utils/constants/constants';
import { GreenBoldText, RedBoldText } from '../../../utils/tailwindClass/text';
import { StudentClassCreateDto } from '../../../utils/types/dtos/student-classes/create';
import { StudentUpdateDto } from '../../../utils/types/dtos/students/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import {
	StudentsGetResponse,
	StudentsGetResponses,
} from '../../../utils/types/responses/students/get';
import { StudentUpdateResponse } from '../../../utils/types/responses/students/update';
import { BackendPath, defaultSort } from '../constants';
import { EditData } from '../types';
import { StudentsModal } from './students-modal';

const columns: TableColumnType<StudentsGetResponse>[] = [
	{ title: 'ID', columnName: 'id', addOnClass: 'w-[5rem]' },
	{ title: 'Name', columnName: 'student_name' },
	{
		title: 'Form',
		columnName: 'form_name',
		valueParser: value => value.form?.form_name,
	},
	{ title: 'Year', columnName: 'reg_year' },
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
	data: StudentsGetResponses;
	refetch: () => Promise<QueryObserverResult<StudentsGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function StudentsTable({ data, refetch, setOrderBy }: Readonly<PropType>) {
	const [selected, setSelected] = useState<EditData>(undefined);
	const postStudent = usePost<StudentUpdateDto, StudentUpdateResponse>(BackendPath);
	const postStudentClass = usePost<StudentClassCreateDto, void>(STUDENT_CLASS_API_PATH);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (
		data: StudentUpdateDto,
		classIds: number[],
	): Promise<StudentUpdateResponse> => {
		const result = await postStudent(data, selected.id);
		await postStudentClass(
			classIds.map(value => ({ class_id: value })),
			selected.id,
		);
		await refetch();
		return result;
	};

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

			{selected ? (
				<StudentsModal
					closeModal={() => setSelected(undefined)}
					handler={handleUpdate}
					handleActivate={handleActivate}
					data={selected}
				/>
			) : null}
		</React.Fragment>
	);
}
