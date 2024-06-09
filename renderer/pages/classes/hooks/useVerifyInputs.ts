import { useNotificationContext } from '../../../components/providers/notification-providers';
import { isSameDayOrAfter, isSameTimeOrAfter } from '../../../utils/dateOperations';
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
			'class_name',
			'Class Name',
			setFormData,
			setNotification,
		);

		valid = fieldCheckerRequired(valid, formData, 'form_id', 'Form', setFormData, setNotification);

		valid = fieldCheckerRequired(
			valid,
			formData,
			'teacher_id',
			'Teacher',
			setFormData,
			setNotification,
		);

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'class_year',
			'Year',
			setFormData,
			setNotification,
			(value: number) => 2000 <= value && value <= 2200,
		);

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

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'day',
			'Day',
			setFormData,
			setNotification,
			(value: number) => 1 <= value && value <= 7,
		);

		valid = fieldCheckerRequired(
			valid,
			formData,
			'start_time',
			'Start Time',
			setFormData,
			setNotification,
		);

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'end_time',
			'End Time',
			setFormData,
			setNotification,
			(value: Date) => isSameTimeOrAfter(value, formData.start_time?.value),
		);

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'fees',
			'Fees',
			setFormData,
			setNotification,
			(value: number) => value >= 0,
		);

		valid = fieldCheckerRequired(
			valid,
			formData,
			'is_package',
			'Package',
			setFormData,
			setNotification,
		);

		return valid;
	};
}
