import clsx from 'clsx';
import Head from 'next/head';
import React, { useState } from 'react';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { useFormContextWithId } from '../../components/providers/form-providers';
import { useNotificationContext } from '../../components/providers/notification-providers';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGet } from '../../hooks/use-get';
import { usePost } from '../../hooks/use-post';
import { Layout } from '../../layouts/basic_layout';
import { STUDENT_CLASS_API_PATH } from '../../utils/constants/constants';
import { RecordCreatedMessage } from '../../utils/notifications/record-created';
import { StudentClassCreateDto } from '../../utils/types/dtos/student-classes/create';
import { StudentCreateDto } from '../../utils/types/dtos/students/create';
import { StudentsGetDto } from '../../utils/types/dtos/students/get';
import { StudentCreateResponse } from '../../utils/types/responses/students/create';
import { StudentsGetResponses } from '../../utils/types/responses/students/get';
import { StudentsSearchAdd } from './components/search-add';
import { StudentsModal } from './components/students-modal';
import { StudentsTable } from './components/table';
import { BackendPath, PageName, SearchFormId, defaultSortString, parseGetData } from './constants';
import { SearchDataType } from './types';

function Students() {
	const { setNotification } = useNotificationContext();
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getStudents = useGet<StudentsGetDto, StudentsGetResponses>(BackendPath, parseGetData);
	const postStudent = usePost<StudentCreateDto, StudentCreateResponse>(BackendPath);
	const postStudentClass = usePost<StudentClassCreateDto, void>(STUDENT_CLASS_API_PATH);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<StudentsGetResponses>({
		queryKey: ['student-list'],
		queryFn: () =>
			getStudents({
				search_text: formData?.text?.value,
				form_id: formData?.form_id?.value,
				reg_date_start: formData?.reg_date_start?.value,
				reg_date_end: formData?.reg_date_end?.value,
				reg_year: formData?.reg_year?.value,
				is_active: formData?.status?.value,
				orderBy,
			}),
		fetchOnVariable: [
			formData?.text?.value,
			formData?.form_id?.value,
			formData?.reg_date_start?.value,
			formData?.reg_date_end?.value,
			formData?.reg_year?.value,
			formData?.status?.value,
			orderBy,
		],
	});

	const handleAdd = async (
		data: StudentCreateDto,
		classIds: number[],
	): Promise<StudentCreateResponse> => {
		const { student_id } = await postStudent(data);
		await postStudentClass(
			classIds.map(value => ({ class_id: value })),
			student_id,
		);
		await refetch();
		setNotification(RecordCreatedMessage('Student'));
		return { student_id };
	};

	return (
		<React.Fragment>
			<Head>
				<title>{PageName}</title>
			</Head>
			<Layout headerTitle={PageName}>
				<Loader isLoading={isLoading}>
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<StudentsSearchAdd setToggleModal={setToggleModal} />
						<StudentsTable data={data} refetch={refetch} setOrderBy={setOrderBy} />
						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<StudentsModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Students;
