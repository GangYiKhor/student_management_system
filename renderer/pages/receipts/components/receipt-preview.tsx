import clsx from 'clsx';
import { readConfig } from '../../../utils/configs';
import { MONTH_SHORT } from '../../../utils/constants/constants';
import { dateFormatter } from '../../../utils/dateOperations';
import { ReceiptGenerateResponse } from '../../../utils/types/responses/receipts/generate';

const containerClass = clsx(
	'relative',
	'w-[18cm]',
	'h-[12.5cm]',
	'text-black',
	'text-[9pt]',
	'font-mono',
);

const previewBgColour = 'bg-[#f7f2e9]';
const printBgColour = 'bg-white';

const previewClass = clsx(previewBgColour, 'border-black', 'border-[3px]', 'border-double');
const printClass = clsx(printBgColour);

const itemClass = clsx(
	'flex',
	'w-full',
	'[&_thead]:text-[10pt]',
	'[&_thead]:text-center',
	'[&_thead]:border-black',
	'[&_thead]:border-b-[1px]',
	'[&_tfoot]:border-black',
	'[&_tfoot]:border-t-[1px]',
	'[&_table]:w-full',
	'[&_table]:h-full',
	'leading-tight',
);

export type ModalButtons = {
	text: string;
	class: string;
	action: CallableFunction;
	disabled?: boolean;
}[];

type PropType = {
	data: ReceiptGenerateResponse;
	receipt_no?: string;
};

export default function ReceiptPreview({ data, receipt_no }: Readonly<PropType>) {
	const separator = <hr className={clsx('border-black')} />;

	return (
		<div className={clsx(containerClass, receipt_no ? printClass : previewClass)}>
			<div className={clsx('absolute', 'w-full', 'h-full', 'py-[1cm]', 'px-[0.3cm]', 'z-10')}>
				{/* Receipt Heading */}
				<div className={clsx('flex', 'flex-col', 'w-full', 'text-center', 'leading-tight')}>
					<div className={clsx('relative')}>
						<h1 className={clsx('font-bold', 'font-serif', 'text-[14pt]')}>
							{readConfig('COMPANY_NAME')}
						</h1>
						<span className={clsx('absolute', 'bottom-0', 'right-0')}>
							{readConfig('COMPANY_REG_NO')}
						</span>
					</div>
					<p>{readConfig('COMPANY_ADDRESS')}</p>
					<p>{readConfig('COMPANY_CONTACT')}</p>
				</div>

				{/* Receipt Separator */}
				{separator}
				<h2
					className={clsx('uppercase', 'font-bold', 'text-[14pt]', 'text-center', 'leading-tight')}
				>
					{`Official Receipt ${data.payment_year}`}
				</h2>
				{separator}

				{/* Receipt Details */}
				<table className={clsx('w-full', 'leading-tight')}>
					<tbody className={clsx('[&_th]:text-right', '[&_td]:pl-[1mm]')}>
						<tr>
							<th className={clsx('w-[27mm]')}>Receipt No:</th>
							<td className={receipt_no ? '' : clsx('font-bold', 'opacity-50', 'uppercase')}>
								{receipt_no || 'Receipt Not Created Yet'}
							</td>
							<th className={clsx('w-[12mm]', 'text-right')}>Date:</th>
							<td className={clsx('w-[23mm]', 'uppercase')}>
								{dateFormatter(data.date, { format: 'dd MMM yyyy' })}
							</td>
						</tr>

						<tr>
							<th className={clsx('w-[27mm]', 'align-top')}>Student Name:</th>
							<td colSpan={3}>{`[${data.student_id}] ${data.student_name} (${data.form_name})`}</td>
						</tr>

						{data?.remarks ? (
							<tr>
								<th className={clsx('w-[27mm]', 'align-top')}>Remarks:</th>
								<td colSpan={3}>{data.remarks}</td>
							</tr>
						) : null}
					</tbody>
				</table>

				{/* Receipt Items */}
				<div className={itemClass}>
					<div className={clsx('w-[35%]', 'border-black', 'border-[1px]')}>
						<table>
							<thead>
								<tr>
									<th colSpan={2}>Subjects</th>
								</tr>
							</thead>

							<tbody>
								{data.receipt_class.map(({ class_name, fees, is_package }) => (
									<tr key={class_name} className={clsx('h-[10pt]')}>
										<td className={clsx('pl-[3mm]', 'w-[100%]')}>
											{(is_package ? '*' : '') + class_name}
										</td>
										<td className={clsx('flex', 'justify-between', 'w-[19mm]', 'pr-[2mm]')}>
											<span>RM</span>
											<span>{fees.toFixed(2)}</span>
										</td>
									</tr>
								))}

								{/* For empty spaces below */}
								<tr></tr>
							</tbody>

							<tfoot>
								<tr>
									<td></td>
									<td className={clsx('flex', 'justify-between', 'w-[19mm]', 'pr-[2mm]')}>
										<span>RM</span>
										<span>{data.class_fees_per_month.toFixed(2)}</span>
									</td>
								</tr>
							</tfoot>
						</table>
					</div>

					<div className={clsx('w-[20%]', 'ml-[-1px]', 'border-black', 'border-[1px]')}>
						<table>
							<thead>
								<tr>
									<th colSpan={2}>Months</th>
								</tr>
							</thead>

							<tbody>
								{Object.entries(MONTH_SHORT)
									.sort(value => parseInt(value[0]) - parseInt(value[0]))
									.map(value => value[1].toLowerCase())
									.filter(value => data[value] > 0)
									.map(value => (
										<tr key={value} className={clsx('h-[10pt]')}>
											<td className={clsx('pl-[3mm]', 'w-[100%]', 'capitalize')}>
												{value + (data[value] == 0.5 ? '½' : '')}
											</td>
											<td className={clsx('flex', 'justify-between', 'w-[19mm]', 'pr-[2mm]')}>
												<span>RM</span>
												<span>{(data.class_fees_per_month * data[value]).toFixed(2)}</span>
											</td>
										</tr>
									))}

								{/* For empty spaces below */}
								<tr></tr>
							</tbody>

							<tfoot>
								<tr>
									<td></td>
									<td className={clsx('flex', 'justify-between', 'w-[19mm]', 'pr-[2mm]')}>
										<span>RM</span>
										<span>{data.total_class_fees.toFixed(2)}</span>
									</td>
								</tr>
							</tfoot>
						</table>
					</div>

					<div className={clsx('w-[45%]', 'ml-[-1px]', 'border-black', 'border-[1px]')}>
						<table>
							<thead>
								<tr>
									<th colSpan={2}>Payment</th>
								</tr>
							</thead>

							<tbody>
								{[
									{ field: 'Registration', value: data.reg_fees, negative: false },
									{ field: 'Class Fees', value: data.total_class_fees, negative: false },
									{
										field: 'Package Discount**',
										value: data.total_package_discount,
										negative: true,
									},
									{
										field: `Voucher: ${data.voucher_id} (${data.voucher_desc})`,
										value: data.voucher_discount,
										negative: true,
									},
									{ field: 'Incentive', value: data.incentive, negative: true },
								].map(({ field, value, negative }) =>
									value > 0 ? (
										<tr key={field} className={clsx('h-[10pt]')}>
											<td className={clsx('pl-[3mm]', 'w-[100%]')}>{field}</td>
											<td className={clsx('flex', 'justify-between', 'w-[28mm]', 'pr-[2mm]')}>
												<span
													className={clsx('w-[10mm]', 'text-right')}
												>{`${negative ? '- ' : ''}RM`}</span>
												<span>{value.toFixed(2)}</span>
											</td>
										</tr>
									) : null,
								)}

								{/* For empty spaces below */}
								<tr></tr>
							</tbody>

							<tfoot>
								{[
									{ field: 'Subtotal', value: data.subtotal },
									{
										field: `Tax (${data.tax_desc})`,
										value: data.tax_amount,
									},
									{
										field: 'Total',
										value: data.total,
									},
								].map(({ field, value }) => (
									<tr
										key={field}
										className={field == 'Total' ? 'border-black border-t-[1px] font-bold' : ''}
									>
										<td className={clsx('px-[3mm]', 'w-[100%]')}>{field}</td>
										<td className={clsx('flex', 'justify-between', 'w-[28mm]', 'pr-[2mm]')}>
											<span className={clsx('w-[10mm]', 'text-right')}>RM</span>
											<span>{value.toFixed(2)}</span>
										</td>
									</tr>
								))}
							</tfoot>
						</table>
					</div>
				</div>

				{/* Notes */}
				<div className={clsx('mt-[0.5mm]', 'text-[8pt]', 'italic', 'leading-tight')}>
					<p>* subjects in package | ** package discount only applicable for full month fees</p>
				</div>

				{/* Receipt Footer */}
				<div className={clsx('mt-[2mm]', 'text-[8pt]', 'leading-tight')}>
					<p>[Fees paid are not refundable]</p>
					<p>[This is a computer generated document and does not require a signature]</p>
				</div>

				{/* Thank You */}
				{/* <div className={clsx('absolute', 'bottom-[0.5cm]', 'w-full', 'text-center')}>
					<p
						className={clsx(
							'uppercase',
							'text-[10pt]',
							'font-semibold',
							'opacity-50',
							'leading-tight',
						)}
					>
						<span className={clsx('border-black', 'border-y-[3px]', 'border-double', 'px-[3mm]')}>
							{readConfig('RECEIPT_WISHES')}
						</span>
					</p>
				</div> */}
			</div>

			{/* Unconfirmed Watermark and Print Outline*/}
			{receipt_no ? (
				<div className={clsx('aboslute', 'no-print', 'w-full', 'h-full', 'py-[8mm]', 'px-[1mm]')}>
					<div
						className={clsx('w-full', 'h-full', 'border-dashed', 'border-gray-300', 'border-[1mm]')}
					></div>
				</div>
			) : (
				<div className={clsx('absolute', 'flex', 'w-full', 'h-full')}>
					<h3
						className={clsx(
							'm-auto',
							'-rotate-[15deg]',
							'translate-y-[-8mm]',
							'text-[40pt]',
							'opacity-[0.15]',
							'uppercase',
							'font-semibold',
						)}
					>
						Unconfirmed Receipt
					</h3>
				</div>
			)}

			{/* Cancelled / Status Watermark */}
			{data?.status?.toLowerCase() !== 'received' ? (
				<div className={clsx('absolute', 'flex', 'w-full', 'h-full', 'top-0')}>
					<h3
						className={clsx(
							'm-auto',
							'-rotate-[15deg]',
							'translate-y-[-8mm]',
							'text-[50pt]',
							'opacity-30',
							'uppercase',
							'font-semibold',
							'tracking-widest',
						)}
					>
						{data?.status}
					</h3>
				</div>
			) : null}
		</div>
	);
}
