import { useNotificationContext } from '../../../components/providers/notification-providers';
import { isSameDayOrAfter } from '../../../utils/dateOperations';
import {
	fieldCheckerRequired,
	fieldCheckerRequiredValue,
	fieldCheckerValue,
} from '../../../utils/field-checker';
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
			'start_date',
			'Start Date',
			setFormData,
			setNotification,
		);

		valid = fieldCheckerValue(
			valid,
			formData,
			'end_date',
			'End Date',
			setFormData,
			setNotification,
			(value: Date) => isSameDayOrAfter(value, formData.start_date?.value),
		);

		valid = fieldCheckerRequired(valid, formData, 'form_id', 'Form', setFormData, setNotification);

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'subject_count_from',
			'Subject Count From',
			setFormData,
			setNotification,
			(value: number) => value >= 0,
		);

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'subject_count_to',
			'Subject Count To',
			setFormData,
			setNotification,
			(value: number) => value >= formData.subject_count_from?.value,
		);

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'discount_per_subject',
			'Discount',
			setFormData,
			setNotification,
			(value: number) => value >= 0,
		);

		return valid;
	};
}
