import clsx from 'clsx';

// Containers
export const ContainerFlexColGrow = clsx('flex flex-col flex-1');
export const ContainerFlexRowGrow = clsx('flex flex-row flex-1');

// Labels
export const LabelLeftClass = clsx('px-0.5 py-1 ml-2 mr-1', 'text-right');
export const LabelTopClass = clsx('px-0.5 py-1', 'text-left');

// Textboxes
export const TextBoxClass = clsx(
	'py-1 px-2',
	'bg-gray-100 dark:bg-bgdark',
	'border-2 border-gray-300 dark:border-gray-500 rounded-md',
	'hover:border-gray-500 dark:hover:border-gray-300',
	'focus:bg-white dark:focus:bg-black',
	'transition-[border-color]',
);
export const TextBoxRightClass = clsx(TextBoxClass, 'ml-1 mr-2');
export const TextBoxBottomClass = clsx(TextBoxClass, 'mb-3');
export const InputTextClass = clsx(
	'flex-1',
	'text-left',
	'px-1',
	'bg-transparent',
	'focus:outline-none',
);

// Disabled Textboxes
export const DisabledTextBoxClass = clsx(
	'py-1',
	'px-2',
	'text-gray-600',
	'dark:text-gray-300',
	'border-2',
	'border-gray-300',
	'dark:border-gray-800',
	'bg-gray-200',
	'dark:bg-gray-700',
	'transition-[border-color]',
	'rounded-md',
);
export const DisabledTextBoxRightClass = clsx(DisabledTextBoxClass, 'ml-1', 'mr-2');
export const DisabledTextBoxBottomClass = clsx(DisabledTextBoxClass, 'mb-3');

// Invalid Textboxes
export const InvalidTextBoxClass = clsx(
	'error',
	'!text-red-600',
	'dark:!text-red-400',
	'!border-red-400',
	'dark:!border-red-600',
	'!bg-red-50',
	'dark:!bg-red-950',
);

export function getContainerClass(leftLabel?: boolean) {
	return leftLabel ? ContainerFlexRowGrow : ContainerFlexColGrow;
}

export function getLabelClass(leftLabel?: boolean) {
	return leftLabel ? LabelLeftClass : LabelTopClass;
}

export function getInputClass(leftLabel?: boolean, locked?: boolean) {
	if (leftLabel) {
		return locked ? DisabledTextBoxRightClass : TextBoxRightClass;
	}
	return locked ? DisabledTextBoxBottomClass : TextBoxBottomClass;
}

export function getInvalid(valid?: boolean) {
	if (valid === false) return InvalidTextBoxClass;
	return '';
}
