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
import { STUDENT_FORM_API_PATH } from '../../../utils/constants/constants';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { StudentFormCreateDto } from '../../../utils/types/dtos/student-forms/create';
import { StudentFormsCreateResponse } from '../../../utils/types/responses/student-forms/create';
import { StudentFormsInputForm } from '../student-forms-input-form';

const formId = 'new-student-forms';

function StudentFormNew() {
	const router = useRouter();
	const { resetForm } = useFormContext(formId);
	const { setNotification } = useNotificationContext();

	// Create
	const createStudentForm = usePost<StudentFormCreateDto, StudentFormsCreateResponse>(
		STUDENT_FORM_API_PATH,
	);
	const handleCreate = async (data: { [key: string]: { value: any } }) => {
		const createDto = {};
		Object.keys(data).forEach(key => (createDto[key] = data[key].value));
		try {
			const { id } = await createStudentForm(createDto as StudentFormCreateDto);
			setNotification(RecordUpdatedMessage('Class'));
			router.replace(`/student-forms/${id}`);
			resetForm();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>New Student Form</title>
			</Head>

			<Layout headerTitle="New Student Form">
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
						submitText="Create Form"
						onSubmit={handleCreate}
						revertible
						keepData
					>
						<StudentFormsInputForm />
					</Form>
				</div>
			</Layout>
		</React.Fragment>
	);
}

export default StudentFormNew;
