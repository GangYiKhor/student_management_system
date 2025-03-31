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
import { TAX_API_PATH } from '../../../utils/constants/constants';
import { parseDateTime } from '../../../utils/dateOperations';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { tryParseInt } from '../../../utils/numberParsers';
import { TaxUpdateDto } from '../../../utils/types/dtos/taxes/update';
import { TaxesGetResponse } from '../../../utils/types/responses/taxes/get';
import { TaxInputForm } from '../taxes-input-form';

const parseTaxData = (value: TaxesGetResponse) => {
	const newValue = { ...value };
	newValue.start_date = parseDateTime(newValue.start_date);
	newValue.end_date = parseDateTime(newValue.end_date);
	return newValue;
};

const formId = 'edit-tax';

function TaxEdit() {
	const router = useRouter();
	const taxId = (router.query.id as string) ?? '';
	const { setNotification } = useNotificationContext();
	const { updateInitialValues } = useFormContext(formId);

	// Fetch Data
	const getTax = useGet<null, TaxesGetResponse>(TAX_API_PATH, parseTaxData);
	const { data, isLoading, refetch } = useCustomQuery<TaxesGetResponse>({
		queryKey: ['view-class'],
		queryFn: () => taxId && getTax(null, taxId),
		fetchOnVariable: [taxId],
		fetchOnlyIfDefined: [taxId],
		disabled: true,
	});

	// Update
	const updateTax = usePost<TaxUpdateDto, void>(TAX_API_PATH);
	const handleUpdate = async (data: { [key: string]: { value: any } }) => {
		const updateDto = {};
		Object.keys(data).forEach(key => (updateDto[key] = data[key].value));
		try {
			await updateTax(updateDto, taxId);
			refetch();
			setNotification(RecordUpdatedMessage('Tax'));
			updateInitialValues();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>Edit Tax</title>
			</Head>

			<Layout headerTitle="Edit Tax">
				<Loader isLoading={isLoading || data?.id !== tryParseInt(taxId, 0)}>
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
							<TaxInputForm
								defaultValue={{
									percentage: data?.percentage,
									inclusive: data?.inclusive,
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

export default TaxEdit;
