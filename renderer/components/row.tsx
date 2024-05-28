import clsx from 'clsx';
import { ReactNode } from 'react';

type PropType = {
	children: ReactNode;
};

export default function Row({ children }: Readonly<PropType>) {
	return <div className={clsx('flex', 'gap-5')}>{children}</div>;
}
