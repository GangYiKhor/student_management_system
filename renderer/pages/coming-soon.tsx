import Link from 'next/link';
import React from 'react';

function ComingSoon() {
	return (
		<React.Fragment>
			<h1>Coming Soon</h1>
			<Link href={'/home'}>Back to Home</Link>
		</React.Fragment>
	);
}

export default ComingSoon;
