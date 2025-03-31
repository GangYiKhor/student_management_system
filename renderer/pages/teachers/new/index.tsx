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
import { TEACHER_API_PATH } from '../../../utils/constants/constants';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { TeacherCreateDto } from '../../../utils/types/dtos/teachers/create';
import { TeachersCreateResponse } from '../../../utils/types/responses/teachers/create';
import { TeachersInputForm } from '../teachers-input-form';

const formId = 'new-teacher';

function TeacherNew() {
	const router = useRouter();
	const { resetForm } = useFormContext(formId);
	const { setNotification } = useNotificationContext();

	// Create
	const createTeacher = usePost<TeacherCreateDto, TeachersCreateResponse>(TEACHER_API_PATH);
	const handleCreate = async (data: { [key: string]: { value: any } }) => {
		const createDto = {};
		Object.keys(data).forEach(key => (createDto[key] = data[key].value));
		try {
			const { id } = await createTeacher(createDto as TeacherCreateDto);
			setNotification(RecordUpdatedMessage('Teacher'));
			router.replace(`/teachers/${id}`);
			resetForm();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>New Teacher</title>
			</Head>

			<Layout headerTitle="New Teacher">
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
						submitText="Create Teacher"
						onSubmit={handleCreate}
						revertible
						keepData
					>
						<TeachersInputForm />
					</Form>
				</div>
			</Layout>
		</React.Fragment>
	);
}

export default TeacherNew;
