import Modal, { ModalButtons } from '../../../components/modal';
import { RECEIPT_PRINT_PREVIEW_SIZE } from '../../../utils/constants/constants';
import { GreenButtonClass } from '../../../utils/tailwindClass/button';
import { ReceiptCreateResponse } from '../../../utils/types/responses/receipts/create';
import { ReceiptGenerateResponse } from '../../../utils/types/responses/receipts/generate';
import ReceiptPreview from './receipt-preview';

type PropType = {
	closeModal: () => void;
	closeParentModal: () => void;
	invoiceData: ReceiptGenerateResponse;
	confirmReceipt: () => Promise<ReceiptCreateResponse>;
};

export function InvoiceModal({
	closeModal,
	closeParentModal,
	invoiceData,
	confirmReceipt,
}: Readonly<PropType>) {
	const modalButtons: ModalButtons = [
		{
			text: 'Confirm Payment',
			class: GreenButtonClass,
			action: async () => {
				const receipt = await confirmReceipt();
				window.open(
					`/receipts/print/${receipt?.id}`,
					'_blank',
					`${RECEIPT_PRINT_PREVIEW_SIZE},contextIsolation=no,nodeIntegration=yes`,
				);
				closeModal();
				closeParentModal();
			},
		},
	];

	return (
		<Modal title="Preview" closeModal={closeModal} buttons={modalButtons} closeOnBlur={false}>
			<ReceiptPreview data={invoiceData} />
		</Modal>
	);
}
