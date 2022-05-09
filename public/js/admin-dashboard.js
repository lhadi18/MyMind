$(document).ready(function () {
    // Set the caret icons faced down by default
    document.getElementById('0').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('1').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('2').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('3').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('4').setAttribute("class", "bi bi-caret-down-fill");

    // Call sort table fucntion when user clicks table headings
    sortTable();

    // Variables for Create and Delete User Modal 
    var createUserModal = document.getElementById("createUserModal");
    var editUserModal = document.getElementById("editUserModal");
    var deleteUserModal = document.getElementById("deleteUserModal");

    // If create button is clicked, display modal (form)
    document.getElementById('createUser').onclick = function () {
        createUserModal.style.display = "block";
        document.body.style.overflow = 'hidden';
    }

    // Get all classnames to check which row was clicked to delete user
    const deleteUserBtns = document.querySelectorAll('.deleteUser');

    // Loop through each delete icon and set function to display modal
    for (var i = 0; i < deleteUserBtns.length; i++) {
        deleteUserBtns[i].onclick = function (e) {
            deleteUserModal.style.display = "block";
            document.body.style.overflow = 'hidden';

            // Store the closes table row that was clicked
            const currentRow = this.closest('tr');

            // Display username for the user's table row that was clicked
            document.getElementById('deleteUsername').innerHTML = "@" + this.closest('tr').children[2].innerHTML;
            document.getElementById('deleteUserBtn').onclick = function () {
                // Remove row and hide modal
                currentRow.remove();
                deleteUserModal.style.display = "none";
                document.body.style.overflow = 'auto';
            }
        }
    }

    // Get all classnames to check which row was clicked to delete user
    const editUserBtns = document.querySelectorAll('.editUser');

    // Loop through each delete icon and set function to display modal
    for (var i = 0; i < editUserBtns.length; i++) {
        editUserBtns[i].onclick = function (e) {
            editUserModal.style.display = "block";
            document.body.style.overflow = 'hidden';

            document.getElementById('editFirstname').value = this.closest('tr').children[0].innerHTML;
            document.getElementById('editLastname').value = this.closest('tr').children[1].innerHTML;
            document.getElementById('editUsername').value = this.closest('tr').children[2].innerHTML;
            document.getElementById('editEmail').value = this.closest('tr').children[3].innerHTML;
            document.getElementById('editPhone').value = this.closest('tr').children[4].innerHTML;
            document.getElementById("editUserType").value = this.closest('tr').children[5].innerHTML.toLowerCase();
        }
    }

    // If close icon is clicked, hide modal for Create User
    document.getElementById("closeCreate").onclick = function () {
        createUserModal.style.display = "none";
        document.body.style.overflow = 'auto';
    }

    // If close icon is clicked, hide modal for Edit User
    document.getElementById("closeEdit").onclick = function () {
        editUserModal.style.display = "none";
        document.body.style.overflow = 'auto';
    }

    // If cancel button is clicked, hide modal for Delete User
    document.getElementById("closeDelete").onclick = function () {
        deleteUserModal.style.display = "none";
        document.body.style.overflow = 'auto';
    }

    // If user clicks outside of the modal for both Create and Delete then hide modal
    window.onclick = function (event) {
        if (event.target == createUserModal) {
            createUserModal.style.display = "none";
            document.body.style.overflow = 'auto';
        } else if (event.target == editUserModal) {
            editUserModal.style.display = "none";
            document.body.style.overflow = 'auto';
        } else if (event.target == deleteUserModal) {
            deleteUserModal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }

    // Get all settings icons from each row and iterate in a loop to check which one was clicked
    const dashSet = document.querySelectorAll('.dashSettings');
    for (const set of dashSet) {
        set.onclick = function () {
            if (this.classList.contains('active') || this.classList.contains('inactive')) {

                // Set the dashsettings icons as active and toggable
                this.firstElementChild.classList.toggle('active');
                if (this.children[1].classList.contains('active')
                    || this.children[1].classList.contains('inactive')
                    || this.children[2].classList.contains('active')
                    || this.children[2].classList.contains('inactive')) {
                    this.children[1].classList.toggle('active');
                    this.children[1].classList.toggle('inactive');
                    this.children[2].classList.toggle('active');
                    this.children[2].classList.toggle('inactive');
                }
                else {
                    this.children[1].classList.add('active');
                    this.children[2].classList.add('active');
                }
            }
        };
    }
});

// Live search function for table search 
function searchTable() {
    const searchInput = document.getElementById("searchbar").value.toUpperCase();
    const table = document.getElementById("dashboardTable");
    const trs = table.tBodies[0].getElementsByTagName("tr");

    // Loop through tbody's rows
    for (var i = 0; i < trs.length; i++) {
        var tds = trs[i].getElementsByTagName("td");
        trs[i].style.display = "none";

        // loop through row cells to check each element
        for (var j = 0; j < tds.length; j++) {
            // check if there's a match in the table
            if (tds[j].innerHTML.toUpperCase().indexOf(searchInput) > -1) {
                trs[i].style.display = "";
                continue;
            }
        }
    }
}

// Sort table function when table headings is clicked
function sortTable() {
    const table = document.getElementById('dashboardTable');
    const headers = table.querySelectorAll('.tHead');
    const directions = Array.from(headers).map(function (header) {
        return '';
    });

    const transform = function (index, content) {
        const type = headers[index].getAttribute('data-type');
        switch (type) {
            case 'number':
                return parseFloat(content);
            case 'string':
            default:
                return content;
        }
    };

    const tableBody = table.querySelector('tbody');
    const rows = tableBody.querySelectorAll('tr');

    const sortColumn = function (index) {
        const direction = directions[index] || 'asc';
        const multiplier = direction === 'asc' ? 1 : -1;
        const newRows = Array.from(rows);

        newRows.sort(function (rowA, rowB) {
            const cellA = rowA.querySelectorAll('td')[index].innerHTML;
            const cellB = rowB.querySelectorAll('td')[index].innerHTML;

            const a = transform(index, cellA);
            const b = transform(index, cellB);

            switch (true) {
                case a > b:
                    return 1 * multiplier;
                case a < b:
                    return -1 * multiplier;
                case a === b:
                    return 0;
            }
        });

        [].forEach.call(rows, function (row) {
            tableBody.removeChild(row);
        });

        if (direction === 'asc') {
            directions[index] = 'desc';
            document.getElementById(index).setAttribute("class", "bi bi-caret-down-fill");

        } else {
            directions[index] = 'asc';
            document.getElementById(index).setAttribute("class", "bi bi-caret-up-fill");
        }

        newRows.forEach(function (newRow) {
            tableBody.appendChild(newRow);
        });
    };

    [].forEach.call(headers, function (header, index) {
        header.addEventListener('click', function () {
            sortColumn(index);
        });
    });
}
