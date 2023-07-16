import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useGet } from '../../hooks/use-get';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../layouts/basic_layout';
import { Loader } from '../../components/loader';
import { TeachersTable } from './components/table';
import clsx from 'clsx';
import { AxiosError } from 'axios';
import { TeachersSearchAdd } from './components/search-add';
import { LastUpdatedAt } from '../../components/last-updated';
import { ErrorResponse } from '../../responses/error';
import { useNotificationContext } from '../../components/providers/notification-providers';
import { TeachersGetResponse } from '../../responses/teachers/get';
import { TeachersGetDto } from '../../dtos/teachers/get';

const layoutClass = clsx('flex', 'flex-col', 'gap-4');

function Teachers() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>('');
	const [status, setStatus] = useState<boolean>(true);
	const [orderBy, setOrderBy] = useState<string>('teacher_name asc');

	const getTeachers = useGet('/api/teachers');
	const { data, isLoading, error, isError, dataUpdatedAt, refetch } = useQuery<
		TeachersGetResponse,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['subjects'],
		queryFn: () => getTeachers({ is_active: status, orderBy } as TeachersGetDto),
		enabled: true,
	});

	useEffect(() => {
		void refetch();
	}, [status, orderBy]);

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
				<title>Teachers</title>
			</Head>
			<Layout headerTitle={'Teachers'}>
				{isLoading ? (
					<Loader />
				) : (
					<div className={layoutClass}>
						<TeachersSearchAdd setSearch={setSearch} setStatus={setStatus} refetch={refetch} />
						<TeachersTable
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

export default Teachers;
