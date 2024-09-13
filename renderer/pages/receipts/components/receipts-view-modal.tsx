import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { CheckboxGroupInput } from '../../../components/inputs/checkbox-group-input';
import { DateInput } from '../../../components/inputs/date-input';
import { NumberInput } from '../../../components/inputs/number-input';
import { TextInput } from '../../../components/inputs/text-input';
import { TextAreaInput } from '../../../components/inputs/textarea-input';
import Modal, { ModalButtons } from '../../../components/modal';
import { useFormContext } from '../../../components/providers/form-providers';
import Row from '../../../components/row';
import { Section } from '../../../components/section';
import Separator from '../../../components/separator';
import { CLASS_COUNT, MONTH_SHORT } from '../../../utils/constants/constants';
import {
	GrayButtonClass,
	GreenButtonClass,
	RedButtonClass,
} from '../../../utils/tailwindClass/button';
import { ReceiptUpdateDto } from '../../../utils/types/dtos/receipts/update';
import { ReceiptUpdateResponse } from '../../../utils/types/responses/receipts/update';
import { PrintPreviewSize } from '../constants';
import { EditData, FormDataType } from '../types';

type PropType = {
	closeModal: () => void;
	handleUpdate: (updateData: ReceiptUpdateDto) => Promise<ReceiptUpdateResponse>;
	data: EditData;
};

export function ReceiptsViewModal({ closeModal, handleUpdate, data }: Readonly<PropType>) {
	const { formData } = useFormContext<FormDataType>();
	const [passedData, setPassedData] = useState<EditData>(data);

	useEffect(() => {
		if (data) {
			setPassedData(data);
		}
	}, [data]);

	const modalButtons: ModalButtons = [
		{
			text: 'Cancel Receipt',
			class: RedButtonClass,
			disabled: passedData?.status?.toLowerCase() === 'cancelled',
			action: async () => {
				const updatedReceipt = await handleUpdate({ status: 'Cancelled' });
				setPassedData(updatedReceipt);
			},
		},
		{
			text: 'Update',
			class: GreenButtonClass,
			disabled: formData?.remarks?.value === passedData?.remarks,
			action: async () => {
				const updatedReceipt = await handleUpdate({ remarks: formData?.remarks?.value?.trim() });
				setPassedData(updatedReceipt);
			},
		},
		{
			text: 'Print',
			class: GrayButtonClass,
			action: () => {
				window.open(
					`/receipts/${data.id}`,
					'_blank',
					`${PrintPreviewSize},contextIsolation=no,nodeIntegration=yes`,
				);
			},
		},
	];

	const checkBoxComponent = (value: string) => (
		<CheckboxGroupInput
			key={value}
			labels={[value, '½']}
			name={value.toLowerCase()}
			valueGroup={[0, 1, 0.5]}
			labelLocation="top"
			locked
		/>
	);

	return (
		<React.Fragment>
			<Modal
				title={`Receipt${passedData?.status !== 'Received' ? ` - ${passedData.status}` : ''}`}
				closeModal={closeModal}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<div className={clsx('relative')}>
					<div className={clsx('grid')}>
						<Row>
							<TextInput label="Receipt No" name="receipt_no" locked />
							<DateInput label="Date" name="date" locked />
							<NumberInput label="Year" name="payment_year" min={2000} step={1} locked />
						</Row>

						<Separator />

						<TextInput label="Student ID" name="student_id" locked />
						<TextInput label="Student" name="student" locked />

						<Row>
							<NumberInput label="Reg" name="reg_fees" prefix="RM" placeholder="0.00" locked />
							<NumberInput
								label="Incentive"
								name="incentive"
								prefix="RM"
								placeholder="0.00"
								locked
							/>
							<TextInput label="Voucher" name="voucher_id" locked />
						</Row>

						<TextAreaInput label="Remarks" name="remarks" notResizable />

						<Section title="Months" hideable>
							<Row>
								{Object.entries(MONTH_SHORT)
									.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
									.slice(0, 6)
									.map(value => checkBoxComponent(value[1]))}
							</Row>

							<Row>
								{Object.entries(MONTH_SHORT)
									.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
									.slice(6)
									.map(value => checkBoxComponent(value[1]))}
							</Row>
						</Section>

						<Section title="Classes" hideable>
							<div className={clsx('flex', 'flex-col', 'gap-1', 'pt-2', 'pb-4')}>
								{new Array(CLASS_COUNT).fill(null).map((_, index) => {
									const count = index + 1;
									const formName = `class_${index}`;
									return (
										<div key={`class-${count}`} className={clsx('flex', 'items-center', 'gap-2')}>
											<TextInput
												label={`${count}`}
												name={formName}
												labelClassAddOn={clsx('w-6')}
												leftLabel
												locked
											/>
										</div>
									);
								})}
							</div>
						</Section>
					</div>

					{passedData?.status !== 'Received' ? (
						<div
							className={clsx(
								'absolute',
								'w-full',
								'h-full',
								'top-0',
								'flex',
								'flex-col',
								'justify-around',
								'text-center',
								'bg-[rgba(0,0,0,0.2)]',
								'pointer-events-none',
							)}
						>
							{[1, 2, 3].map(value => (
								<h3
									key={`watermark-${value}`}
									className={clsx(
										'-rotate-[15deg]',
										'text-[50pt]',
										'uppercase',
										'font-semibold',
										'opacity-20',
									)}
								>
									{passedData.status}
								</h3>
							))}
						</div>
					) : null}
				</div>
			</Modal>
		</React.Fragment>
	);
}
