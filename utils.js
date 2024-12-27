import { expenseCategories } from './model.js';

export const validateExpenseName = (name) => {
    if (typeof name !== 'string' || name.length === 0) {
        returnError('Expense name must be a non-empty string');
    }

    if (name.startsWith('-')) {
        returnError('Please provide a valid expense name');
    }
};

export const validateExpenseId = (id) => {
    if (typeof parseInt(id) !== 'number' || parseInt(id) <= 0) {
        returnError('Expense ID must be a positive number');
    }
};

export const validateAmount = (amount) => {
    if (typeof parseInt(amount) !== 'number' || parseInt(amount) <= 0) {
        returnError('Amount must be a positive number');
    }
};

export const validateMonth = (month) => {
    month = parseInt(month);
    if (typeof month !== 'number' || month <= 0 || month > 12) {
        returnError('Please enter a month between 1 and 12');
    }
};

export const validateExpenseCategory = (category) => {
    if (category && !expenseCategories.has(category.toUpperCase())) {
        returnError('Please provide a valid expense category');
    }
};
export const returnError = (message) => {
    console.error(`Error: ${message}`);
    process.exit(1);
};