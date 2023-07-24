import { MutableRefObject, useRef, useState } from 'react';

export function useInputRef(): [
	MutableRefObject<HTMLInputElement>,
	{ value: boolean; set: (value: boolean) => void },
] {
	const ref = useRef<HTMLInputElement>();
	const [valid, setValid] = useState(true);
	return [ref, { value: valid, set: setValid }];
}
