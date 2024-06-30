export const MENU_ITEMS = [
	{ image: '/images/home.png', href: '/coming-soon', text: 'Home' },
	{ image: '/images/student.png', href: '/students', text: 'Students' },
	{ image: '/images/receipt.png', href: '/coming-soon', text: 'Receipts' },
	{ image: '/images/collection.png', href: '/coming-soon', text: 'Collections' },
	{ image: '/images/class.png', href: '/classes', text: 'Classes' },
	{ image: '/images/package.png', href: '/packages', text: 'Packages' },
	{ image: '/images/teacher.png', href: '/teachers', text: 'Teachers' },
	{ image: '/images/voucher.png', href: '/coming-soon', text: 'Vouchers' },
	{ image: '/images/holiday.png', href: '/holidays', text: 'Holidays' },
	{ image: '/images/tax.png', href: '/taxes', text: 'Tax' },
	{ image: '/images/student_year.png', href: '/student-forms', text: 'Form' },
	{ image: '/images/setting.png', href: '/coming-soon', text: 'Settings' },
	{ image: '/images/logout.png', href: '/coming-soon', text: 'Logout' },
];

export const CLASS_COUNT = 10;
export const DAY = {
	1: 'Monday',
	2: 'Tuesday',
	3: 'Wednesday',
	4: 'Thursday',
	5: 'Friday',
	6: 'Saturday',
	7: 'Sunday',
};
export const MONTH = {
	0: 'January',
	1: 'February',
	2: 'March',
	3: 'April',
	4: 'May',
	5: 'June',
	6: 'July',
	7: 'August',
	8: 'September',
	9: 'October',
	10: 'November',
	11: 'December',
};
export const MONTH_SHORT = {
	0: 'Jan',
	1: 'Feb',
	2: 'Mar',
	3: 'Apr',
	4: 'May',
	5: 'Jun',
	6: 'Jul',
	7: 'Aug',
	8: 'Sep',
	9: 'Oct',
	10: 'Nov',
	11: 'Dec',
};

export const CLASS_API_PATH = '/api/classes';
export const STUDENT_FORM_API_PATH = '/api/student-forms';
export const TEACHER_API_PATH = '/api/teachers';
export const HOLIDAY_API_PATH = '/api/holidays';
export const PACKAGE_API_PATH = '/api/packages';
export const TAX_API_PATH = '/api/taxes';
export const STUDENT_API_PATH = '/api/students';
export const STUDENT_CLASS_API_PATH = '/api/student-classes';
