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

export const returnError = (message) => {
    console.error(`Error: ${message}`);
    process.exit(1);
};