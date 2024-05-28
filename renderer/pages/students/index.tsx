import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { FormProvider } from '../../components/providers/form-providers';
import { useNotificationContext } from '../../components/providers/notification-providers';
import { useGet } from '../../hooks/use-get';
import { Layout } from '../../layouts/basic_layout';
import { SERVER_CONNECTION_ERROR } from '../../utils/constants/ErrorResponses';
import { StudentClassCreateDto } from '../../utils/types/dtos/student-classes/create';
import { StudentCreateDto } from '../../utils/types/dtos/students/create';
import { StudentsGetDto } from '../../utils/types/dtos/students/get';
import { ErrorResponse } from '../../utils/types/responses/error';
import { StudentCreateResponse } from '../../utils/types/responses/students/create';
import { StudentsGetResponses } from '../../utils/types/responses/students/get';
import { StudentsSearchAdd } from './components/search-add';
import { StudentsModal } from './components/students-modal';
import { StudentsTable } from './components/table';
import { formDefaultValue, searchDefaultValue } from './constants';

function Students() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>('');
	const [formId, setFormId] = useState<number>(undefined);
	const [regDateStart, setRegDateStart] = useState<Date>(undefined);
	const [regDateEnd, setRegDateEnd] = useState<Date>(undefined);
	const [regYear, setRegYear] = useState<number>(undefined);
	const [isActive, setIsActive] = useState<boolean>(true);
	const [orderBy, setOrderBy] = useState<string>('student_name asc');
	const [toggleModal, setToggleModal] = useState(false);

	const parseData = (data: StudentsGetResponses) =>
		data.map(value => {
			value.reg_date = new Date(value.reg_date);
			return value;
		});

	const getStudents = useGet<StudentsGetDto, StudentsGetResponses>('/api/students', parseData);
	const { data, isLoading, error, isError, dataUpdatedAt, refetch } = useQuery<
		StudentsGetResponses,
		AxiosError<ErrorResponse>
	>({
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
		enabled: true,
	});

	const handleAdd = useCallback(
		async (createData: StudentCreateDto, classIds: number[]) => {
			try {
				const {
					data: { student_id },
				} = await axios.post<any, AxiosResponse<StudentCreateResponse, any>, StudentCreateDto>(
					`/api/students`,
					createData,
				);

				await axios.post<any, AxiosResponse<any, any>, StudentClassCreateDto>(
					`/api/student-classes/${student_id}`,
					classIds.map(value => ({ class_id: value })),
				);

				await refetch();
				setNotification({
					title: 'New Student Added!',
					message: 'Student Added Successfully!',
					type: 'INFO',
				});
			} catch (error: any) {
				if (isError) {
					if (error instanceof AxiosError) {
						setNotification({ ...error?.response?.data?.error });
					} else {
						setNotification(SERVER_CONNECTION_ERROR);
					}
				}
			}
		},
		[refetch, setNotification],
	);

	useEffect(() => {
		if (isError) {
			if (error instanceof AxiosError) {
				setNotification({ ...error?.response?.data?.error });
			} else {
				setNotification(SERVER_CONNECTION_ERROR);
			}
		}
	}, [isError]);

	useEffect(() => {
		void refetch();
	}, [search, formId, regDateStart, regDateEnd, regYear, isActive, orderBy]);

	return (
		<React.Fragment>
			<Head>
				<title>Students</title>
			</Head>
			<Layout headerTitle={'Students'}>
				{isLoading ? (
					<Loader />
				) : (
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
						<LastUpdatedAt
							lastUpdatedAt={dataUpdatedAt ?? new Date(dataUpdatedAt)}
							refetch={refetch}
						/>

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue}>
								<StudentsModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				)}
			</Layout>
		</React.Fragment>
	);
}

export default Students;
