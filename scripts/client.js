/** Global variables */
let employees = []; 

/** Constants */
const SALARY_THRESHOLD = 20000;
const LOCALE = 'en-US';
const USD_CURRENCY = 'USD';
const SUBTRACT = `-`;
const ADD = `+`;

$( document ).ready( onReady );

function onReady() {

    //Listen for click of 'submit' button
    $( '#submit-emp-button' ).on( 'click', submitEmp );
    //Listen for click of dynamically created 'delete' button 
    $( '#emp-table-body' ).on( 'click', '.deleteEmployeeButton', deleteEmployee );
}

/** Create the new employee and add it to the Employee table */
function submitEmp() {

    //Check if the record exists!
    let id = $( '#id' ).val();
    let idString = id.toString();

    if ( ! checkRecordExists( idString ) ) {
        //Record doesn't exist so create it and add to html table

        //1. Target input elements and get input values
        let firstName = $( '#firstName' ).val();
        let lastName = $( '#lastName' ).val();
        let title = $( '#title' ).val();
        let salary = Number($( '#salary' ).val());

        //2. Create new Employee object
        const employee = createNewEmployee( firstName, lastName, id, title, salary );
        
        //3. Add new employee to global employee array
        employees.push(employee);

        //4. Add new row to table
        addEmployeeToTable( employee );

        //5. Add data to jquery.data 
        addDataToJquery( idString, salary );
        //addDataToJquery( idString );

        //6. Calculate the monthly salary cost & update cost label on HTML page
        updateTotalMonthlyCost( );

        //7. Reset the input fields to allow another employee to be added
        resetInputFields();
        
    } else {
        alert("That ID already exists. Please enter unique ID.");
    }
}

/** 
 * Create a new employee object and add to employee array*/
function createNewEmployee( firstName, lastName, id, title, salary) {
    
    //create the employee object
    let employee = {
        firstName: firstName,
        lastName: lastName,
        id: id,
        title: title,
        salary: salary
    };

    return employee;
}

/** 
 * Add new row to employee table */
function addEmployeeToTable( employee ) {
           
    //Target the html element
    let empTable = $( '#emp-table-body');

    //Add new row to table. We also add the delete button to the employee row.
    empTable.append('<tr id="emp_row"><td>' + employee.firstName + '</td>\
                     <td>' + employee.lastName + '</td>\
                     <td id="empID">' + employee.id + '</td>\
                     <td>' + employee.title + '</td>\
                     <td id="salary">' + getLocalCurrency( employee.salary, LOCALE, USD_CURRENCY ) + '</td>\
                     <td><button type="button" class="button deleteEmployeeButton">Delete</button></td></tr>');
}

/** 
 * Transform the amount into local currency for output */
function getLocalCurrency( amount, locale, currencyType) {

    let currencyCost = amount.toLocaleString( locale, { style: 'currency', currency: currencyType });

    return currencyCost;
}

/**  
 * Delete employee from HTML table, jquery data and employees array */
function deleteEmployee ( ) {

    //We need to go up 2 levels (to grandparent) in order to the row that Delete
    //button belongs to.
    let grandparent = $( this ).parent().parent();

    //Look for child element (<td>) of this specific row that has a salary. 
    let elEmployee = grandparent.children( '#empID' );
    let employeeID = elEmployee[0].textContent;

    //remove this employee record from the array
    for (let i = 0; i < employees.length; i++ ){
        if ( employees[i].id === employeeID ) {
            employees.splice( [i], 1 );
        }
    }

    //Update monthly total cost 
    updateTotalMonthlyCost( );

    //remove record from DOM
    grandparent.remove();

    //Remove this record from ID_SALARY .data() cache
    removeDataFromJquery( employeeID );
    if ( ! checkRecordExists( employeeID ) ) {
        alert("Employee record was deleted successfully!");
    }
}

/** 
 * Loop through the employees array to calculate the monthly salary cost
 */
function updateTotalMonthlyCost( ) {

    let total_monthly_cost = 0;
    let total_yearly_cost = 0;

    //loop through the salaries in the employees array
    for ( let i = 0; i < employees.length; i ++ ) {
        total_yearly_cost += employees[i].salary;
    }

    total_monthly_cost = total_yearly_cost / 12;

    //if the monthly salary cost is > $20,000 highlight the total in red.
    if ( $( '.total-container' ).hasClass("red") ) {
        if ( total_monthly_cost < SALARY_THRESHOLD ) {
            $( '.total-container' ).toggleClass('red');
        }
    } else if ( total_monthly_cost > SALARY_THRESHOLD ) {
        $( '.total-container' ).toggleClass('red');
    }

    //target the DOM element where monthly cost will be shown
    let cost = $( '#total-cost');
    cost.empty();
    //Change the cost into local currency and add the monthly cost to the DOM element
    cost.append( getLocalCurrency( total_monthly_cost, LOCALE, USD_CURRENCY));

    return total_monthly_cost;
}

/**
 * Reset the input fields to blank after user hits 'submit' button.
 */
function resetInputFields() {

//   Get the children of the DOM container and loop through the children & set value to blank
    let children = $( ".form-container" ).children();

    for( let i = 0; i < children.length; i++ ) {
        $(children[i]).val( '' );
    }
}

/**
 * Use the id from DOM to see if this id exists in our .data() cache.
 */
function checkRecordExists( id ) {
    
    return $( "table" ).data( id ); //returns true or false
}

/**
* Add record to .data() cache. Key is id and value is salary.
 */
function addDataToJquery ( id, salary ) {

    if ( ! checkRecordExists( id ) ) {
        //Add id and salary to jQuery data cache
        $( "table" ).data( id, salary );
    } 
}

/**
 * Delete record from .data() cache. Key to remove is id field.
 */
function removeDataFromJquery ( id ) {

    $( "table" ).removeData( id );
}

/** 
 * Get salary associated to id from .data() cache.
 */
function getSalaryFromJquery( id ) {

    let salary = $( "table" ).data( id );
    return salary;
}