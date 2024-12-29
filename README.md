# expense-tracker
This project is a **simple expense tracker application** that helps users manage their personal finances. It allows users to **record their income and expenses**, **categorize transactions**, and **view summary reports** to better understand their spending habits.


<h4>How to use:</h4>
<p>Clone the repo and start adding the expenses by using following commands.</p>

<h3>Help</h3>
<i>Usage</i>: expense-tracker [options] [command]

A simple CLI to track expenses

<ul><b>Options:</b>

  <li>-V, --version      output the version number  </li>
  <li>-h, --help         display help for command</li>
</ul>

<ul><b>Commands:</b>
  <li><i>add</i> [options]      Add a new expense</li>
  <li><i>update</i> [options]   Update an existing expense</li>
  <li><i>delete</i> [options]   Delete an existing expense</li>
  <li><i>list</i> [options]     List all expenses</li>
  <li><i>summary</i> [options]  Show a summary of expenses</li>
  <li><i>budget</i> [options]   Set a budget for your expenses</li>
  <li><i>help</i> [command]     display help for command</li>
</ul>


<h3>Adding expenses:</h3>
<i>Usage</i>: expense-tracker add [options]

Add a new expense

<ul><b>Options:</b>
  <li><i>-d, --description</i> <description>  Description of the expense</li>
  <li><i>-a, --amount</i> <amount>            Amount of the expense</li>
  <li><i>-c, --category</i> <category>        Category of the expense</li>
  <li><i>-h, --help</i>                       display help for command</li>
</ul>
Ex: <code>expense-tracker add -d 'ice cream' -a 40 -c 'food'</code>

<h3>Updating expenses:</h3>
<i>Usage</i>: expense-tracker update [options]

Update an existing expense

<ul><b>Options:</b>
  <li><i>-i, --id <id></i>                    ID of the expense</li>
  <li><i>-d, --description</i> <description>  Description of the expense</li>
  <li><i>-a, --amount</i> <amount>            Amount of the expense</li>
  <li><i>-c, --category</i> <category>        Category of the expense</li>
  <li><i>-h, --help</i>                       display help for command</li>
</ul>
Ex: <code>expense-tracker update -i 1 -d 'vegetables' -a 100 -c 'groceries'</code>

<h3>Deleting expenses:</h3>
<i>Usage</i>: expense-tracker delete [options]

Delete an existing expense

<ul><b>Options:</b>
  <li><i>-i, --id <id></i>                    ID of the expense</li>
  <li><i>-h, --help</i>                       display help for command</li>
</ul>
Ex: <code>expense-tracker delete -i 1</code>

<h3>Listing expenses:</h3>
<i>Usage</i>: expense-tracker list [options]

List all expenses

<ul><b>Options:</b>
  <li><i>-c, --category</i> <category>        Category to list expenses</li>
  <li><i>-h, --help</i>                       display help for command</li>
</ul>
Ex: <code>expense-tracker list</code> or <code>expense-tracker list -c 'food'</code>

<h3>Expenses summary:</h3>
<i>Usage</i>: expense-tracker list [options]

Show a summary of expenses

<ul><b>Options:</b>
<li><i>-m, --month</i> <month>        Month to summarize expenses for</li>
  <li><i>-c, --category</i> <category>        Category to summarize expenses for</li>
  <li><i>-h, --help</i>                       display help for command</li>
</ul>
Ex: <code>expense-tracker summary</code> or <code>expense-tracker summary -m 12</code> or <code>expense-tracker summary -c 'food'</code>

<br>
<br>
This project developed by following: <a>https://roadmap.sh/projects/expense-tracker</a>