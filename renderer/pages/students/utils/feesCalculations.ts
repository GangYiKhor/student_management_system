import { CLASS_COUNT } from '../../../utils/constants/constants';
import { ClassesGetResponse } from '../../../utils/types/responses/classes/get';
import { PackagesGetResponse } from '../../../utils/types/responses/packages/get';
import { FormDataType } from '../types';

export function getPackageCount(formData: FormDataType): number {
	let packageCount = 0;

	for (let i = 0; i < CLASS_COUNT; i++) {
		const curClass = formData[`class_${i}`]?.value as ClassesGetResponse;
		packageCount += curClass?.is_package ? 1 : 0;
	}

	return packageCount;
}

export function getDiscountedFees(
	value: ClassesGetResponse,
	curPackage: PackagesGetResponse,
): number {
	if (!value) {
		return 0;
	}
	if (value?.is_package) {
		return value?.fees - (curPackage?.discount_per_subject ?? 0);
	} else {
		return value?.fees;
	}
}

export function getAllFees(formData: FormDataType): number {
	let fees = 0;

	for (let i = 0; i < CLASS_COUNT; i++) {
		fees += (formData[`class_${i}`]?.value as ClassesGetResponse)?.fees ?? 0;
	}

	return fees;
}

export function getAllFeesDiscounted(
	formData: FormDataType,
	curPackage: PackagesGetResponse,
): number {
	let fees = 0;

	for (let i = 0; i < CLASS_COUNT; i++) {
		const curClass = formData[`class_${i}`]?.value as ClassesGetResponse;
		fees += getDiscountedFees(curClass, curPackage);
	}

	return fees;
}
