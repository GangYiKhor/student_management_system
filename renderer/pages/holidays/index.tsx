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
import { HolidayCreateDto } from '../../utils/types/dtos/holidays/create';
import { HolidaysGetDto } from '../../utils/types/dtos/holidays/get';
import { ErrorResponse } from '../../utils/types/responses/error';
import { HolidaysGetResponses } from '../../utils/types/responses/holidays/get';
import { HolidaysModal } from './components/holidays-modal';
import { HolidaysSearchAdd } from './components/search-add';
import { HolidaysTable } from './components/table';
import { formDefaultValue, searchDefaultValue } from './constants';

function Holidays() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>('');
	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();
	const [orderBy, setOrderBy] = useState<'date asc' | 'date desc'>('date asc');
	const [toggleModal, setToggleModal] = useState(false);

	const parseData = (data: HolidaysGetResponses) =>
		data.map(value => {
			value.date = new Date(value.date);
			return value;
		});

	const getHolidays = useGet<HolidaysGetDto, HolidaysGetResponses>('/api/holidays', parseData);
	const { data, isLoading, error, isError, dataUpdatedAt, refetch } = useQuery<
		HolidaysGetResponses,
		AxiosError<ErrorResponse>
	>({
		queryKey: ['holidays'],
		queryFn: () => getHolidays({ startDate, endDate, orderBy }),
		enabled: true,
	});

	const handleAdd = useCallback(
		async (createData: HolidayCreateDto) => {
			try {
				await axios.post<any, AxiosResponse<any, any>, HolidayCreateDto>(
					`/api/holidays`,
					createData,
				);
				await refetch();
				setNotification({
					title: 'New Holiday Added!',
					message: 'Holiday Added Successfully!',
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
	}, [startDate, endDate, orderBy]);

	return (
		<React.Fragment>
			<Head>
				<title>Holidays</title>
			</Head>
			<Layout headerTitle={'Holidays'}>
				{isLoading ? (
					<Loader />
				) : (
					<div className={clsx('flex', 'flex-col', 'gap-4')}>
						<FormProvider defaultValue={searchDefaultValue}>
							<HolidaysSearchAdd
								setSearch={setSearch}
								setStartDate={setStartDate}
								setEndDate={setEndDate}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<HolidaysTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />
						<LastUpdatedAt
							lastUpdatedAt={dataUpdatedAt ?? new Date(dataUpdatedAt)}
							refetch={refetch}
						/>

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue}>
								<HolidaysModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				)}
			</Layout>
		</React.Fragment>
	);
}

export default Holidays;
