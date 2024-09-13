import { readFileSync, writeFileSync } from 'fs';

export const CONFIG_FILE_PATH = './settings.cfg';

export function readConfig(configName?: string) {
	const configFile = readFileSync(CONFIG_FILE_PATH, 'utf8').split('\n');
	const configs = {};

	for (const line of configFile) {
		const name = line.split('=')[0];
		let value = line.substring(line.indexOf('=') + 1);

		if (value.startsWith('"')) {
			value = value.substring(1);
		}
		if (value.endsWith('"')) {
			value = value.substring(0, value.length - 1);
		}
		configs[name] = value;
	}

	if (configName) {
		return configs[configName];
	}
	return configs;
}

export function writeConfig(name: string, value: string) {
	const configFile = readFileSync(CONFIG_FILE_PATH, 'utf8').split('\n');
	let newConfig = '';
	let written = false;

	for (const line of configFile) {
		const cur_name = line.split('=')[0];

		if (cur_name === name) {
			newConfig += `${cur_name}="${value}"\n`;
			written = true;
		} else {
			newConfig += `${line}\n`;
		}
	}

	if (!written) {
		newConfig += `${name}="${value}"\n`;
	}

	writeFileSync(CONFIG_FILE_PATH, newConfig);
}
