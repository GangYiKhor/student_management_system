import { useNotificationContext } from '../../../components/providers/notification-providers';
import {
	fieldCheckerRequired,
	fieldCheckerRequiredValue,
	fieldCheckerValue,
} from '../../../utils/field-checker';
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

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'phone_number',
			'Phone Number',
			setFormData,
			setNotification,
			verifyPhoneNumber,
		);

		valid = fieldCheckerRequiredValue(
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

		return valid;
	};
}
