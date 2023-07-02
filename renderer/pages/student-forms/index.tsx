import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useGet } from '../../hooks/use-get';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../layouts/basic_layout';
import { StudentFormsGetResponse } from '../../responses/student-forms/get';
import { Loader } from '../../components/loader';
import { StudentFormsTable } from './components/student-forms-table';
import clsx from 'clsx';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { StudentFormsCreateDto } from '../../dtos/student-forms/create';
import { StudentFormsUpdateDto } from '../../dtos/student-forms/update';
import { StudentFormsSearchAdd } from './components/search-add';
import { LastUpdatedAt } from '../../components/last-updated';
import { ErrorResponse } from '../../responses/error';
import { useNotificationContext } from '../../components/providers/notification-providers';

const layoutClass = clsx('flex', 'flex-col', 'gap-4');

function StudentForm() {
	const getForms = useGet('/api/student-forms');
	const { data, isLoading, error, isError, dataUpdatedAt, refetch } = useQuery<
		StudentFormsGetResponse,
		AxiosError<ErrorResponse>
	>({
		queryKey: [],
		queryFn: () => getForms(),
		enabled: true,
	});
	const [lastUpdated, setLastUpdated] = useState<Date>();
	const [search, setSearch] = useState<string>('');
	const [status, setStatus] = useState<boolean>(undefined);
	const { setNotification } = useNotificationContext();

	const handleAction = useCallback(async (id: number, status: boolean) => {
		try {
			await axios.put<any, AxiosResponse<any, any>, StudentFormsUpdateDto>(
				`/api/student-forms/update/${id}/`,
				{ status },
			);
			await refetch();
			setNotification({
				title: 'Status Updated!',
				message: 'Status Updated Successfully!',
				type: 'INFO',
			});
		} catch (error: any) {
			if (error instanceof AxiosError) {
				setNotification({
					title: error.response.data.error.title,
					message: error.response.data.error.message,
					source: error.response.data.error.source,
					type: 'ERROR',
				});
			} else {
				setNotification({ title: 'Server Error', message: error.message });
			}
		}
	}, []);

	const handleAdd = useCallback(async (formName: string) => {
		console.log('Adding');
		try {
			await axios.post<any, AxiosResponse<any, any>, StudentFormsCreateDto>(
				`/api/student-forms/create/`,
				{ formName },
			);
			await refetch();
			setNotification({
				title: 'New Student Form Created!',
				message: 'Student Form Created Successfully!',
				type: 'INFO',
			});
		} catch (error: any) {
			if (error instanceof AxiosError) {
				setNotification({
					title: error.response.data.error.title,
					message: error.response.data.error.message,
					source: error.response.data.error.source,
					type: 'ERROR',
				});
			} else {
				setNotification({ title: 'Server Error', message: error.message });
			}
		}
	}, []);

	useEffect(() => {
		if (dataUpdatedAt) {
			setLastUpdated(new Date(dataUpdatedAt));
		}
	}, [dataUpdatedAt]);

	useEffect(() => {
		if (isError) {
			if (error) {
				setNotification({
					title: error.response.data.error.title,
					message: error.response.data.error.message,
					source: error.response.data.error.source,
					type: 'ERROR',
				});
			} else {
				setNotification({
					title: 'Server Error!',
					message: 'Unknown Error! Unable to connect to server!',
					source: 'Server',
					type: 'ERROR',
				});
			}
			console.log(error);
		}
	}, [isError]);

	return (
		<React.Fragment>
			<Head>
				<title>Student Forms</title>
			</Head>
			<Layout headerTitle={'Student Forms'}>
				{isLoading ? (
					<Loader />
				) : (
					<div className={layoutClass}>
						<StudentFormsSearchAdd
							setSearch={setSearch}
							setStatus={setStatus}
							handleAdd={handleAdd}
						/>
						<StudentFormsTable
							data={data}
							search={search}
							status={status}
							handleAction={handleAction}
						/>
						<LastUpdatedAt lastUpdatedAt={lastUpdated} refetch={refetch} />
					</div>
				)}
			</Layout>
		</React.Fragment>
	);
}

export default StudentForm;
