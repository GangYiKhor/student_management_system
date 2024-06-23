import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { DateInput } from '../../../components/inputs/date-input';
import { NumberInput } from '../../../components/inputs/number-input';
import { SelectClass } from '../../../components/inputs/select-class';
import { SelectInput } from '../../../components/inputs/select-input';
import { TextInput } from '../../../components/inputs/text-input';
import { TextAreaInput } from '../../../components/inputs/textarea-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContext } from '../../../components/providers/form-providers';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import Row from '../../../components/row';
import { Section } from '../../../components/section';
import Separator from '../../../components/separator';
import ThinSeparator from '../../../components/thin-seperator';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGet } from '../../../hooks/use-get';
import { useGetClassComboBoxOptions } from '../../../hooks/use-get-class-options';
import { useGetFormOptions } from '../../../hooks/use-get-form-options';
import {
	CLASS_COUNT,
	PACKAGE_API_PATH,
	STUDENT_CLASS_API_PATH,
} from '../../../utils/constants/constants';
import { icFormat, icFormatRevert } from '../../../utils/formatting/icFormatting';
import {
	phoneNumberFormat,
	phoneNumberFormatRevert,
} from '../../../utils/formatting/phoneNumberFormatting';
import { tryParseInt } from '../../../utils/numberParsers';
import {
	GrayButtonClass,
	GreenButtonClass,
	RedButtonClass,
} from '../../../utils/tailwindClass/button';
import { GreenBoldText } from '../../../utils/tailwindClass/text';
import { PackagesGetDto } from '../../../utils/types/dtos/packages/get';
import { StudentCreateDto } from '../../../utils/types/dtos/students/create';
import { StudentUpdateDto } from '../../../utils/types/dtos/students/update';
import {
	ClassesGetResponse,
	ClassesGetResponses,
} from '../../../utils/types/responses/classes/get';
import { PackagesGetResponses } from '../../../utils/types/responses/packages/get';
import { StudentClassesGetResponses } from '../../../utils/types/responses/student-classes/get';
import { StudentCreateResponse } from '../../../utils/types/responses/students/create';
import { StudentUpdateResponse } from '../../../utils/types/responses/students/update';
import { parseGetStudentClassData } from '../constants';
import { useIsDirty } from '../hooks/useIsDirty';
import { useVerifyInputs } from '../hooks/useVerifyInputs';
import { EditData, FormDataType } from '../types';
import {
	getAllFees,
	getAllFeesDiscounted,
	getDiscountedFees,
	getPackageCount,
} from '../utils/feesCalculations';

const feesClass = clsx('w-16', 'text-right');

type PropType = {
	closeModal: () => void;
	handler: (
		createData: StudentCreateDto | StudentUpdateDto,
		classIds: number[],
	) => Promise<StudentCreateResponse | StudentUpdateResponse>;
	handleActivate?: () => void;
	data?: EditData;
};

export function StudentsModal({ closeModal, data, handler, handleActivate }: Readonly<PropType>) {
	const { formData, setFormData } = useFormContext<FormDataType>();
	const [confirmation, setConfirmation] = useState<boolean>(false);
	const [packageCount, setPackageCount] = useState<number>();
	const [allFees, setAllFees] = useState<number>(0);
	const [allFeesDiscounted, setAllFeesDiscounted] = useState<number>(0);
	const [closeConfirmation, setCloseConfirmation] = useState<boolean>(false);
	const [passedData, setPassedData] = useState<EditData>(data);
	const [classData, setClassData] = useState<StudentClassesGetResponses>();
	const { setNotification } = useNotificationContext();

	const verifyInputs = useVerifyInputs({ formData, setFormData });
	const isDirty = useIsDirty({ formData, data: passedData, classData });

	const getForms = useGetFormOptions();
	const getClass = useGetClassComboBoxOptions();
	const getPackage = useGet<PackagesGetDto, PackagesGetResponses>(PACKAGE_API_PATH);
	const getStudentClasses = useGet<void, StudentClassesGetResponses>(
		STUDENT_CLASS_API_PATH,
		parseGetStudentClassData,
	);

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
		queryKey: ['classes'],
		queryFn: () =>
			getClass({
				form_id: tryParseInt(formData?.form_id?.value),
				is_active: true,
				orderBy: 'class_name asc',
			}),
		fetchOnVariable: [formData?.form_id?.value],
	});

	useEffect(() => {
		for (let i = 0; i < CLASS_COUNT; i++) {
			setFormData({ name: `class_${i}`, value: null, valid: true });
		}
	}, [formData?.form_id?.value]);

	useEffect(() => {
		if (passedData?.id) {
			getStudentClasses(undefined, passedData?.id).then(value => setClassData(value));
		}
	}, [passedData?.id]);

	useEffect(() => {
		if (data) {
			setPassedData(data);
		}
	}, [data]);

	useEffect(() => {
		if (classData) {
			for (let i = 0; i < CLASS_COUNT; i++) {
				setFormData({ name: `class_${i}`, value: classData[i]?.class ?? null, valid: true });
			}
		}
	}, [classData]);

	useEffect(() => {
		setPackageCount(getPackageCount(formData));
	}, [formData]);

	useEffect(() => {
		setAllFees(getAllFees(formData));
		setAllFeesDiscounted(getAllFeesDiscounted(formData, packageData?.[0]));
	}, [formData, packageData]);

	const modalButtons: ModalButtons = [
		{
			text: passedData ? 'Update' : 'Create',
			class: GreenButtonClass,
			action: () => verifyInputs() && setConfirmation(true),
		},
	];

	if (passedData) {
		modalButtons.unshift({
			text: passedData.is_active ? 'Deactivate' : 'Activate',
			class: passedData.is_active ? RedButtonClass : GreenButtonClass,
			action: () => handleActivate(),
		});
	}

	const confirmationButtons: ModalButtons = [
		{
			text: 'Cancel',
			class: RedButtonClass,
			action: () => setConfirmation(false),
		},
		{
			text: 'Confirm',
			class: GreenButtonClass,
			action: async () => {
				try {
					const submitData: StudentCreateDto | StudentUpdateDto = {
						student_name: formData.student_name?.value?.trim() || '',
						form_id: formData.form_id?.value,
						reg_date: formData.reg_date?.value,
						reg_year: formData.reg_year?.value,
						gender: formData.gender?.value?.trim() || '',
						ic: formData.ic?.value?.trim() || '',
						school: formData.school?.value?.trim() || '',
						phone_number: formData.phone_number?.value?.trim() || '',
						parent_phone_number: formData.parent_phone_number?.value?.trim() || '',
						email: formData.email?.value?.trim() || '',
						address: formData.address?.value?.trim() || '',
					};

					const classIds: number[] = [];
					for (let i = 0; i < CLASS_COUNT; i++) {
						classIds.push((formData[`class_${i}`]?.value as ClassesGetResponse)?.id);
					}

					const result = await handler(submitData, classIds);

					setConfirmation(false);
					setPassedData(prev => ({
						id: result.student_id,
						is_active: true,
						...prev,
						...submitData,
					}));
					getStudentClasses(undefined, result.student_id).then(value => setClassData(value));
				} catch (error) {
					setNotification({ message: error });
					setConfirmation(false);
				}
			},
		},
	];

	const closeConfirmationButtons: ModalButtons = [
		{
			text: 'Cancel',
			class: GrayButtonClass,
			action: () => setCloseConfirmation(false),
		},
		{
			text: 'Discard',
			class: RedButtonClass,
			action: () => {
				setCloseConfirmation(false);
				closeModal();
			},
		},
	];

	return (
		<React.Fragment>
			<Modal
				title={passedData ? `Edit Student` : `Create Student`}
				closeModal={() => (isDirty() ? setCloseConfirmation(true) : closeModal())}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<div className={clsx('grid')}>
					<TextInput label="Name" name="student_name" maxLength={200} required />

					<Row>
						<SelectInput
							label="Form"
							name="form_id"
							queryFn={() => getForms({ is_active: true, orderBy: 'form_name asc' })}
							required
						/>

						<DateInput label="Reg Date" name="reg_date" required />

						<NumberInput
							label="Academic Year"
							name="reg_year"
							min={2000}
							max={2200}
							step={1}
							required
						/>
					</Row>

					<Section title="Student Details" hideable defaultHide={!!passedData}>
						<SelectInput
							label="Gender"
							name="gender"
							placeholder="Not Specified"
							options={[
								{ value: 'male', label: 'Male' },
								{ value: 'female', label: 'Female' },
							]}
						/>

						<Row>
							<TextInput
								label="IC"
								name="ic"
								placeholder="010203070809"
								maxLength={20}
								onBlurFormat={icFormat}
								onFocusFormat={icFormatRevert}
							/>

							<TextInput label="School" name="school" maxLength={200} />
						</Row>

						<Row>
							<TextInput
								label="Phone Number"
								name="phone_number"
								placeholder="0123456789"
								maxLength={20}
								onBlurFormat={phoneNumberFormat}
								onFocusFormat={phoneNumberFormatRevert}
							/>

							<TextInput
								label="Parent H/P"
								name="parent_phone_number"
								placeholder="0123456789"
								maxLength={20}
								onBlurFormat={phoneNumberFormat}
								onFocusFormat={phoneNumberFormatRevert}
							/>
						</Row>

						<TextInput email label="Email" name="email" maxLength={200} />
						<TextAreaInput label="Address" name="address" maxLength={250} />
					</Section>

					<Section title="Classes" hideable>
						<div className={clsx('flex', 'flex-col', 'gap-1', 'pt-2', 'pb-4')}>
							{new Array(CLASS_COUNT).fill(null).map((_, index) => {
								const count = index + 1;
								const formName = `class_${index}`;
								return (
									<div key={`class-${count}`} className={clsx('flex', 'items-center', 'gap-2')}>
										<SelectClass
											label={`${count}`}
											name={formName}
											onUpdate={() => setPackageCount(getPackageCount(formData))}
											labelClassAddOn={clsx('w-6')}
											options={classOptions}
										/>
										<span>RM</span>
										<span className={clsx('w-12', 'text-right')}>
											{getDiscountedFees(
												formData[formName]?.value as ClassesGetResponse,
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
			</Modal>

			{confirmation ? (
				<Modal
					title="Confirmation"
					closeModal={() => setConfirmation(false)}
					closeOnBlur={false}
					buttons={confirmationButtons}
				>
					<p>Confirm {passedData ? 'Update' : 'Create'}?</p>
				</Modal>
			) : null}

			{closeConfirmation ? (
				<Modal
					title="Confirmation"
					closeModal={() => setCloseConfirmation(false)}
					closeOnBlur={false}
					buttons={closeConfirmationButtons}
				>
					<p>Discard data?</p>
				</Modal>
			) : null}
		</React.Fragment>
	);
}
