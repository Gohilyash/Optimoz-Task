let expenses = [];
let totalAmount = 0;
let budget = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const descriptionInput = document.getElementById('description-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const budgetInput = document.getElementById('budget-input');
const setBudgetBtn = document.getElementById('set-budget-btn');
const budgetMessage = document.getElementById('budget-message');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');

addBtn.addEventListener('click', function() {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    const description = descriptionInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }
    if (description === '') {
        alert('Please enter a description');
        return;
    }

    const expense = { category, amount, date, description };
    expenses.push(expense);

    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;

    const newRow = expensesTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const descriptionCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash');
    deleteIcon.style.cursor = 'pointer'; 
    deleteIcon.addEventListener('click', function() {
        expenses.splice(expenses.indexOf(expense), 1);
        totalAmount -= expense.amount;
        totalAmountCell.textContent = totalAmount;
        expensesTableBody.removeChild(newRow);
    });

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;
    descriptionCell.textContent = expense.description;
    deleteCell.appendChild(deleteIcon);

    checkBudget();
});

setBudgetBtn.addEventListener('click', function() {
    budget = Number(budgetInput.value);
    checkBudget();
});

function checkBudget() {
    if (budget > 0) {
        const remaining = budget - totalAmount;
        if (remaining < 0) {
            budgetMessage.textContent = `You have exceeded your budget by ${-remaining}`;
            budgetMessage.style.color = 'red';
        } else {
            budgetMessage.textContent = `You have ${remaining} left for the month`;
            budgetMessage.style.color = 'green';
        }
    }
}

saveBtn.addEventListener('click', function() {
    
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Category,Amount,Date,Description\n" 
        + expenses.map(e => {
            
            const formattedDate = new Date(e.date).toISOString().split('T')[0];
            return `${e.category},${e.amount},${formattedDate},${e.description}`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
});

loadBtn.addEventListener('click', function() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const lines = text.split('\n').slice(1);
            for (const line of lines) {
                const [category, amount, date, description] = line.split(',');
                if (category && amount && date && description) {
                    const expense = { category, amount: Number(amount), date, description };
                    expenses.push(expense);
                    totalAmount += Number(amount);
                }
            }
            updateTable();
            checkBudget();
        }
        reader.readAsText(file);
    });
    input.click();
});

function updateTable() {
    expensesTableBody.innerHTML = '';
    for (const expense of expenses) {
        const newRow = expensesTableBody.insertRow();

        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const descriptionCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();

        
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid', 'fa-trash');
        deleteIcon.style.cursor = 'pointer'; 
        deleteIcon.addEventListener('click', function() {
            expenses.splice(expenses.indexOf(expense), 1);
            totalAmount -= expense.amount;
            totalAmountCell.textContent = totalAmount;
            expensesTableBody.removeChild(newRow);
        });

        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        dateCell.textContent = expense.date;
        descriptionCell.textContent = expense.description;
        deleteCell.appendChild(deleteIcon);
    }
    totalAmountCell.textContent = totalAmount;
}

for (const expense of expenses) {
    totalAmount += expense.amount;
    totalAmountCell.textContent = totalAmount;

    const newRow = expensesTableBody.insertRow();
    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const descriptionCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash');
    deleteIcon.style.cursor = 'pointer'; 
    deleteIcon.addEventListener('click', function() {
        expenses.splice(expenses.indexOf(expense), 1);
        totalAmount -= expense.amount;
        totalAmountCell.textContent = totalAmount;
        expensesTableBody.removeChild(newRow);
    });

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;
    descriptionCell.textContent = expense.description;
    deleteCell.appendChild(deleteIcon);
}
