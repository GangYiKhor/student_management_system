import { useNotificationContext } from '../../../components/providers/notification-providers';
import { CLASS_COUNT } from '../../../utils/constants/constants';
import {
	fieldCheckerRequired,
	fieldCheckerRequiredValue,
	fieldCheckerValue,
} from '../../../utils/field-checker';
import { ClassesGetResponse } from '../../../utils/types/responses/classes/get';
import { verifyEmail, verifyPhoneNumber } from '../../../utils/verifications';
import { FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	setFormData: (value: { name: string; value?: any; valid?: boolean }) => void;
};

export function useVerifyInputs({ formData, setFormData }: PropType) {
	const { setNotification } = useNotificationContext();

	return () => {
		let valid = true;

		valid = fieldCheckerRequired(
			valid,
			formData,
			'student_name',
			'Student Name',
			setFormData,
			setNotification,
		);

		valid = fieldCheckerRequired(valid, formData, 'form_id', 'Form', setFormData, setNotification);

		valid = fieldCheckerRequired(
			valid,
			formData,
			'reg_date',
			'Registration Date',
			setFormData,
			setNotification,
		);

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'reg_year',
			'Registration Year',
			setFormData,
			setNotification,
			(value: number) => 2000 <= value && value <= 2200,
		);

		valid = fieldCheckerValue(
			valid,
			formData,
			'phone_number',
			'Phone Number',
			setFormData,
			setNotification,
			verifyPhoneNumber,
		);

		valid = fieldCheckerValue(
			valid,
			formData,
			'parent_phone_number',
			'Parent Phone Number',
			setFormData,
			setNotification,
			verifyPhoneNumber,
		);

		valid = fieldCheckerValue(
			valid,
			formData,
			'email',
			'Email',
			setFormData,
			setNotification,
			verifyEmail,
		);

		const classChoice = new Set<number>();
		let classValid = true;
		for (let i = 0; i < CLASS_COUNT; i++) {
			const value = formData[`class_${i}`]?.value;
			if (value !== undefined && value !== null) {
				if (classChoice.has((formData[`class_${i}`]?.value as ClassesGetResponse).id)) {
					formData[`class_${i}`].valid = false;
					classValid = false;
				} else {
					classChoice.add((formData[`class_${i}`].value as ClassesGetResponse).id);
				}
			}
		}
		if (!classValid) {
			setNotification({
				title: 'Duplicate Class',
				source: 'Form',
			});
		}
		valid &&= classValid;

		return valid;
	};
}
