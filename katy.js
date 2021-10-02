#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

async function main() {
	const args = process.argv.filter(
		entry =>
			// linux/mac
			!entry.endsWith('/bin/node') &&
			!entry.endsWith('/bin/katy') &&
			// win
			!entry.endsWith('node.exe') &&
			!entry.endsWith('katy.exe')
	);

	const subcommand = args[0];
	const filePath = args[1] || undefined;

	let data;

	try {
		if (!args.length) throw Error('ERROR: no subcommand was provided');
		if (!filePath) throw Error('ERROR: no file was provided');
		if (path.extname(filePath) !== '.katy') throw Error('ERROR: invalid file');

		data = await getFileContents(filePath);
	} catch (err) {
		return console.error(err.message);
	}

	const programLines = data.split('\n');
	const parsedProgramLines = parseLines(programLines);

	if (subcommand === 'compile') return compileProgram(parsedProgramLines);
	if (subcommand === 'run') return interpretProgram(parsedProgramLines);

	console.log(`ERROR: ${subcommand} not recognized as a subcommand`);
}

async function getFileContents(filePath) {
	const data = await fs.readFile(path.join(process.cwd(), filePath));
	return data.toString();
}

function parseLines(lines) {
	return lines
		.filter(line => !line.startsWith('//') && line !== '\r')
		.map(line => line.trim().replace('\r', ''));
}

function compileProgram(lines) {
	console.log('ERROR: compilation not implemented');
}

function interpretProgram(lines) {
	lines.forEach(line => {
		const tokens = line.split(' ');
		const command = tokens[0];

		if (command === 'add') return add(tokens.slice(1));
		if (command === 'subtract') return subtract(tokens.slice(1));
		if (command === 'multiply') return multiply(tokens.slice(1));
		if (command === 'divide') return divide(tokens.slice(1));
		if (command === 'write') return write(tokens.slice(1).join(' '));
	});
}

function add(numbers) {
	const result = numbers.reduce((total, curr) => parseInt(total) + parseInt(curr));
	console.log(result);
}

function subtract(numbers) {
	const result = numbers.reduce((total, curr) => parseInt(total) - parseInt(curr));
	console.log(result);
}

function multiply(numbers) {
	const result = numbers.reduce((total, curr) => parseInt(total) * parseInt(curr));
	console.log(result);
}

function divide(numbers) {
	const result = numbers.reduce((total, curr) => parseInt(total) / parseInt(curr));
	console.log(result);
}

function write(string) {
	console.log(string.slice(1, string.length - 1));
}

main();
