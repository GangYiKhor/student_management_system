import Head from 'next/head';
import React, { useState } from 'react';
import { LastUpdatedAt } from '../../components/last-updated';
import { Loader } from '../../components/loader';
import { useFormContextWithId } from '../../components/providers/form-providers';
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
import { BackendPath, PageName, SearchFormId, defaultSortString, parseGetData } from './constants';
import { SearchDataType } from './types';

function Holidays() {
	const { setNotification } = useNotificationContext();
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [orderBy, setOrderBy] = useState<string>(defaultSortString);
	const [toggleModal, setToggleModal] = useState(false);

	const getHolidays = useGet<HolidaysGetDto, HolidaysGetResponses>(BackendPath, parseGetData);
	const postHoliday = usePost<HolidayCreateDto, void>(BackendPath);
	const { data, isLoading, dataUpdatedAt, refetch } = useCustomQuery<HolidaysGetResponses>({
		queryKey: ['holiday-list'],
		queryFn: () =>
			getHolidays({
				startDate: formData?.start_date?.value,
				endDate: formData?.end_date?.value,
				orderBy,
			}),
		fetchOnVariable: [formData?.start_date?.value, formData?.end_date?.value, orderBy],
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
						<HolidaysSearchAdd setToggleModal={setToggleModal} />
						<HolidaysTable data={data} refetch={refetch} setOrderBy={setOrderBy} />
						<LastUpdatedAt lastUpdatedAt={dataUpdatedAt} refetch={refetch} />

						{toggleModal ? (
							<HolidaysModal closeModal={() => setToggleModal(false)} handler={handleAdd} />
						) : null}
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default Holidays;
