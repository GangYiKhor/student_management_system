import Head from 'next/head';
import React, { useState } from 'react';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { FormProvider } from '../../components/providers/form-providers';
import { useNotificationContext } from '../../components/providers/notification-providers';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGet } from '../../hooks/use-get';
import { usePost } from '../../hooks/use-post';
import { Layout } from '../../layouts/basic_layout';
import { RecordCreatedMessage } from '../../utils/notifications/record-created';
import { ContentContainer } from '../../utils/tailwindClass/containers';
import { HolidayCreateDto } from '../../utils/types/dtos/holidays/create';
import { HolidaysGetDto } from '../../utils/types/dtos/holidays/get';
import { HolidaysGetResponses } from '../../utils/types/responses/holidays/get';
import { HolidaysModal } from './components/holidays-modal';
import { HolidaysSearchAdd } from './components/search-add';
import { HolidaysTable } from './components/table';
import {
	BackendPath,
	PageName,
	defaultSortString,
	formDefaultValue,
	parseGetData,
	searchDefaultValue,
} from './constants';

function Holidays() {
	const { setNotification } = useNotificationContext();
	const [search, setSearch] = useState<string>(searchDefaultValue.general.value);
	const [startDate, setStartDate] = useState<Date>(searchDefaultValue.start_date.value);
	const [endDate, setEndDate] = useState<Date>(searchDefaultValue.end_date.value);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getHolidays = useGet<HolidaysGetDto, HolidaysGetResponses>(BackendPath, parseGetData);
	const postHoliday = usePost<HolidayCreateDto, void>(BackendPath);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<HolidaysGetResponses>({
		queryKey: ['holidays'],
		queryFn: () => getHolidays({ startDate, endDate, orderBy }),
		fetchOnVariable: [startDate, endDate, orderBy],
	});

	const handleAdd = async (data: HolidayCreateDto) => {
		await postHoliday(data);
		await refetch();
		setNotification(RecordCreatedMessage('Holidays'));
	};

	return (
		<React.Fragment>
			<Head>
				<title>{PageName}</title>
			</Head>
			<Layout headerTitle={PageName}>
				<Loader isLoading={isLoading}>
					<div className={ContentContainer}>
						<FormProvider defaultValue={searchDefaultValue}>
							<HolidaysSearchAdd
								setSearch={setSearch}
								setStartDate={setStartDate}
								setEndDate={setEndDate}
								setToggleModal={setToggleModal}
							/>
						</FormProvider>

						<HolidaysTable data={data} search={search} refetch={refetch} setOrderBy={setOrderBy} />

						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<FormProvider defaultValue={formDefaultValue()}>
								<HolidaysModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
							</FormProvider>
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Holidays;
