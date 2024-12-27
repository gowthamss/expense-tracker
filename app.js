#!/usr/bin/env node

import {argv} from 'node:process';
import fs from 'node:fs';
import { validCommandsSet, validFlagsSet } from './model.js';

import {program} from 'commander';
import { validateAmount, validateExpenseName, returnError } from './utils.js';

const fileName = 'expenses.json';

program.name('expense-tracker')
    .description('A simple CLI to track expenses')
    .version('0.1.0'); // Set the version of the CLI

// Define the 'add' command
program.command('add')
    .description('Add a new expense')
    .requiredOption('-d, --description <description>', 'Description of the expense')
    .requiredOption('-a, --amount <amount>', 'Amount of the expense')
    .action((options) => {
        console.log(options);
        validateExpenseName(options.description);
        validateAmount(options.amount);

        // Check if the file exists, if not create it
        fs.access(fileName, fs.constants.F_OK, (err) => {
            if (err && err.code === 'ENOENT') {
                fs.writeFileSync(fileName, '[]', 'utf-8', (err) => {
                    if (err) {
                        returnError('Error adding the expense. Please try again');
                    }
                });
            }

            // Read the file and parse the JSON content
            const expenses = getExpenses();
            console.log(expenses);

            // Add the new expense to the list
            const expenseToAdd = {
                description: options.description,
                amount: options.amount
            };

            if (!expenses.length) {
                expenseToAdd['id'] = 1;
            } else {
                expenseToAdd['id'] = expenses[expenses.length - 1]['id'] + 1;
            };

            expenses.push(expenseToAdd);

            // Write the updated list back to the file
            postExpenses(expenses, 'add');
        });
    });

const getExpenses = () => {
    try {
        return JSON.parse(fs.readFileSync(fileName, 'utf-8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            returnError('No expenses found');
        }
        returnError('Error getting expenses');
    }
};

const postExpenses = (expenses, action='') => {
    try {
        fs.writeFile(fileName, JSON.stringify(expenses), 'utf-8', (err) => {
            if (err) {
                returnError(`Unable to ${action} expense. Please try again`);
            }

            console.info(`Expense ${action}ed successfully`);
        });
    } catch (err) {
        returnError(`Error ${action}ing expenses`);
    }
};

// Define the 'update' command
program.command('update')
    .description('Update an existing expense')
    .option('-i, --id <id>', 'ID of the expense')
    .option('-d, --description <description>', 'Description of the expense')
    .option('-a, --amount <amount>', 'Amount of the expense')
    .action((options) => {
        console.log('Updating an expense');
        console.log('ID:', options.id);
        console.log('Description:', options.description);
        console.log('Amount:', options.amount);
    });

// Define the 'delete' command
program.command('delete')
    .description('Delete an existing expense')
    .option('-i, --id <id>', 'ID of the expense')
    .action((options) => {
        console.log('Deleting an expense');
        console.log('ID:', options.id);
    });

// Define the 'list' command
program.command('list')
    .description('List all expenses')
    .action(() => {
        console.log('Listing all expenses');
    });

// Define the 'summary' command
program.command('summary')
    .description('Show a summary of expenses')
    .action(() => {
        console.log('Showing expense summary');
    });

program.parse();