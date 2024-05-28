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
import { ClassCreateDto } from '../../utils/types/dtos/classes/create';
import { ClassesGetDto } from '../../utils/types/dtos/classes/get';
import { ClassesGetResponses } from '../../utils/types/responses/classes/get';
import { ErrorResponse } from '../../utils/types/responses/error';
import { ClassesModal } from './components/classes-modal';
import { ClassesSearchAdd } from './components/search-add';
import { ClassTable } from './components/table';
import { formDefaultValue, searchDefaultValue } from './constants';

function ClassRegistration() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>('');
	const [formId, setFormId] = useState<number>(undefined);
	const [teacherId, setTeacherId] = useState<number>(undefined);
	const [classYear, setClassYear] = useState<number>(undefined);
	const [day, setDay] = useState<number>(undefined);
	const [isActive, setIsActive] = useState<boolean>(true);
	const [orderBy, setOrderBy] = useState<string>('teacher_name asc');
	const [toggleModal, setToggleModal] = useState(false);

	const parseData = (data: ClassesGetResponses) =>
		data.map(value => {
			value.start_date = new Date(value.start_date);
			value.end_date = new Date(value.end_date);
			value.start_time = new Date(value.start_time);
			value.end_time = new Date(value.end_time);
			return value;
		});

	const getClass = useGet<ClassesGetDto, ClassesGetResponses>('/api/classes', parseData);
	const { data, isLoading, error, isError, dataUpdatedAt, refetch } = useQuery<
		ClassesGetResponses,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['class'],
		queryFn: () =>
			getClass({
				form_id: formId,
				teacher_id: teacherId,
				class_year: classYear,
				day,
				is_active: isActive,
				orderBy,
			}),
		enabled: true,
	});

	const handleAdd = useCallback(
		async (createData: ClassCreateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, ClassCreateDto>(`/api/classes`, createData);
				await refetch();
				setNotification({
					title: 'New Class Added!',
					message: 'Class Added Successfully!',
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
	}, [formId, teacherId, classYear, day, isActive, orderBy]);

	return (
		<React.Fragment>
			<Head>
				<title>Classes</title>
			</Head>
			<Layout headerTitle={'Classes'}>
				{isLoading ? (
					<Loader />
				) : (
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<FormProvider defaultValue={searchDefaultValue}>
							<ClassesSearchAdd
								setSearch={setSearch}
								setFormId={setFormId}
								setTeacherId={setTeacherId}
								setClassYear={setClassYear}
								setDay={setDay}
								setIsActive={setIsActive}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<ClassTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />
						<LastUpdatedAt
							lastUpdatedAt={dataUpdatedAt ?? new Date(dataUpdatedAt)}
							refetch={refetch}
						/>

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue}>
								<ClassesModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				)}
			</Layout>
		</React.Fragment>
	);
}

export default ClassRegistration;
