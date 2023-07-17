import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useGet } from '../hooks/use-get';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../layouts/basic_layout';
import Modal from '../components/modal';
import { BlueButtonClass } from '../utils/class/button';
import { Loader } from 'lucide-react';
import { useTooltip } from '../hooks/use-tooltip';

function Home() {
	const { tooltip } = useTooltip();
	const getHelloWorld = useGet('/api/hello-world');
	const { data, isLoading, isSuccess, isError, dataUpdatedAt } = useQuery({
		queryKey: ['hello_world'],
		queryFn: () => getHelloWorld(),
		enabled: true,
	});
	const [modal, setModal] = useState(false);
	const [getData, setGetData] = useState('');
	useEffect(() => {
		if (data) {
			setGetData(data as string);
		}
	}, [data]);

	return (
		<React.Fragment>
			<Head>
				<title>Home - Nextron (with-typescript-tailwindcss)</title>
			</Head>
			<Layout headerTitle={'Hello World'}>
				{isLoading ? <Loader /> : null}
				<button
					className={BlueButtonClass}
					onClick={() => setModal(true)}
					{...tooltip(
						`Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto cumque quas quasi deleniti quidem commodi atque itaque laborum nobis eos aliquid reprehenderit, sed id iste odio voluptatem fugit! Assumenda, tempora. At nam quaerat minus odio, iusto consectetur nobis beatae quos ullam eveniet repudiandae, ex natus voluptate inventore odit officiis dolore nihil provident quibusdam voluptatum in vel? Tenetur amet incidunt nesciunt. Laboriosam, voluptates. Doloremque est expedita repellendus officia voluptate, autem neque! Eos officia, debitis dolores molestias dolore optio blanditiis nobis, accusamus aliquid nostrum quidem, nulla maxime ullam perferendis provident velit quibusdam. Architecto nemo sit ea dolores ipsum corrupti dicta! Laudantium dolorum quasi quas. Officiis exercitationem nobis recusandae iure aliquid! Nam id obcaecati iure laudantium a debitis totam molestias recusandae dicta ducimus. Nobis aperiam distinctio hic corporis repellat saepe illum quibusdam neque natus quasi. Molestiae asperiores vel, quo atque itaque unde nostrum accusamus vero dolore ut fuga doloremque est, quasi ab impedit. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto cumque quas quasi deleniti quidem commodi atque itaque laborum nobis eos aliquid reprehenderit, sed id iste odio voluptatem fugit! Assumenda, tempora. At nam quaerat minus odio, iusto consectetur nobis beatae quos ullam eveniet repudiandae, ex natus voluptate inventore odit officiis dolore nihil provident quibusdam voluptatum in vel? Tenetur amet incidunt nesciunt. Laboriosam, voluptates. Doloremque est expedita repellendus officia voluptate, autem neque! Eos officia, debitis dolores molestias dolore optio blanditiis nobis, accusamus aliquid nostrum quidem, nulla maxime ullam perferendis provident velit quibusdam. Architecto nemo sit ea dolores ipsum corrupti dicta! Laudantium dolorum quasi quas. Officiis exercitationem nobis recusandae iure aliquid! Nam id obcaecati iure laudantium a debitis totam molestias recusandae dicta ducimus. Nobis aperiam distinctio hic corporis repellat saepe illum quibusdam neque natus quasi. Molestiae asperiores vel, quo atque itaque unde nostrum accusamus vero dolore ut fuga doloremque est, quasi ab impedit. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto cumque quas quasi deleniti quidem commodi atque itaque laborum nobis eos aliquid reprehenderit, sed id iste odio voluptatem fugit! Assumenda, tempora. At nam quaerat minus odio, iusto consectetur nobis beatae quos ullam eveniet repudiandae, ex natus voluptate inventore odit officiis dolore nihil provident quibusdam voluptatum in vel? Tenetur amet incidunt nesciunt. Laboriosam, voluptates. Doloremque est expedita repellendus officia voluptate, autem neque! Eos officia, debitis dolores molestias dolore optio blanditiis nobis, accusamus aliquid nostrum quidem, nulla maxime ullam perferendis provident velit quibusdam. Architecto nemo sit ea dolores ipsum corrupti dicta! Laudantium dolorum quasi quas. Officiis exercitationem nobis recusandae iure aliquid! Nam id obcaecati iure laudantium a debitis totam molestias recusandae dicta ducimus. Nobis aperiam distinctio hic corporis repellat saepe illum quibusdam neque natus quasi. Molestiae asperiores vel, quo atque itaque unde nostrum accusamus vero dolore ut fuga doloremque est, quasi ab impedit.`,
					)}
				>
					Open Modal
				</button>
				{modal && (
					<Modal title={'Hello World'} closeModal={() => setModal(false)} closeOnBlur={true}>
						<p>
							Lorem ipsum, dolor sit amet consectetur adipisicing elit. Architecto cumque quas quasi
							deleniti quidem commodi atque itaque laborum nobis eos aliquid reprehenderit, sed id
							iste odio voluptatem fugit! Assumenda, tempora. At nam quaerat minus odio, iusto
							consectetur nobis beatae quos ullam eveniet repudiandae, ex natus voluptate inventore
							odit officiis dolore nihil provident quibusdam voluptatum in vel? Tenetur amet
							incidunt nesciunt. Laboriosam, voluptates. Doloremque est expedita repellendus officia
							voluptate, autem neque! Eos officia, debitis dolores molestias dolore optio blanditiis
							nobis, accusamus aliquid nostrum quidem, nulla maxime ullam perferendis provident
							velit quibusdam. Architecto nemo sit ea dolores ipsum corrupti dicta! Laudantium
							dolorum quasi quas. Officiis exercitationem nobis recusandae iure aliquid! Nam id
							obcaecati iure laudantium a debitis totam molestias recusandae dicta ducimus. Nobis
							aperiam distinctio hic corporis repellat saepe illum quibusdam neque natus quasi.
							Molestiae asperiores vel, quo atque itaque unde nostrum accusamus vero dolore ut fuga
							doloremque est, quasi ab impedit. Lorem ipsum, dolor sit amet consectetur adipisicing
							elit. Architecto cumque quas quasi deleniti quidem commodi atque itaque laborum nobis
							eos aliquid reprehenderit, sed id iste odio voluptatem fugit! Assumenda, tempora. At
							nam quaerat minus odio, iusto consectetur nobis beatae quos ullam eveniet repudiandae,
							ex natus voluptate inventore odit officiis dolore nihil provident quibusdam voluptatum
							in vel? Tenetur amet incidunt nesciunt. Laboriosam, voluptates. Doloremque est
							expedita repellendus officia voluptate, autem neque! Eos officia, debitis dolores
							molestias dolore optio blanditiis nobis, accusamus aliquid nostrum quidem, nulla
							maxime ullam perferendis provident velit quibusdam. Architecto nemo sit ea dolores
							ipsum corrupti dicta! Laudantium dolorum quasi quas. Officiis exercitationem nobis
							recusandae iure aliquid! Nam id obcaecati iure laudantium a debitis totam molestias
							recusandae dicta ducimus. Nobis aperiam distinctio hic corporis repellat saepe illum
							quibusdam neque natus quasi. Molestiae asperiores vel, quo atque itaque unde nostrum
							accusamus vero dolore ut fuga doloremque est, quasi ab impedit. Lorem ipsum, dolor sit
							amet consectetur adipisicing elit. Architecto cumque quas quasi deleniti quidem
							commodi atque itaque laborum nobis eos aliquid reprehenderit, sed id iste odio
							voluptatem fugit! Assumenda, tempora. At nam quaerat minus odio, iusto consectetur
							nobis beatae quos ullam eveniet repudiandae, ex natus voluptate inventore odit
							officiis dolore nihil provident quibusdam voluptatum in vel? Tenetur amet incidunt
							nesciunt. Laboriosam, voluptates. Doloremque est expedita repellendus officia
							voluptate, autem neque! Eos officia, debitis dolores molestias dolore optio blanditiis
							nobis, accusamus aliquid nostrum quidem, nulla maxime ullam perferendis provident
							velit quibusdam. Architecto nemo sit ea dolores ipsum corrupti dicta! Laudantium
							dolorum quasi quas. Officiis exercitationem nobis recusandae iure aliquid! Nam id
							obcaecati iure laudantium a debitis totam molestias recusandae dicta ducimus. Nobis
							aperiam distinctio hic corporis repellat saepe illum quibusdam neque natus quasi.
							Molestiae asperiores vel, quo atque itaque unde nostrum accusamus vero dolore ut fuga
							doloremque est, quasi ab impedit.
						</p>
					</Modal>
				)}
			</Layout>
		</React.Fragment>
	);
}

export default Home;
