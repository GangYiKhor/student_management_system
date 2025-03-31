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
import { PACKAGE_API_PATH } from '../../../utils/constants/constants';
import { getToday } from '../../../utils/dateOperations';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { PackageCreateDto } from '../../../utils/types/dtos/packages/create';
import { PackagesCreateResponse } from '../../../utils/types/responses/packages/create';
import { PackagesInputForm } from '../packages-input-form';

const formId = 'new-package';

function PackageNew() {
	const router = useRouter();
	const { resetForm } = useFormContext(formId);
	const { setNotification } = useNotificationContext();

	// Create
	const createPackage = usePost<PackageCreateDto, PackagesCreateResponse>(PACKAGE_API_PATH);
	const handleCreate = async (data: { [key: string]: { value: any } }) => {
		const createDto = {};
		Object.keys(data).forEach(key => (createDto[key] = data[key].value));
		try {
			const { id } = await createPackage(createDto as PackageCreateDto);
			setNotification(RecordUpdatedMessage('Package'));
			router.replace(`/packages/${id}`);
			resetForm();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>New Package</title>
			</Head>

			<Layout headerTitle="New Package">
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
						submitText="Create Package"
						onSubmit={handleCreate}
						revertible
						keepData
					>
						<PackagesInputForm defaultValue={{ start_date: getToday() }} />
					</Form>
				</div>
			</Layout>
		</React.Fragment>
	);
}

export default PackageNew;
