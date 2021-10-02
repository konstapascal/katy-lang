#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const args = process.argv.splice(process.argv.length - 2);

const mode = args[0];
const file = args[1];

async function main() {
	let data;

	try {
		if (path.extname(file) !== '.katy')
			throw Error(`EEXT: given file is not a .katy file, open '${path.join(__dirname, file)}'`);
		data = await getFileContents(file);
	} catch (err) {
		return console.error(err.message);
	}

	const programLines = data.split('\n');
	const parsedProgramLines = parseLines(programLines);

	if (mode === 'compile') return compileProgram(parsedProgramLines);
	if (mode === 'run') return interpretProgram(parsedProgramLines);
}

async function getFileContents(file) {
	const data = await fs.readFile(path.join(__dirname, file));
	return data.toString();
}

function parseLines(lines) {
	return lines
		.filter(line => !line.startsWith('//') && line !== '\r')
		.map(line => line.trim().replace('\r', ''));
}

function compileProgram(lines) {
	console.log('Compilation not implemeneted!');
}

function interpretProgram(lines) {
	lines.forEach(line => {
		const tokens = line.split(' ');
		const command = tokens[0];

		if (command === 'add') add(tokens.slice(1));
		if (command === 'subtract') subtract(tokens.slice(1));
		if (command === 'multiply') multiply(tokens.slice(1));
		if (command === 'divide') divide(tokens.slice(1));
		if (command === 'write') write(tokens.slice(1).join(' '));
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
