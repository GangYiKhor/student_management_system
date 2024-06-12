import clsx from 'clsx';
import Head from 'next/head';
import React, { useState } from 'react';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { FormProvider } from '../../components/providers/form-providers';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGet } from '../../hooks/use-get';
import { usePost } from '../../hooks/use-post';
import { Layout } from '../../layouts/basic_layout';
import { STUDENT_CLASS_API_PATH } from '../../utils/constants/constants';
import { StudentClassCreateDto } from '../../utils/types/dtos/student-classes/create';
import { StudentCreateDto } from '../../utils/types/dtos/students/create';
import { StudentsGetDto } from '../../utils/types/dtos/students/get';
import { StudentCreateResponse } from '../../utils/types/responses/students/create';
import { StudentsGetResponses } from '../../utils/types/responses/students/get';
import { StudentsSearchAdd } from './components/search-add';
import { StudentsModal } from './components/students-modal';
import { StudentsTable } from './components/table';
import {
	BackendPath,
	PageName,
	defaultSortString,
	formDefaultValue,
	parseGetData,
	searchDefaultValue,
} from './constants';

function Students() {
	const [search, setSearch] = useState<string>(searchDefaultValue.text.value);
	const [formId, setFormId] = useState<number>(searchDefaultValue.form_id.value);
	const [regDateStart, setRegDateStart] = useState<Date>(searchDefaultValue.reg_date_start.value);
	const [regDateEnd, setRegDateEnd] = useState<Date>(searchDefaultValue.reg_date_end.value);
	const [regYear, setRegYear] = useState<number>(searchDefaultValue.reg_year.value);
	const [isActive, setIsActive] = useState<boolean>(true);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getStudents = useGet<StudentsGetDto, StudentsGetResponses>(BackendPath, parseGetData);
	const postStudent = usePost<StudentCreateDto, StudentCreateResponse>(BackendPath);
	const postStudentClass = usePost<StudentClassCreateDto, void>(STUDENT_CLASS_API_PATH);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<StudentsGetResponses>({
		queryKey: ['students'],
		queryFn: () =>
			getStudents({
				search_text: search,
				form_id: formId,
				reg_date_start: regDateStart,
				reg_date_end: regDateEnd,
				reg_year: regYear,
				is_active: isActive,
				orderBy,
			}),
		fetchOnVariable: [search, formId, regDateStart, regDateEnd, regYear, isActive, orderBy],
	});

	const handleAdd = async (data: StudentCreateDto, classIds: number[]) => {
		const { student_id } = await postStudent(data);
		await postStudentClass(
			classIds.map(value => ({ class_id: value })),
			student_id,
		);
		await refetch();
	};

	return (
		<React.Fragment>
			<Head>
				<title>{PageName}</title>
			</Head>
			<Layout headerTitle={PageName}>
				<Loader isLoading={isLoading}>
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<FormProvider defaultValue={searchDefaultValue}>
							<StudentsSearchAdd
								setSearch={setSearch}
								setFormId={setFormId}
								setRegDateStart={setRegDateStart}
								setRegDateEnd={setRegDateEnd}
								setRegYear={setRegYear}
								setIsActive={setIsActive}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<StudentsTable data={data} refetch={refetch} setOrderBy={setOrderBy} />

						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue}>
								<StudentsModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Students;
