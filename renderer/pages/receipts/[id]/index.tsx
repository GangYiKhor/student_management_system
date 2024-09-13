import clsx from 'clsx';
import { PrinterIcon } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Loader } from '../../../components/loader';
import { useCustomQuery } from '../../../hooks/use-custom-query';
import { useGet } from '../../../hooks/use-get';
import { parseDateTime } from '../../../utils/dateOperations';
import { GrayButtonClass } from '../../../utils/tailwindClass/button';
import { ReceiptsGetResponse } from '../../../utils/types/responses/receipts/get';
import ReceiptPreview from '../components/receipt-preview';
import { BackendPath } from '../constants';

function ReceiptPrint() {
	const router = useRouter();

	const getReceipt = useGet<null, ReceiptsGetResponse>(BackendPath, value => ({
		...value,
		date: parseDateTime(value.date),
	}));
	const { data, isLoading } = useCustomQuery<ReceiptsGetResponse>({
		queryKey: ['receiptPrint'],
		queryFn: () => getReceipt(undefined, router.query.id as string),
		disabled: true, // Since no query.id on initial load
		fetchOnVariable: [router.query.id],
		fetchOnlyIfDefined: [router.query.id],
	});

	const print = () => {
		window.print();
	};

	return (
		<React.Fragment>
			<Head>
				<title>Receipt Print View - {data?.receipt_no}</title>
			</Head>
			<Loader isLoading={isLoading}>
				<div className={clsx('relative', 'w-fit')}>
					<ReceiptPreview data={data} receipt_no={data?.receipt_no} />
					<button
						className={clsx(
							'absolute',
							'bottom-11',
							'right-4',
							'z-20',
							'no-print',
							GrayButtonClass,
						)}
						onClick={() => print()}
					>
						<PrinterIcon />
					</button>
				</div>
			</Loader>
		</React.Fragment>
	);
}

export default ReceiptPrint;
