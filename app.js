#!/usr/bin/env node

import { argv } from 'node:process';
import fs from 'node:fs';
import { validCommandsSet, validFlagsSet } from './model.js';

import { program } from 'commander';
import { validateAmount, validateExpenseName, returnError, validateExpenseId, validateMonth, validateExpenseCategory } from './utils.js';

const fileName = 'expenses.json';

program.name('expense-tracker')
    .description('A simple CLI to track expenses')
    .version('0.1.0'); // Set the version of the CLI

// Define the 'add' command
program.command('add')
    .description('Add a new expense')
    .requiredOption('-d, --description <description>', 'Description of the expense')
    .requiredOption('-a, --amount <amount>', 'Amount of the expense')
    .requiredOption('-c, --category <category>', 'Category of the expense')
    .action((options) => {
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

            // Add the new expense to the list
            const expenseToAdd = {
                date: new Date().toISOString().split('T')[0],
                description: options.description,
                amount: options.amount,
                category: options.category
            };

            if (!expenses.length) {
                expenseToAdd['id'] = 1;
            } else {
                expenseToAdd['id'] = expenses[expenses.length - 1]['id'] + 1;
            };

            expenses.push(expenseToAdd);

            // Write the updated list back to the file
            postExpenses(expenses, 'add', expenseToAdd['id']);
        });
    });

// Define the 'update' command
program.command('update')
    .description('Update an existing expense')
    .requiredOption('-i, --id <id>', 'ID of the expense')
    .requiredOption('-d, --description <description>', 'Description of the expense')
    .requiredOption('-a, --amount <amount>', 'Amount of the expense')
    .action((options) => {
        validateExpenseId(options.id);
        validateExpenseName(options.description);
        validateAmount(options.amount);

        // Read the file and parse the JSON content
        const expenses = getExpenses();

        // Find the expense to update
        const expenseIndex = expenses.findIndex((expense) => expense.id === parseInt(options.id));
        const expenseToUpdate = expenses[expenseIndex];

        if (expenseIndex === -1) {
            returnError(`Expense with ID ${options.id} not found`);
        } else {
            expenseToUpdate['description'] = options.description;
            expenseToUpdate['amount'] = options.amount;
            expenseToUpdate['category'] = options.category;
            expenses[expenseIndex] = expenseToUpdate;
        }

        // Write the updated list back to the file
        postExpenses(expenses, 'update', options.id);
    });

// Define the 'delete' command
program.command('delete')
    .description('Delete an existing expense')
    .option('-i, --id <id>', 'ID of the expense')
    .action((options) => {
        validateExpenseId(options.id);

        // Read the file and parse the JSON content
        const expenses = getExpenses();

        // Find the expense to delete
        const expenseIndex = expenses.findIndex((expense) => expense.id === parseInt(options.id));

        if (expenseIndex === -1) {
            returnError(`Expense with ID ${options.id} not found`);
        } else {
            expenses.splice(expenseIndex, 1);
        }

        // Write the updated list back to the file
        postExpenses(expenses, 'delete', options.id);
    });

// Define the 'list' command
program.command('list')
    .description('List all expenses')
    .option('-c, --category <category>', 'Category to summarize expenses for')
    .action((options) => {
        const category = options.category ? options.category : '';

        validateExpenseCategory(category);

        // Read the file and parse the JSON content
        let expenses = getExpenses();

        if (category) {
            expenses = expenses.filter(expense => expense.category.toLowerCase() === category.toLowerCase())
                        .map(expense => {
                            return {
                                ID: expense.id,
                                Date: expense.date,
                                Description: expense.description,
                                Amount: expense.amount,
                                Category: expense.category
                            };
                        });
        } else {
            expenses = expenses.map(expense => {
                return {
                    ID: expense.id,
                    Date: expense.date,
                    Description: expense.description,
                    Amount: expense.amount,
                    Category: expense.category
                };
            })
        }
        
        console.table(expenses, ['ID', 'Date', 'Description', 'Amount']);
    });

// Define the 'summary' command
program.command('summary')
    .description('Show a summary of expenses')
    .option('-m, --month <month>', 'Month to summarize expenses for')
    .option('-c, --category <category>', 'Category to summarize expenses for')
    .action((options) => {
        const month = options.month;
        const category = options.category;
        let totalAmount = 0;
        let message = '';

        validateMonth(month);
        validateExpenseCategory(category);

        // Read the file and parse the JSON content
        const expenses = getExpenses();

        if (category && month) {
            totalAmount = expenses.filter(expense => expense.date.split('-')[1] == month && expense.category.toLowerCase() === category.toLowerCase())
                .reduce((acc, expense) => acc + parseInt(expense.amount), totalAmount);
            message = `Total expenses for ${category} in month ${month}: ${totalAmount}`;
        } else if (category && !month) {
            totalAmount = expenses.filter(expense => expense.category.toLowerCase() === category.toLowerCase())
                .reduce((acc, expense) => acc + parseInt(expense.amount), totalAmount);
            message = `Total expenses for ${category}: ${totalAmount}`;
        } else if (!category && month) {
            totalAmount = expenses.filter(expense => expense.date.split('-')[1] == month)
                .reduce((acc, expense) => acc + parseInt(expense.amount), totalAmount);
            message = `Total expenses for month ${month}: ${totalAmount}`;
        } else {
            totalAmount = expenses.reduce((acc, expense) => acc + parseInt(expense.amount), totalAmount);
            message = `Total expenses: ${totalAmount}`;
        }

        // if (!month) {
        //     totalAmount = expenses.reduce((acc, expense) => acc + parseInt(expense.amount), 0);
        // } else {
        //     // Filter expenses by month and calculate the total amount
        //     // expense.date.split('-')[1] == month return true for 8 == 08
        //     totalAmount = expenses.filter(expense => expense.date.split('-')[1] == month)
        //                     .reduce((acc, expense) => acc + parseInt(expense.amount), 0);
        // }

        if (totalAmount === 0) {
            returnError('No expenses found for the specified month');
        }
        console.info(message);
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

const postExpenses = (expenses, action = '', id) => {
    try {
        fs.writeFile(fileName, JSON.stringify(expenses), 'utf-8', (err) => {
            if (err) {
                returnError(`Unable to ${action} expense. Please try again`);
            }

            console.info(`Expense ${action}ed successfully ${id ? 'with ID: ' + id : ''}`);
        });
    } catch (err) {
        returnError(`Error ${action}ing expenses`);
    }
};

program.parse();
