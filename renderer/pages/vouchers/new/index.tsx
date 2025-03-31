import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Form } from '../../../components/inputs/form';
import { NavigateBack } from '../../../components/navigate-back';
import { useFormContext } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { usePost } from '../../../hooks/use-post';
import { Layout } from '../../../layouts/basic_layout';
import { VOUCHER_API_PATH } from '../../../utils/constants/constants';
import { getToday } from '../../../utils/dateOperations';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { VoucherCreateDto } from '../../../utils/types/dtos/vouchers/create';
import { VouchersCreateResponse } from '../../../utils/types/responses/vouchers/create';
import { VouchersInputForm } from '../vouchers-input-form';

const formId = 'new-voucher';

function VoucherNew() {
	const router = useRouter();
	const { resetForm } = useFormContext(formId);
	const { setNotification } = useNotificationContext();

	// Create
	const createVoucher = usePost<VoucherCreateDto, VouchersCreateResponse>(VOUCHER_API_PATH);
	const handleCreate = async (data: { [key: string]: { value: any } }) => {
		const createDto = {};
		Object.keys(data).forEach(key => (createDto[key] = data[key].value));
		try {
			const { id } = await createVoucher(createDto as VoucherCreateDto);
			setNotification(RecordUpdatedMessage('Voucher'));
			router.replace(`/vouchers/${id}`);
			resetForm();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>New Class</title>
			</Head>

			<Layout headerTitle="New Class">
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
						submitText="Create Class"
						onSubmit={handleCreate}
						revertible
						keepData
					>
						<VouchersInputForm defaultValue={{ start_date: getToday() }} />
					</Form>
				</div>
			</Layout>
		</React.Fragment>
	);
}

export default VoucherNew;
