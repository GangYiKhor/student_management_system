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
			'teacher_name',
			'Teacher Name',
			setFormData,
			setNotification,
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
