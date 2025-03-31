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
import { VOUCHER_API_PATH } from '../../../utils/constants/constants';
import { parseDateTime } from '../../../utils/dateOperations';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { VoucherUpdateDto } from '../../../utils/types/dtos/vouchers/update';
import { VouchersGetResponse } from '../../../utils/types/responses/vouchers/get';
import { VouchersInputForm } from '../vouchers-input-form';

const parseVoucherData = (value: VouchersGetResponse) => {
	const newValue = { ...value };
	newValue.start_date = parseDateTime(newValue.start_date);
	newValue.expired_at = parseDateTime(newValue.expired_at);
	return newValue;
};

const formId = 'edit-voucher';

function VoucherEdit() {
	const router = useRouter();
	const voucherId = (router.query.id as string) ?? '';
	const { setNotification } = useNotificationContext();
	const { updateInitialValues } = useFormContext(formId);

	// Fetch Data
	const getVouchers = useGet<null, VouchersGetResponse>(VOUCHER_API_PATH, parseVoucherData);
	const { data, isLoading, refetch } = useCustomQuery<VouchersGetResponse>({
		queryKey: ['view-voucher'],
		queryFn: () => voucherId && getVouchers(null, voucherId),
		fetchOnVariable: [voucherId],
		fetchOnlyIfDefined: [voucherId],
		disabled: true,
	});

	// Update
	const updateVoucher = usePost<VoucherUpdateDto, void>(VOUCHER_API_PATH);
	const handleUpdate = async (data: { [key: string]: { value: any } }) => {
		const updateDto = {};
		Object.keys(data).forEach(key => (updateDto[key] = data[key].value));
		try {
			await updateVoucher(updateDto, voucherId);
			refetch();
			setNotification(RecordUpdatedMessage('Voucher'));
			updateInitialValues();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>Edit Voucher</title>
			</Head>

			<Layout headerTitle="Edit Voucher">
				<Loader isLoading={isLoading || data?.id !== voucherId}>
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
							<VouchersInputForm
								defaultValue={{
									id: data?.id,
									student_id: data?.student?.id,
									discount: data?.discount,
									is_percentage: data?.is_percentage,
									start_date: data?.start_date,
									expired_at: data?.expired_at,
									used: data?.used,
								}}
							/>
						</Form>
					</div>
				</Loader>
			</Layout>
		</React.Fragment>
	);
}

export default VoucherEdit;
