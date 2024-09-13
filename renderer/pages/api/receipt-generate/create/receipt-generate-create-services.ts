import { round } from 'lodash';
import { MONTH_SHORT } from '../../../../utils/constants/constants';
import { NotFoundError } from '../../../../utils/errors/NotFoundError';
import prisma from '../../../../utils/prisma-client';
import { ReceiptGenerateDto } from '../../../../utils/types/dtos/receipts/generate';
import { ReceiptGenerateResponse } from '../../../../utils/types/responses/receipts/generate';
import { packagesGetServices } from '../../packages/get/packages-get-services';
import { taxesGetServices } from '../../taxes/get/taxes-get-services';
import { voucherGetServices } from '../../vouchers/[id]/get/voucher-get-services';

export async function receiptGenerateServices(
	dto: ReceiptGenerateDto,
): Promise<ReceiptGenerateResponse> {
	const { voucher_id, class_ids, ...data } = dto;

	const active_tax = await taxesGetServices({ is_active: true });
	const tax = active_tax[0]?.percentage ?? 0;
	const tax_inclusive = active_tax[0]?.inclusive ?? false;

	const classIds = class_ids.filter(value => value !== undefined && value !== null);
	const classesArray = await prisma.class_registration.findMany({
		include: { teacher: true },
		where: { id: { in: classIds } },
	});

	// Throw error if there is any class not found in database
	if (classesArray.length !== classIds.length) {
		const notFoundClass = classesArray
			.map(value => value.id)
			.filter(value => !classIds.includes(value));
		throw new NotFoundError(
			`Classes Not Found! ID: ${notFoundClass.join(', ')}`,
			'Class Not Found',
		);
	}

	const package_count = classesArray.reduce((sum, value) => sum + (value.is_package ? 1 : 0), 0);
	const packages = await packagesGetServices({
		form_id: data.form_id,
		subject_count: package_count,
		is_active: true,
	});
	const package_discount = packages?.[0]?.discount_per_subject ?? 0;
	const package_discount_per_month = package_discount * package_count;

	const receipt_class = classesArray.map(value => ({
		class_id: value.id,
		class_name: value.class_name,
		teacher_id: value.teacher_id,
		teacher_name: value.teacher.teacher_name,
		fees: value.fees,
		package_discount: value.is_package ? package_discount : 0,
		is_package: value.is_package,
	}));

	const vouchers = await voucherGetServices(voucher_id);
	const voucher_amount = vouchers?.discount ?? 0;
	const voucher_is_percentage = vouchers?.is_percentage ?? false;

	const months = Object.values(MONTH_SHORT).map(value => value.toLowerCase());
	const month_count = months.reduce((sum, value) => sum + data[value], 0);
	const full_months = months.reduce((sum, value) => sum + (data[value] == 1 ? 1 : 0), 0);

	const class_fees_per_month = classesArray.reduce((sum, value) => sum + (value.fees ?? 0), 0);
	const total_class_fees = class_fees_per_month * month_count;
	const total_package_discount = package_discount_per_month * full_months; // Only discount for full month
	const reg_fees = data.reg_fees;
	const incentive = data.incentive;
	let subtotal = total_class_fees - total_package_discount + reg_fees;

	const voucher_discount = voucher_is_percentage
		? round((subtotal * voucher_amount) / 100, 2)
		: voucher_amount;
	const voucher_desc = voucher_is_percentage ? `-${voucher_amount}%` : `-RM${voucher_amount}`;
	subtotal = round(subtotal - voucher_discount - incentive, 2);

	let tax_desc = `${tax}%`;
	let tax_amount = 0;
	let total = subtotal;
	if (tax_inclusive) {
		subtotal = round(total / (1 + tax / 100), 2);
		tax_amount = round(total - subtotal, 2);
		tax_desc += ' included';
	} else {
		tax_amount = round((subtotal * tax) / 100, 2);
		total = round(subtotal + tax_amount, 2);
	}

	const receipt: ReceiptGenerateResponse = {
		student_id: data.student_id,
		student_name: data.student_name,
		form_id: data.form_id,
		form_name: data.form_name,
		date: data.date,
		payment_year: data.payment_year,
		jan: data.jan,
		feb: data.feb,
		mar: data.mar,
		apr: data.apr,
		may: data.may,
		jun: data.jun,
		jul: data.jul,
		aug: data.aug,
		sep: data.sep,
		oct: data.oct,
		nov: data.nov,
		dec: data.dec,
		class_fees_per_month,
		package_discount_per_month,
		total_class_fees,
		total_package_discount,
		reg_fees,
		incentive,
		voucher_id,
		voucher_discount,
		voucher_desc,
		tax_amount,
		tax_desc,
		subtotal,
		total,
		remarks: data.remarks,
		status: data.status,
		receipt_class,
	};

	return receipt;
}
