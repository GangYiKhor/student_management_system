import { useNotificationContext } from '../../../components/providers/notification-providers';
import { isSameDayOrAfter } from '../../../utils/dateOperations';
import { fieldCheckerRequired, fieldCheckerRequiredValue } from '../../../utils/field-checker';
import { FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	setFormData: (value: { name: string; value?: any; valid?: boolean }) => void;
};

export function useVerifyInputs({ formData, setFormData }: PropType) {
	const { setNotification } = useNotificationContext();

	return () => {
		let valid = true;

		valid = fieldCheckerRequired(valid, formData, 'id', 'Voucher ID', setFormData, setNotification);

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'discount',
			'Discount',
			setFormData,
			setNotification,
			(value: number) => (value > 0 && formData?.is_percentage?.value ? value <= 100 : true),
		);

		valid = fieldCheckerRequired(
			valid,
			formData,
			'is_percentage',
			'Is Percentage',
			setFormData,
			setNotification,
		);

		valid = fieldCheckerRequired(
			valid,
			formData,
			'start_date',
			'Start Date',
			setFormData,
			setNotification,
		);

		valid = fieldCheckerRequiredValue(
			valid,
			formData,
			'expired_at',
			'Expiry Date',
			setFormData,
			setNotification,
			(value: Date) => isSameDayOrAfter(value, formData.start_date?.value),
		);

		valid = fieldCheckerRequired(
			valid,
			formData,
			'used',
			'Voucher Used',
			setFormData,
			setNotification,
		);

		return valid;
	};
}
