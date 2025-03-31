import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Form } from '../../../components/inputs/form';
import { Loader } from '../../../components/loader';
import { NavigateBack } from '../../../components/navigate-back';
import { useFormContext } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGet } from '../../../hooks/use-get';
import { usePost } from '../../../hooks/use-post';
import { Layout } from '../../../layouts/basic_layout';
import { HOLIDAY_API_PATH } from '../../../utils/constants/constants';
import { parseDateTime } from '../../../utils/dateOperations';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { tryParseInt } from '../../../utils/numberParsers';
import { HolidayUpdateDto } from '../../../utils/types/dtos/holidays/update';
import { HolidaysGetResponse } from '../../../utils/types/responses/holidays/get';
import { HolidaysInputForm } from '../holidays-input-form';

const parseHolidayData = (value: HolidaysGetResponse) => {
	const newValue = { ...value };
	newValue.date = parseDateTime(newValue.date);
	return newValue;
};

const formId = 'edit-holiday';

function HolidayNew() {
	const router = useRouter();
	const holidayId = (router.query.id as string) ?? '';
	const { setNotification } = useNotificationContext();
	const { updateInitialValues } = useFormContext(formId);

	// Fetch Data
	const getHoliday = useGet<null, HolidaysGetResponse>(HOLIDAY_API_PATH, parseHolidayData);
	const { data, isLoading, refetch } = useCustomQuery<HolidaysGetResponse>({
		queryKey: ['view-holiday'],
		queryFn: () => holidayId && getHoliday(null, holidayId),
		fetchOnVariable: [holidayId],
		fetchOnlyIfDefined: [holidayId],
		disabled: true,
	});

	// Update
	const updateHoliday = usePost<HolidayUpdateDto, void>(HOLIDAY_API_PATH);
	const handleUpdate = async (data: { [key: string]: { value: any } }) => {
		const createDto = {};
		Object.keys(data).forEach(key => (createDto[key] = data[key].value));
		try {
			await updateHoliday(createDto as HolidayUpdateDto);
			refetch();
			setNotification(RecordUpdatedMessage('Holiday'));
			updateInitialValues();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>Edit Holiday</title>
			</Head>

			<Layout headerTitle="Edit Holiday">
				<Loader isLoading={isLoading || data?.id !== tryParseInt(holidayId, 0)}>
					<div
						className={clsx(
							'flex flex-col gap-5',
							'max-w-2xl',
							'm-auto px-10 py-5',
							'bg-slate-200 dark:bg-[rgba(0,0,0,0.2)]',
							'rounded-lg',
							'drop-shadow',
						)}
					>
						<div className={clsx('text-left')}>
							<NavigateBack />
						</div>

						<Form
							formId={formId}
							submitText="Update"
							onSubmit={handleUpdate}
							defaultLocked
							lockable
							revertible
						>
							<HolidaysInputForm
								defaultValue={{ date: data?.date, description: data?.description }}
							/>
						</Form>
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default HolidayNew;
