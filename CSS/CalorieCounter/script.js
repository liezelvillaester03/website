const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories" />
  `;
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

function calculateCalories(e) {
    e.preventDefault();
    isError = false;
  
    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');
  
    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    const totalConsumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories + exerciseCalories;
  
    if (isError) {
      return;
    }
  
    output.innerHTML = `
      <table class="calories-table">
        <tr>
          <th>Breakfast Calories</th>
          <th>Lunch Calories</th>
          <th>Dinner Calories</th>
          <th>Snacks Calories</th>
          <th>Exercise Calories</th>
          <th>Total Calories</th>
          <th>Action</th>
        </tr>
        <tr>
          <td>${breakfastCalories}</td>
          <td>${lunchCalories}</td>
          <td>${dinnerCalories}</td>
          <td>${snacksCalories}</td>
          <td>${exerciseCalories}</td>
          <td>${totalConsumedCalories}</td>
          <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </td>
        </tr>
      </table>
    `;
  
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', editRow);
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', deleteRow);
    });
  
    output.classList.remove('hide');
  }
  
  
function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
  return calories;
}

function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}

function editRow(event) {
    const row = event.target.closest('tr');
    const cells = row.querySelectorAll('td');

    // Check if the row being edited is the total or action row
    if (cells[0].textContent === "Total" || cells[0].textContent === "Action") {
        alert('Cannot edit this row.');
        return;
    }

    const cellValues = [];

    cells.forEach(cell => {
        // Exclude the Action cell from being edited
        if (cell.cellIndex !== cells.length - 1) {
            cellValues.push(cell.textContent.trim());
        }
    });

    const newValues = prompt('Enter new values for the row:', cellValues.join(', '));

    if (!newValues) {
        return;
    }

    const newValuesArray = newValues.split(',').map(value => value.trim());

    cells.forEach((cell, index) => {
        // Only edit cells containing calorie values
        if (index !== cells.length - 1) {
            cell.textContent = newValuesArray[index];
        }
    });

    // Recalculate total calories after editing the row
    let totalCalories = 0;
    cells.forEach((cell, index) => {
        if (index !== cells.length - 1) { // Exclude the Action column
            totalCalories += parseFloat(cell.textContent);
        }
    });

    // Update the total calories cell
    const totalRow = row.parentNode.lastElementChild;
    totalRow.cells[totalRow.cells.length - 2].textContent = totalCalories;
}


  
function deleteRow(event) {
  const row = event.target.closest('tr'); 
  row.remove(); 
}

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
