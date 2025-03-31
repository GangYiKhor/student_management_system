import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { DateInput } from '../../components/inputs/date-input';
import { useFormHandlerContext } from '../../components/inputs/form';
import { NumberInput } from '../../components/inputs/number-input';
import { SelectClass } from '../../components/inputs/select-class';
import { SelectInput } from '../../components/inputs/select-input';
import { TextInput } from '../../components/inputs/text-input';
import { TextAreaInput } from '../../components/inputs/textarea-input';
import Row from '../../components/row';
import { Section } from '../../components/section';
import Separator from '../../components/separator';
import ThinSeparator from '../../components/thin-seperator';
import { useCustomQuery } from '../../hooks/use-custom-query';
import { useGet } from '../../hooks/use-get';
import { useGetClassComboBoxOptions } from '../../hooks/use-get-class-options';
import { useGetFormOptionsIdOnly } from '../../hooks/use-get-form-options';
import { CLASS_COUNT, PACKAGE_API_PATH } from '../../utils/constants/constants';
import { icFormat, icFormatRevert } from '../../utils/formatting/icFormatting';
import { tryParseInt } from '../../utils/numberParsers';
import { GreenBoldText } from '../../utils/tailwindClass/text';
import { PackagesGetDto } from '../../utils/types/dtos/packages/get';
import { GenericSingleFormDataType } from '../../utils/types/form';
import { ClassesGetResponse, ClassesGetResponses } from '../../utils/types/responses/classes/get';
import {
	PackagesGetResponse,
	PackagesGetResponses,
} from '../../utils/types/responses/packages/get';
import { StudentClassesGetResponses } from '../../utils/types/responses/student-classes/get';

function getPackageCount(formData: GenericSingleFormDataType): number {
	let packageCount = 0;

	for (let i = 0; i < CLASS_COUNT; i++) {
		const curClass = formData?.[`class_${i}`]?.value as ClassesGetResponse;
		packageCount += curClass?.is_package ? 1 : 0;
	}

	return packageCount;
}

function getDiscountedFees(value: ClassesGetResponse, curPackage: PackagesGetResponse): number {
	if (!value) {
		return 0;
	}
	if (value?.is_package) {
		return value?.fees - (curPackage?.discount_per_subject ?? 0);
	} else {
		return value?.fees;
	}
}

function getAllFees(formData: GenericSingleFormDataType): number {
	let fees = 0;

	for (let i = 0; i < CLASS_COUNT; i++) {
		fees += (formData?.[`class_${i}`]?.value as ClassesGetResponse)?.fees ?? 0;
	}

	return fees;
}

function getAllFeesDiscounted(
	formData: GenericSingleFormDataType,
	curPackage: PackagesGetResponse,
): number {
	let fees = 0;

	for (let i = 0; i < CLASS_COUNT; i++) {
		const curClass = formData?.[`class_${i}`]?.value as ClassesGetResponse;
		fees += getDiscountedFees(curClass, curPackage);
	}

	return fees;
}

const feesClass = clsx('w-16', 'text-right');

type PropType = {
	defaultValue?: {
		student_name?: string;
		form_id?: number;
		reg_date?: Date;
		reg_year?: number;
		gender?: string;
		ic?: string;
		school?: string;
		phone_number?: string;
		parent_phone_number?: string;
		email?: string;
		address?: string;
		classes?: StudentClassesGetResponses;
	};
};

export function StudentsInputForm({ defaultValue }: Readonly<PropType>) {
	const { formData, updateFieldValue } = useFormHandlerContext();
	const [packageCount, setPackageCount] = useState<number>();
	const [allFees, setAllFees] = useState<number>(0);
	const [allFeesDiscounted, setAllFeesDiscounted] = useState<number>(0);

	// Fetch Options
	const getForms = useGetFormOptionsIdOnly();
	const getClass = useGetClassComboBoxOptions();
	const getPackage = useGet<PackagesGetDto, PackagesGetResponses>(PACKAGE_API_PATH);
	const { data: packageData } = useCustomQuery<PackagesGetResponses>({
		queryKey: ['currentPackage'],
		queryFn: () =>
			getPackage({
				form_id: formData?.form_id?.value,
				subject_count: packageCount,
				is_active: true,
			}),
		fetchOnVariable: [formData?.form_id?.value, packageCount],
		fetchOnlyIfDefined: [packageCount],
	});

	const { data: classOptions } = useCustomQuery<ClassesGetResponses>({
		queryKey: ['classes-options'],
		queryFn: () =>
			getClass({
				form_id: tryParseInt(formData?.form_id?.value, -1),
				is_active: true,
				orderBy: 'class_name asc',
			}),
		fetchOnVariable: [formData?.form_id?.value],
	});

	useEffect(() => {
		for (let i = 0; i < CLASS_COUNT; i++) {
			updateFieldValue([{ field: `class_${i}`, value: null }]);
		}
	}, [formData?.form_id?.value]);

	useEffect(() => {
		if (defaultValue?.classes) {
			for (let i = 0; i < CLASS_COUNT; i++) {
				updateFieldValue([
					{ field: `class_${i}`, value: defaultValue?.classes?.[i]?.class ?? null },
				]);
			}
		}
	}, [defaultValue?.classes]);

	useEffect(() => {
		setPackageCount(getPackageCount(formData as GenericSingleFormDataType));
	}, [JSON.stringify(formData)]);

	useEffect(() => {
		setAllFees(getAllFees(formData as GenericSingleFormDataType));
		setAllFeesDiscounted(
			getAllFeesDiscounted(formData as GenericSingleFormDataType, packageData?.[0]),
		);
	}, [JSON.stringify(formData), packageData]);

	return (
		<div className={clsx('grid')}>
			<TextInput
				id="student_name"
				label="Name"
				maxLength={200}
				defaultValue={defaultValue?.student_name}
				required
			/>

			<Row>
				<SelectInput
					id="form_id"
					label="Form"
					queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
					defaultValue={defaultValue?.form_id}
					required
				/>

				<DateInput id="reg_date" label="Reg Date" defaultValue={defaultValue?.reg_date} required />

				<NumberInput
					id="reg_year"
					label="Academic Year"
					min={2000}
					max={2200}
					step={1}
					defaultValue={defaultValue?.reg_year}
					required
				/>
			</Row>

			<Section title="Student Details" hideable defaultHide={!!defaultValue?.student_name}>
				<SelectInput
					id="gender"
					label="Gender"
					placeholder="Not Specified"
					options={[
						{ value: 'male', label: 'Male' },
						{ value: 'female', label: 'Female' },
					]}
					defaultValue={defaultValue?.gender}
				/>

				<Row>
					<TextInput
						id="ic"
						label="IC"
						placeholder="010203070809"
						maxLength={20}
						onBlurFormat={icFormat}
						onFocusFormat={icFormatRevert}
						defaultValue={defaultValue?.ic}
					/>

					<TextInput
						id="school"
						label="School"
						maxLength={200}
						defaultValue={defaultValue?.school}
					/>
				</Row>

				<Row>
					<TextInput
						tel
						id="phone_number"
						label="Phone Number"
						placeholder="0123456789"
						maxLength={20}
						defaultValue={defaultValue?.phone_number}
					/>

					<TextInput
						tel
						id="parent_phone_number"
						label="Parent H/P"
						placeholder="0123456789"
						maxLength={20}
						defaultValue={defaultValue?.parent_phone_number}
					/>
				</Row>

				<TextInput
					email
					label="Email"
					id="email"
					maxLength={200}
					defaultValue={defaultValue?.email}
				/>
				<TextAreaInput
					label="Address"
					id="address"
					maxLength={250}
					defaultValue={defaultValue?.address}
				/>
			</Section>

			<Section title="Classes" hideable>
				<div className={clsx('flex', 'flex-col', 'gap-1', 'pt-2', 'pb-4')}>
					{new Array(CLASS_COUNT).fill(null).map((_, index) => {
						const count = index + 1;
						const formName = `class_${index}`;
						return (
							<div key={`class-${count}`} className={clsx('flex', 'items-center', 'gap-2')}>
								<SelectClass
									id={formName}
									label={`${count}`}
									labelClassAddOn={clsx('w-6')}
									options={classOptions}
								/>
								<span>RM</span>
								<span className={clsx('w-12', 'text-right')}>
									{getDiscountedFees(
										formData?.[formName]?.value as ClassesGetResponse,
										packageData?.[0],
									)?.toFixed(2)}
								</span>
							</div>
						);
					})}
				</div>
			</Section>

			<Separator />

			<div className={clsx('flex', 'justify-end')}>
				<span>Fees: RM</span>
				<span className={feesClass}>{allFees.toFixed(2)}</span>
			</div>

			<div className={clsx('flex', 'justify-end')}>
				<span>Package Discount: -RM</span>
				<span className={feesClass}>{(allFees - allFeesDiscounted).toFixed(2)}</span>
			</div>

			<ThinSeparator />

			<div className={clsx('flex', 'justify-end')}>
				<span>Total Fees: RM</span>
				<span className={clsx(feesClass, GreenBoldText)}>{allFeesDiscounted.toFixed(2)}</span>
			</div>

			<ThinSeparator />
		</div>
	);
}
