import { startCase } from 'lodash';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { MONTH_SHORT } from '../../../utils/constants/constants';
import { fieldCheckerRequired, fieldCheckerValue } from '../../../utils/field-checker';
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
			'student',
			'Student',
			setFormData,
			setNotification,
		);

		valid = fieldCheckerRequired(valid, formData, 'date', 'Date', setFormData, setNotification);

		valid = fieldCheckerRequired(
			valid,
			formData,
			'payment_year',
			'Year',
			setFormData,
			setNotification,
		);

		const valueChecks = Object.values(MONTH_SHORT).map(value => value.toLowerCase());

		valid = valueChecks.reduce(
			(prev, value) =>
				fieldCheckerValue(
					prev,
					formData,
					value,
					startCase(value),
					setFormData,
					setNotification,
					(value: number) => value >= 0 && value <= 1,
				),
			valid,
		);

		valid = fieldCheckerValue(
			valid,
			formData,
			'reg_fees',
			'Reg Fees',
			setFormData,
			setNotification,
			(value: number) => value >= 0,
		);

		return valid;
	};
}
