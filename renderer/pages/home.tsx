import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { ComboBox } from '../components/inputs/combo-box';
import { Form } from '../components/inputs/form';
import { SelectClass } from '../components/inputs/select-class';
import Modal from '../components/modal';
import { useFormContext } from '../components/providers/form-providers';
import { useCustomQuery } from '../hooks/use-custom-query';
import { useGet } from '../hooks/use-get';
import { useGetClassComboBoxOptions } from '../hooks/use-get-class-options';
import { useGetFormOptions } from '../hooks/use-get-form-options';
import { useTooltip } from '../hooks/use-tooltip';
import { Layout } from '../layouts/basic_layout';
import { BlueButtonClass, EmptyLightButtonClass } from '../utils/tailwindClass/button';
import { ClassesGetResponses } from '../utils/types/responses/classes/get';

const formId = 'home-test';

function Home() {
	const { formData } = useFormContext(formId);
	const { tooltip } = useTooltip();
	const getHelloWorld = useGet('/api/hello-world');
	const { data, isLoading } = useQuery({
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

	const buttonClass = EmptyLightButtonClass;

	const getForm = useGetFormOptions();
	const getClass = useGetClassComboBoxOptions();

	const { data: classOptions } = useCustomQuery<ClassesGetResponses>({
		queryKey: ['classes'],
		queryFn: () =>
			getClass({
				is_active: true,
				orderBy: 'class_name asc',
			}),
	});

	console.log('Page Reloaded');

	return (
		<React.Fragment>
			<Head>
				<title>Home</title>
			</Head>
			<Layout headerTitle={'Hello World'}>
				<button className={buttonClass} onClick={() => console.log(formData)}>
					Show Form Data
				</button>
				<div className={buttonClass}>Test DIV Button</div>
				<button className={buttonClass} disabled>
					Test Button
				</button>
				<Form formId={formId} onSubmit={() => console.log('Submitted')} revertible>
					{/* <div>
						<Row>
							<TextInput id="text-input" name="Text" label="Text" placeholder="Placeholder" />
							<TextInput
								id="text-input-default"
								name="Default Text"
								label="Default Text"
								defaultValue="Default"
							/>
							<TextInput
								id="text-input-presuffix"
								name="PreSuffix"
								label="PreSuffix"
								prefix="RM"
								suffix="%"
							/>
						</Row>
						<Row>
							<TextInput
								id="text-input-ic"
								name="IC"
								label="IC"
								onFocusFormat={icFormatRevert}
								onBlurFormat={icFormat}
							/>
							<TextInput id="text-input-email" name="Email" label="Email" email />
							<TextInput id="text-input-tel" name="Tel" label="Tel" tel />
						</Row>
						<Row>
							<TextInput id="text-input-max5" name="Max5" label="Max 5" maxLength={5} />
							<TextInput id="text-input-required" name="Req" label="Req" required />
							<TextInput
								id="text-input-locked"
								name="LockInput"
								label="Locked"
								defaultValue="Locker"
							/>
							<TextInput
								id="text-input-locked"
								name="LockInput"
								label="Locked"
								defaultValue="Locker"
								locked
							/>
						</Row>
						<TextInput id="text-input-leftlabel" name="Left" label="Left" leftLabel />
					</div> */}

					{/* <div>
						<Row>
							<NumberInput id="number-input" name="Text" label="Text" placeholder="Placeholder" />
							<NumberInput
								id="number-input-default"
								name="Default 5"
								label="Default 5"
								defaultValue={5}
							/>
							<NumberInput
								id="number-input-presuffix"
								name="PreSuffix"
								label="PreSuffix"
								prefix="RM"
								suffix="%"
							/>
						</Row>
						<Row>
							<NumberInput
								id="number-input-5-25"
								name="5 to 25"
								label="5 to 25"
								min={5}
								max={25}
								step={0.01}
							/>
							<NumberInput id="number-input-required" name="Req" label="Req" required />
						</Row>
						<Row>
							<NumberInput id="number-input-locked" name="LockInput" label="Locked" />
							<NumberInput
								id="number-input-locked"
								name="LockInput"
								label="Locked"
								defaultValue={50}
								locked
							/>
						</Row>
						<NumberInput id="number-input-leftlabel" name="Left" label="Left" leftLabel />
					</div> */}

					{/* <div>
						<TextAreaInput
							id="textarea-input"
							label="TextArea"
							name="Text Area"
							placeholder="Placeholder"
						/>
						<TextAreaInput
							id="textarea-input-default"
							label="Default"
							name="Default"
							defaultValue="Default"
						/>
						<TextAreaInput id="textarea-input-Req" label="Required" name="Req" required />
						<TextAreaInput
							id="textarea-input-NotResize"
							label="NotResize"
							name="NotResize"
							notResizable
						/>
						<TextAreaInput id="textarea-input-locked" label="locked" name="locked" locked />
						<TextAreaInput id="textarea-input-max5" label="Max 5" name="Req" maxLength={5} />
					</div> */}

					{/* <div>
						<DateInput id="date-input" label="Date" name="Date" />
						<DateInput
							id="date-inputDefault"
							label="Default"
							name="Default"
							defaultValue={getToday()}
						/>
						<DateInput id="date-input-req" label="Date Req" name="Date Req" required />
						<DateInput id="date-Locked" label="Date Locked" name="Date Locked" locked />
						<DateInput
							id="date-start"
							label="Date Start"
							name="Date start"
							max={formData?.['date-end']?.value}
							leftLabel
						/>
						<DateInput
							id="date-end"
							label="Date End"
							name="Date End"
							min={formData?.['date-start']?.value}
						/>
						<DateInput
							id="date-start-inc"
							label="Date Start Inc"
							name="Date Start Inc"
							max={formData?.['date-end-inc']?.value}
							minMaxInclusive
						/>
						<DateInput
							id="date-end-inc"
							label="Date End Inc"
							name="Date End Inc"
							min={formData?.['date-start-inc']?.value}
							minMaxInclusive
						/>
					</div> */}

					{/* <div>
						<TimeInput id="Time-input" label="Time" name="Time" />
						<TimeInput
							id="Time-inputDefault"
							label="Default"
							name="Default"
							defaultValue={parseDateTime('15:00')}
						/>
						<TimeInput id="Time-input-req" label="Time Req" name="Time Req" required />
						<TimeInput id="Time-Locked" label="Time Locked" name="Time Locked" locked />
						<TimeInput
							id="Time-start"
							label="Time Start"
							name="Time start"
							max={formData?.['Time-end']?.value}
							leftLabel
						/>
						<TimeInput
							id="Time-end"
							label="Time End"
							name="Time End"
							min={formData?.['Time-start']?.value}
						/>
					</div> */}

					{/* <div>
						<CheckboxInput id="check-input" label="Check" name="Check" />
						<CheckboxInput id="check-input" label="Check" name="Check" labelLocation="left" />
						<CheckboxInput id="check-input" label="Check" name="Check" labelLocation="top" />
						<CheckboxInput id="check-input" label="Check" name="Check" labelLocation="bottom" />
						<CheckboxInput id="check-inputDefault" label="Default" name="Default" defaultChecked />
						<CheckboxInput id="check-input-req" label="Check Req" name="Check Req" required />
						<CheckboxInput
							id="check-input-req-2"
							label="Check Req 2"
							name="Check Req 2"
							required
							labelLocation="top"
						/>
						<CheckboxInput id="check-Locked" label="Check Locked" name="Check Locked" locked />
						<CheckboxInput
							id="check-if-1"
							label="Check If 1"
							name="Check if 1"
							valueParser={value => (value ? 1 : 0)}
							checkIf={value => value == 1}
						/>
						<NumberInput id="check-if-1" label="Check If 1" name="Check if 1" />
					</div> */}

					{/* <div>
						<CheckboxGroupInput
							id="checkgroup-input"
							title="Month"
							labels={['1', '2', '3']}
							values={[1, 2, 3]}
							allUncheckedValue={0}
							name="Checkgroup"
							required
						/>
						<CheckboxGroupInput
							id="checkgroup-lock-input"
							labels={['1', '2', '3']}
							values={[1, 2, 3]}
							allUncheckedValue={0}
							name="Checkgroup lock"
							locked
						/>
						<CheckboxGroupInput
							id="checkgroup-default-input"
							labels={['1', '2', '3']}
							defaultValue={3}
							values={[1, 2, 3]}
							allUncheckedValue={0}
							name="Checkgroup default"
							labelLocation="top"
							required
						/>
					</div> */}

					{/* <div>
						<DateRangeInput
							startId="date-start"
							endId="date-end"
							startName="Start Date"
							endName="End Date"
							label="Date"
						/>
						<DateRangeInput
							startId="date-startDef"
							endId="date-endDef"
							startName="Start Date Def"
							endName="End Date Def"
							label="Date Def"
							defaultStart={parseDateTime('2024-09-01')}
							defaultEnd={parseDateTime('2024-09-30')}
						/>
						<DateRangeInput
							startId="date-start-min"
							endId="date-end-min"
							startName="Start Date Min"
							endName="End Date Min"
							label="Date Min"
							min={parseDateTime('2024-05-01')}
							max={parseDateTime('2025-01-31')}
						/>
						<DateRangeInput
							startId="date-start-Req"
							endId="date-end-Req"
							startName="Start Date Req"
							endName="End Date Req"
							label="Date Req"
							required
						/>
						<DateRangeInput
							startId="date-start-Req"
							endId="date-end-Req"
							startName="Start Date Req"
							endName="End Date Req"
							label="Date Req"
							required
							locked
						/>
					</div> */}

					{/* <div>
						<SelectInput
							id="select-input-empty"
							label="Select"
							name="Select"
							placeholder="Empty"
							placeholderValue={50}
						/>
						<SelectInput
							id="select-input"
							label="Select"
							name="Input"
							options={[
								{ label: 'Label1', value: 1 },
								{ label: 'Label2', value: 2 },
								{ label: 'Label3', value: 3 },
								{ label: 'Label4', value: 4 },
								{ label: 'Label5', value: 5 },
							]}
							onUpdate={() => console.log('Updated')}
							defaultValue={3}
							required
							leftLabel
						/>
						<SelectInput
							id="select-input-lock"
							label="Select"
							name="Input"
							options={[
								{ label: 'Label1', value: 1 },
								{ label: 'Label2', value: 2 },
								{ label: 'Label3', value: 3 },
								{ label: 'Label4', value: 4 },
								{ label: 'Label5', value: 5 },
							]}
							defaultValue={3}
							locked
						/>
						<SelectInput
							id="select-input-form"
							label="Form"
							name="form"
							queryFn={() => getForm({ orderBy: 'form_name desc' })}
							onUpdate={() => console.log('Updated')}
							defaultValue={3}
							required
							leftLabel
						/>
					</div> */}

					<div>
						<SelectClass id="combobox" name="ComboBox" label="Class" required />
						<SelectClass
							id="combobox"
							name="ComboBox"
							label="Class"
							onUpdate={() => console.log('Updated')}
							required
						/>
						<SelectClass id="combobox" name="ComboBox" label="Class" required locked />
						<SelectClass
							id="combobox-idonly"
							name="ComboBox ONly Id"
							label="Class ID"
							onlyId
							required
						/>
						<ComboBox
							id="combobox-class"
							label="comboboxclass"
							name="comboboxclass"
							options={classOptions}
							columns={['class_name', 'form.form_name']}
							labelColumn="form.form_name"
							placeholder="Placeholder Here"
							notSearchable
						/>
						<ComboBox
							id="combobox-class-def"
							label="comboboxclass-def"
							name="comboboxclassdef"
							options={[
								{ id: 1, name: 'Name1' },
								{ id: 2, name: 'Name2' },
								{ id: 3, name: 'Name3' },
								{ id: 4, name: 'Name4' },
							]}
							defaultValue={{ id: 2, name: 'Name2' }}
							columns={['id', 'name']}
							labelColumn="name"
							placeholder="Placeholder Here"
							notSearchable
						/>
					</div>
				</Form>
				{isLoading ? <Loader /> : null}
				<h1>{getData}</h1>
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
