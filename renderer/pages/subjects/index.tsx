import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useGet } from '../../hooks/use-get';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../layouts/basic_layout';
import { Loader } from '../../components/loader';
import { SubjectsTable } from './components/table';
import clsx from 'clsx';
import { AxiosError } from 'axios';
import { SubjectsSearchAdd } from './components/search-add';
import { LastUpdatedAt } from '../../components/last-updated';
import { ErrorResponse } from '../../responses/error';
import { useNotificationContext } from '../../components/providers/notification-providers';
import { SubjectsGetResponse } from '../../responses/subjects/get';
import { SubjectsGetDto } from '../../dtos/subjects/get';

const layoutClass = clsx('flex', 'flex-col', 'gap-4');

function Subjects() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>('');
	const [form, setForm] = useState<number | undefined>();
	const [status, setStatus] = useState<boolean>(true);
	const [orderBy, setOrderBy] = useState<string>('subject_name asc');

	const getSubjects = useGet('/api/subjects');
	const { data, isLoading, error, isError, dataUpdatedAt, refetch } = useQuery<
		SubjectsGetResponse,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['subjects'],
		queryFn: () => getSubjects({ form_id: form, is_active: status, orderBy } as SubjectsGetDto),
		enabled: true,
	});

	useEffect(() => {
		void refetch();
	}, [form, status, orderBy]);

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
				<title>Subjects</title>
			</Head>
			<Layout headerTitle={'Subjects'}>
				{isLoading ? (
					<Loader />
				) : (
					<div className={layoutClass}>
						<SubjectsSearchAdd
							setSearch={setSearch}
							setForm={setForm}
							setStatus={setStatus}
							refetch={refetch}
						/>
						<SubjectsTable
							data={data}
							search={search}
							status={status}
							refetch={refetch}
							setOrderBy={setOrderBy}
						/>
						<LastUpdatedAt
							lastUpdatedAt={dataUpdatedAt ?? new Date(dataUpdatedAt)}
							refetch={refetch}
						/>
					</div>
				)}
			</Layout>
		</React.Fragment>
	);
}

export default Subjects;
