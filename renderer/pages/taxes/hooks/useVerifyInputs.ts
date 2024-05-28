import { useNotificationContext } from '../../../components/providers/notification-providers';
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

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'percentage',
			'Percentage',
			setFormData,
			setNotification,
			(value: number) => value >= 0,
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
			(value: Date) => value?.getTime() >= formData.start_date?.value?.getTime(),
		);

		valid = fieldCheckerRequired(
			valid,
			formData,
			'inclusive',
			'Inclusive',
			setFormData,
			setNotification,
		);

		return valid;
	};
}
