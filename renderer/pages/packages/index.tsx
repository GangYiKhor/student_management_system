import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useGet } from '../../hooks/use-get';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../layouts/basic_layout';
import { Loader } from '../../components/loader';
import { PackagesTable } from './components/table';
import clsx from 'clsx';
import { AxiosError } from 'axios';
import { PackagesSearchAdd } from './components/search-add';
import { LastUpdatedAt } from '../../components/last-updated';
import { ErrorResponse } from '../../responses/error';
import { useNotificationContext } from '../../components/providers/notification-providers';
import { PackagesGetDto } from '../../dtos/packages/get';
import { PackagesGetResponse } from '../../responses/packages/get';

const layoutClass = clsx('flex', 'flex-col', 'gap-4');

function Packages() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>('');
	const [formId, setFormId] = useState<number>(undefined);
	const [startDate, setStartDate] = useState<Date>(undefined);
	const [endDate, setEndDate] = useState<Date>(undefined);
	const [orderBy, setOrderBy] = useState<string>('form_name asc');

	const parseData = (data: PackagesGetResponse[]) => {
		for (const row of data) {
			row.start_date = new Date(row.start_date);
			row.end_date = row.end_date && new Date(row.end_date);
		}

		return data;
	};
	const getPackages = useGet<PackagesGetDto, PackagesGetResponse[]>('/api/packages', parseData);
	const { data, isLoading, error, isError, dataUpdatedAt, refetch } = useQuery<
		PackagesGetResponse[],
		AxiosError<ErrorResponse>
	>({
		queryKey: ['packages'],
		queryFn: () =>
			getPackages({
				form_id: formId,
				start_date: startDate,
				end_date: endDate,
				orderBy,
			} as PackagesGetDto),
		enabled: true,
	});

	useEffect(() => {
		void refetch();
	}, [formId, startDate, endDate, orderBy]);

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
						<PackagesSearchAdd
							setSearch={setSearch}
							setFormId={setFormId}
							setStartDate={setStartDate}
							setEndDate={setEndDate}
							refetch={refetch}
						/>
						<PackagesTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />
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

export default Packages;
