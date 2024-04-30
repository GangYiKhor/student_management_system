import { MutableRefObject, useRef, useState } from 'react';

export function useSelectRef(): [
	MutableRefObject<HTMLSelectElement>,
	{ value: boolean; set: (value: boolean) => void },
] {
	const ref = useRef<HTMLSelectElement>();
	const [valid, setValid] = useState(true);
	return [ref, { value: valid, set: setValid }];
}
