import React, { useCallback, useEffect, useRef, useState } from 'react';
import Modal, { ModalButtons } from '../../../components/modal';
import {
	ErrorTextBoxClass,
	InvalidTextBoxClass,
	LabelTopClass,
	TextBoxBottomClass,
} from '../../../utils/class/inputs';
import clsx from 'clsx';
import { GrayButtonClass, GreenButtonClass, RedButtonClass } from '../../../utils/class/button';
import { useNotificationContext } from '../../../components/providers/notification-providers';
import { TeachersCreateDto } from '../../../dtos/teachers/create';
import { verifyEmail, verifyPhoneNumber } from '../../../utils/verifications';
import { RequiredIcon } from '../../../components/required';

type PropType = {
	closeModal: CallableFunction;
	handleUpdate: CallableFunction;
	data: {
		id: number;
		teacher_name?: string;
		ic?: string;
		phone_number?: string;
		email?: string;
		address?: string;
		start_date?: Date;
		end_date?: Date;
		is_active?: boolean;
	};
};

export function TeachersEditModal({ closeModal, handleUpdate, data }: PropType) {
	const { setNotification } = useNotificationContext();
	const teacherNameRef = useRef<HTMLInputElement>();
	const icRef = useRef<HTMLInputElement>();
	const phoneNumberRef = useRef<HTMLInputElement>();
	const emailRef = useRef<HTMLInputElement>();
	const addressRef = useRef<HTMLTextAreaElement>();
	const [teacherNameValid, setTeacherNameValid] = useState(true);
	const [icValid, setIcValid] = useState(true);
	const [phoneNumberValid, setPhoneNumberValid] = useState(true);
	const [emailValid, setEmailValid] = useState(true);
	const [confirmation, setConfirmation] = useState(false);
	const [closeConfirmation, setCloseConfirmation] = useState(false);

	useEffect(() => {
		teacherNameRef.current.value = data.teacher_name || '';
		icRef.current.value = data.ic || '';
		phoneNumberRef.current.value = data.phone_number || '';
		emailRef.current.value = data.email || '';
		addressRef.current.value = data.address || '';
	}, [data]);

	const handleSubmit = useCallback(async () => {
		let valid = true;
		if (teacherNameRef.current.value.trim() === '') {
			valid = false;
			setTeacherNameValid(false);
			teacherNameRef.current.value = '';
			teacherNameRef.current.focus();
			teacherNameRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Empty Name!',
				message: 'Please enter a name',
				type: 'ERROR',
			});
			setTimeout(() => teacherNameRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (phoneNumberRef.current.value.trim() === '') {
			valid = false;
			setPhoneNumberValid(false);
			phoneNumberRef.current.value = '';
			phoneNumberRef.current.focus();
			phoneNumberRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Empty Phone Number!',
				message: 'Please enter a phone number',
				type: 'ERROR',
			});
			setTimeout(() => phoneNumberRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (!verifyPhoneNumber(phoneNumberRef.current.value)) {
			valid = false;
			setPhoneNumberValid(false);
			phoneNumberRef.current.focus();
			phoneNumberRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Invalid Phone Number!',
				message: 'Please enter a valid phone number',
				type: 'ERROR',
			});
			setTimeout(() => phoneNumberRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (emailRef.current?.value.trim() !== '' && !verifyEmail(emailRef.current?.value)) {
			valid = false;
			setEmailValid(false);
			emailRef.current.focus();
			emailRef.current.classList.add(ErrorTextBoxClass);
			setNotification({
				title: 'Invalid Email!',
				message: 'Please enter a valid email',
				type: 'ERROR',
			});
			setTimeout(() => emailRef.current?.classList?.remove(ErrorTextBoxClass), 500);
		}

		if (valid) {
			setConfirmation(true);
		}
	}, [handleUpdate]);

	const closeHandler = useCallback(() => {
		if (
			teacherNameRef.current?.value.trim() !== data.teacher_name ||
			icRef.current?.value.trim() !== data.ic ||
			phoneNumberRef.current?.value.trim() !== data.phone_number ||
			emailRef.current?.value.trim() !== data.email ||
			addressRef.current?.value.trim() !== data.address
		) {
			setCloseConfirmation(true);
		} else {
			closeModal();
		}
	}, [teacherNameRef, icRef, phoneNumberRef, emailRef, addressRef]);

	const modalButtons: ModalButtons = [
		{
			text: 'Create',
			class: GreenButtonClass,
			action: () => handleSubmit(),
		},
	];

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
				await handleUpdate(data.id, {
					teacher_name: teacherNameRef.current.value,
					ic: icRef.current?.value || '',
					phone_number: phoneNumberRef.current.value,
					email: emailRef.current?.value || '',
					address: addressRef.current?.value || '',
				} as TeachersCreateDto);
				setConfirmation(false);
				closeModal();
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

	const icOnFocusFormat = useCallback(() => {
		const curValue = icRef.current.value.replace(/-/g, '').trim();
		icRef.current.value = curValue;
	}, [icRef]);

	const phoneNumberOnFocusFormat = useCallback(() => {
		const curValue = phoneNumberRef.current.value.replace(/-/g, '').replace(/\s/g, '').trim();
		phoneNumberRef.current.value = curValue;
	}, [phoneNumberRef]);

	const icOnBlurFormat = useCallback(() => {
		if (icRef.current?.value.length === 12 && !icRef.current?.value.includes('-')) {
			const curValue = icRef.current.value.trim();
			icRef.current.value = `${curValue.slice(0, 6)}-${curValue.slice(6, 8)}-${curValue.slice(
				8,
				12,
			)}`;
		}
	}, [icRef]);

	const phoneNumberOnBlurFormat = useCallback(() => {
		if (
			phoneNumberRef.current?.value.length >= 10 &&
			phoneNumberRef.current?.value.length <= 12 &&
			(!phoneNumberRef.current?.value.includes('-') || !phoneNumberRef.current?.value.includes(' '))
		) {
			const curValue = phoneNumberRef.current.value.replace(/-/g, '').replace(/\s/g, '').trim();
			const starting = curValue.slice(0, 3);
			const middle = starting === '011' ? curValue.slice(3, 7) : curValue.slice(3, 6);
			const ending = starting === '011' ? curValue.slice(7) : curValue.slice(6);
			phoneNumberRef.current.value = `${starting}-${middle} ${ending}`;
		}
	}, [phoneNumberRef]);

	return (
		<React.Fragment>
			<Modal
				title="Edit Teacher"
				closeModal={closeHandler}
				closeOnBlur={false}
				buttons={modalButtons}
			>
				<div className={clsx('grid')}>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="teacherName" className={LabelTopClass}>
							Teacher Name:
							<RequiredIcon />
						</label>
						<input
							type="text"
							id="teacherName"
							className={clsx(TextBoxBottomClass, teacherNameValid || InvalidTextBoxClass)}
							placeholder="E.g. John"
							maxLength={50}
							required
							ref={teacherNameRef}
							onChange={() => setTeacherNameValid(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="ic" className={LabelTopClass}>
							IC:
						</label>
						<input
							type="text"
							id="ic"
							className={clsx(TextBoxBottomClass, icValid || InvalidTextBoxClass)}
							placeholder="E.g. XXXXXX-XX-XXXX"
							maxLength={50}
							required
							ref={icRef}
							onChange={() => setIcValid(true)}
							onFocus={() => icOnFocusFormat()}
							onBlur={() => icOnBlurFormat()}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="phoneNumber" className={LabelTopClass}>
							Phone Number:
							<RequiredIcon />
						</label>
						<input
							type="text"
							id="phoneNumber"
							className={clsx(TextBoxBottomClass, phoneNumberValid || InvalidTextBoxClass)}
							placeholder="E.g. 012-345 6789"
							maxLength={50}
							required
							ref={phoneNumberRef}
							onChange={() => setPhoneNumberValid(true)}
							onFocus={() => phoneNumberOnFocusFormat()}
							onBlur={() => phoneNumberOnBlurFormat()}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="email" className={LabelTopClass}>
							Email:
						</label>
						<input
							type="email"
							id="email"
							className={clsx(TextBoxBottomClass, emailValid || InvalidTextBoxClass)}
							placeholder="E.g. example@example.com"
							maxLength={50}
							required
							ref={emailRef}
							onChange={() => setEmailValid(true)}
						/>
					</div>
					<div className={clsx('flex', 'flex-col')}>
						<label htmlFor="address" className={LabelTopClass}>
							Address:
						</label>
						<textarea
							id="address"
							className={clsx(TextBoxBottomClass, 'min-h-[80px]', 'max-h-[300px]')}
							placeholder="Home Address"
							maxLength={50}
							required
							ref={addressRef}
						></textarea>
					</div>
				</div>
			</Modal>
			{confirmation ? (
				<Modal
					title="Confirmation"
					closeModal={() => setConfirmation(false)}
					closeOnBlur={false}
					buttons={confirmationButtons}
				>
					<p>Confirm Update?</p>
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
