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
import { TAX_API_PATH } from '../../../utils/constants/constants';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { TaxCreateDto } from '../../../utils/types/dtos/taxes/create';
import { TaxesCreateResponse } from '../../../utils/types/responses/taxes/create';
import { TaxInputForm } from '../taxes-input-form';

const formId = 'new-tax';

function TaxNew() {
	const router = useRouter();
	const { resetForm } = useFormContext(formId);
	const { setNotification } = useNotificationContext();

	// Create
	const createTax = usePost<TaxCreateDto, TaxesCreateResponse>(TAX_API_PATH);
	const handleCreate = async (data: { [key: string]: { value: any } }) => {
		const createDto = {};
		Object.keys(data).forEach(key => (createDto[key] = data[key].value));
		try {
			const { id } = await createTax(createDto as TaxCreateDto);
			setNotification(RecordUpdatedMessage('Tax'));
			router.replace(`/taxes/${id}`);
			resetForm();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>New Tax</title>
			</Head>

			<Layout headerTitle="New Tax">
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

					<Form formId={formId} submitText="Create Tax" onSubmit={handleCreate} revertible keepData>
						<TaxInputForm />
					</Form>
				</div>
			</Layout>
		</React.Fragment>
	);
}

export default TaxNew;
