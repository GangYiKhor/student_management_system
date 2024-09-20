import { QueryObserverResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import { PrinterIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFormContextWithId } from '../../../components/providers/form-providers';
import { TableColumnType, TableTemplate } from '../../../components/tables/table-template';
import { usePost } from '../../../hooks/use-post';
import { dateFormatter } from '../../../utils/dateOperations';
import { GrayButtonClass } from '../../../utils/tailwindClass/button';
import { RedBoldText } from '../../../utils/tailwindClass/text';
import { ReceiptUpdateDto } from '../../../utils/types/dtos/receipts/update';
import { ErrorResponse } from '../../../utils/types/responses/error';
import {
	ReceiptsGetResponse,
	ReceiptsGetResponses,
} from '../../../utils/types/responses/receipts/get';
import { ReceiptUpdateResponse } from '../../../utils/types/responses/receipts/update';
import { BackendPath, defaultSort, PrintPreviewSize, SearchFormId } from '../constants';
import { EditData, SearchDataType } from '../types';
import { ReceiptsViewModal } from './receipts-view-modal';

const columns: TableColumnType<ReceiptsGetResponse>[] = [
	{ title: 'ID', columnName: 'id', valueParser: value => value.receipt_no },
	{ title: 'Date', columnName: 'date', valueParser: value => dateFormatter(value.date) },
	{ title: 'Year', columnName: 'payment_year' },
	{ title: 'Student', columnName: 'student_name' },
	{ title: 'Form', columnName: 'form_name' },
	{
		title: 'Fees',
		columnName: 'total',
		valueParser: value => {
			if (value?.status !== 'Received') {
				return <span className={RedBoldText}>{value?.status?.toUpperCase()}</span>;
			} else {
				return `RM ${value.total.toFixed(2)}`;
			}
		},
	},
	{
		title: 'Print',
		columnName: 'action',
		addOnClass: 'w-[60px]',
		valueParser: value => (
			<button
				onClick={() =>
					window.open(
						`/receipts/${value?.id}`,
						'_blank',
						`${PrintPreviewSize},contextIsolation=no,nodeIntegration=yes`,
					)
				}
				className={clsx(GrayButtonClass, 'w-[55px]')}
			>
				<PrinterIcon />
			</button>
		),
		notClickable: true,
		notSortable: true,
	},
];

type PropType = {
	data: ReceiptsGetResponses;
	refetch: () => Promise<QueryObserverResult<ReceiptsGetResponses, AxiosError<ErrorResponse, any>>>;
	setOrderBy: (value: string) => void;
};

export function ReceiptTable({ data, refetch, setOrderBy }: Readonly<PropType>) {
	const { formData } = useFormContextWithId<SearchDataType>(SearchFormId);
	const [tableData, setTableData] = useState<ReceiptsGetResponses>([]);
	const [selected, setSelected] = useState<EditData>(undefined);
	const postClass = usePost<ReceiptUpdateDto, ReceiptUpdateResponse>(BackendPath);

	const handleEdit = (data: EditData) => {
		setSelected(data);
	};

	const handleUpdate = async (data: ReceiptUpdateDto) => {
		const updatedData = await postClass(data, selected.id);
		await refetch();
		return updatedData;
	};

	useEffect(() => {
		let filteredData = data;
		const search = formData?.general?.value?.trim().toLowerCase();
		if (search) {
			filteredData = filteredData.filter(
				value =>
					'#' + value.id === search ||
					value.receipt_no?.toLowerCase().includes(search) ||
					value.student_name?.toLowerCase().includes(search) ||
					value.remarks?.toLowerCase().includes(search) ||
					value.status?.toLowerCase().includes(search),
			);
		}

		setTableData(filteredData);
	}, [data, formData?.general?.value]);

	return (
		<React.Fragment>
			<TableTemplate
				columns={columns}
				data={tableData}
				setOrderBy={setOrderBy}
				defaultSort={defaultSort}
				handleEdit={handleEdit}
			/>

			{selected ? (
				<ReceiptsViewModal
					closeModal={() => setSelected(undefined)}
					handleUpdate={handleUpdate}
					data={selected}
				/>
			) : null}
		</React.Fragment>
	);
}
