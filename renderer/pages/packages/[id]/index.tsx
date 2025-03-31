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
import { PACKAGE_API_PATH } from '../../../utils/constants/constants';
import { parseDateTime } from '../../../utils/dateOperations';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { tryParseInt } from '../../../utils/numberParsers';
import { PackageUpdateDto } from '../../../utils/types/dtos/packages/update';
import { PackagesGetResponse } from '../../../utils/types/responses/packages/get';
import { PackagesInputForm } from '../packages-input-form';

const parsePackageData = (value: PackagesGetResponse) => {
	const newValue = { ...value };
	newValue.start_date = parseDateTime(newValue.start_date);
	newValue.end_date = parseDateTime(newValue.end_date);
	return newValue;
};

const formId = 'edit-package';

function ClassEdit() {
	const router = useRouter();
	const packageId = (router.query.id as string) ?? '';
	const { setNotification } = useNotificationContext();
	const { updateInitialValues } = useFormContext(formId);

	// Fetch Data
	const getPackages = useGet<null, PackagesGetResponse>(PACKAGE_API_PATH, parsePackageData);
	const { data, isLoading, refetch } = useCustomQuery<PackagesGetResponse>({
		queryKey: ['view-package'],
		queryFn: () => packageId && getPackages(null, packageId),
		fetchOnVariable: [packageId],
		fetchOnlyIfDefined: [packageId],
		disabled: true,
	});

	// Update
	const updateClass = usePost<PackageUpdateDto, void>(PACKAGE_API_PATH);
	const handleUpdate = async (data: { [key: string]: { value: any } }) => {
		const updateDto = {};
		Object.keys(data).forEach(key => (updateDto[key] = data[key].value));
		try {
			await updateClass(updateDto, packageId);
			refetch();
			setNotification(RecordUpdatedMessage('Package'));
			updateInitialValues();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>Edit Package</title>
			</Head>

			<Layout headerTitle="Edit Package">
				<Loader isLoading={isLoading || data?.id !== tryParseInt(packageId, 0)}>
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
							<PackagesInputForm
								defaultValue={{
									form_id: data?.form?.id,
									subject_count_from: data?.subject_count_from,
									subject_count_to: data?.subject_count_to,
									discount_per_subject: data?.discount_per_subject,
									start_date: data?.start_date,
									end_date: data?.end_date,
								}}
							/>
						</Form>
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default ClassEdit;
