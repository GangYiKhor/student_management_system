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
import { STUDENT_API_PATH, STUDENT_CLASS_API_PATH } from '../../../utils/constants/constants';
import { getToday } from '../../../utils/dateOperations';
import { RecordUpdatedMessage } from '../../../utils/notifications/record-updated';
import { tryParseInt } from '../../../utils/numberParsers';
import { StudentClassCreateDto } from '../../../utils/types/dtos/student-classes/create';
import { StudentCreateDto } from '../../../utils/types/dtos/students/create';
import { StudentCreateResponse } from '../../../utils/types/responses/students/create';
import { StudentsInputForm } from '../students-input-form';

const formId = 'new-student';

function StudentNew() {
	const router = useRouter();
	const { resetForm, updateFieldValid } = useFormContext(formId);
	const { setNotification } = useNotificationContext();

	// Create
	const createStudent = usePost<StudentCreateDto, StudentCreateResponse>(STUDENT_API_PATH);
	const postStudentClass = usePost<StudentClassCreateDto, void>(STUDENT_CLASS_API_PATH);
	const handleCreate = async (data: { [key: string]: { value: any } }) => {
		const createDto = {};
		const classDto = [];
		const classIds = new Map();
		let valid = true;

		Object.keys(data).forEach(key => {
			if (key?.startsWith('class_') && data[key].value?.id) {
				const index = tryParseInt(key.split('_')[1], classDto.length);
				classDto[index] = { class_id: data[key].value.id };
				if (data[key].value.id !== null) {
					if (classIds.has(data[key].value.id)) {
						updateFieldValid([
							{ field: `class_${index}`, valid: false },
							{ field: `class_${classIds.get(data[key].value.id)}`, valid: false },
						]);
						valid = false;
					} else {
						classIds.set(data[key].value.id, index);
					}
				}
			} else {
				createDto[key] = data[key].value;
			}
		});

		if (!valid) {
			setNotification({ title: 'Duplicate Class', source: 'Form' });
			return false;
		}

		try {
			const { student_id: id } = await createStudent(createDto as StudentCreateDto);
			await postStudentClass(classDto as StudentClassCreateDto, id);
			setNotification(RecordUpdatedMessage('Students'));
			router.replace(`/students/${id}`);
			resetForm();
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<React.Fragment>
			<Head>
				<title>New Student</title>
			</Head>

			<Layout headerTitle="New Student">
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
						submitText="Create Student"
						onSubmit={handleCreate}
						revertible
						keepData
					>
						<StudentsInputForm
							defaultValue={{
								reg_date: getToday(),
								reg_year: new Date().getFullYear(),
							}}
						/>
					</Form>
				</div>
			</Layout>
		</React.Fragment>
	);
}

export default StudentNew;
