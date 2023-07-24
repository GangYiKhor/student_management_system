import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useGet } from '../../hooks/use-get';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../layouts/basic_layout';
import { Loader } from '../../components/loader';
import { ClassTable } from './components/table';
import clsx from 'clsx';
import { AxiosError } from 'axios';
import { ClassSearchAdd } from './components/search-add';
import { LastUpdatedAt } from '../../components/last-updated';
import { ErrorResponse } from '../../responses/error';
import { useNotificationContext } from '../../components/providers/notification-providers';
import { ClassGetDto } from '../../dtos/class/get';
import { ClassGetResponse } from '../../responses/class/get';

const layoutClass = clsx('flex', 'flex-col', 'gap-4');

function ClassRegistration() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>('');
	const [formId, setFormId] = useState<number>(undefined);
	const [teacherId, setTeacherId] = useState<number>(undefined);
	const [classYear, setClassYear] = useState<number>(undefined);
	const [day, setDay] = useState<number>(undefined);
	const [isActive, setIsActive] = useState<boolean>(true);
	const [orderBy, setOrderBy] = useState<string>('teacher_name asc');

	const parseData = (data: ClassGetResponse[]) => {
		for (const row of data) {
			row.start_date = new Date(row.start_date);
			row.end_date = new Date(row.end_date);
			row.start_time = new Date(row.start_time);
			row.end_time = new Date(row.end_time);
		}

		return data;
	};
	const getClass = useGet<ClassGetDto, ClassGetResponse[]>('/api/class', parseData);
	const { data, isLoading, error, isError, dataUpdatedAt, refetch } = useQuery<
		ClassGetResponse[],
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
			} as ClassGetDto),
		enabled: true,
	});

	useEffect(() => {
		void refetch();
	}, [formId, teacherId, day, orderBy]);

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
				<title>Packages</title>
			</Head>
			<Layout headerTitle={'Teachers'}>
				{isLoading ? (
					<Loader />
				) : (
					<div className={layoutClass}>
						<ClassSearchAdd
							setSearch={setSearch}
							setFormId={setFormId}
							setTeacherId={setTeacherId}
							setClassYear={setClassYear}
							setDay={setDay}
							setIsActive={setIsActive}
							refetch={refetch}
						/>
						<ClassTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />
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

export default ClassRegistration;
