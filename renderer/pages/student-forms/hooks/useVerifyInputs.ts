import { useNotificationContext } from '../../../components/providers/notification-providers';
import { fieldCheckerRequired } from '../../../utils/field-checker';
import { GenericSetSingleFormData } from '../../../utils/types/form';
import { FormDataType } from '../types';

type PropType = {
	formData: FormDataType;
	setFormData: GenericSetSingleFormData;
};

export function useVerifyInputs({ formData, setFormData }: PropType) {
	const { setNotification } = useNotificationContext();

	return () => {
		let valid = true;

		valid = fieldCheckerRequired(
			valid,
			formData,
			'form_name',
			'Form Name',
			setFormData,
			setNotification,
		);

		return valid;
	};
}
