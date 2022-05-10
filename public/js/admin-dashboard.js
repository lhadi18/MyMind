$(document).ready(async function () {

    await $.ajax({
        url: '/getAllUsersData',
        type: "GET",
        success: function (data) {
            data.forEach(userData => {
                var x = `<tr class="tableRows" id="${userData._id}">`;
                x += `<td>${userData.firstName}</td>`;
                x += `<td>${userData.lastName}</td>`
                x += `<td>${userData.username}</td>`
                x += `<td>${userData.email}</td>`
                x += `<td>${userData.phoneNum}</td>`
                x += `<td>${userData.userType.charAt(0).toUpperCase() + userData.userType.substring(1)}</td>`
                x += `<td>`
                x += `<div class="dashSettings inactive">`
                x += `<i class="bi bi-gear-fill"></i>`
                x += `<i class="bi bi-pencil-fill settingIcon editUser"></i>`
                x += `<i class="bi bi-trash-fill settingIcon deleteUser"></i>`
                x += `</div>`
                x += `</td>`
                x += `</tr>`
                $("tbody").append(x);
            });
        }
    });

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
        $('#createUserBtn').off();
        $('#createUserBtn').click(() => {
            var phoneLength = $("#phone").val();
            if (phoneLength.length != 10) {
                document.getElementById("createUserErrorMessage").innerHTML = "The phone number must be of length 10";
            } else if (!isEmail($("#email").val())) {
                document.getElementById("createUserErrorMessage").innerHTML = "Please follow this email pattern: example@email.com";
            } else if (inputValidationCreate()) {
                document.getElementById("createUserErrorMessage").innerHTML = "There are empty fields";
            } else {
                $.ajax({
                    url: '/sign-up',
                    type: 'POST',
                    data: {
                        firstname: $("#firstname").val().charAt(0).toUpperCase() + $("#firstname").val().substring(1),
                        lastname: $("#lastname").val().charAt(0).toUpperCase() + $("#lastname").val().substring(1),
                        username: $("#username").val().toLowerCase(),
                        phone: $("#phone").val(),
                        email: $("#email").val(),
                        userType: $("#userType").val(),
                        password: $("#password").val(),
                    }, success: function (data) {
                        if (data == "existingEmail") {
                            document.getElementById("createUserErrorMessage").innerHTML = "A user with that email already exists";
                        } else if (data == "existingPhone") {
                            document.getElementById("createUserErrorMessage").innerHTML = "A user with that phone number already exists";
                        } else if (data == "existingUsername") {
                            document.getElementById("createUserErrorMessage").innerHTML = "A user with that username already exists";
                        } else {
                            alert('User successfully created.')
                            location.reload();
                        }
                    }
                })
            }
        });
    }

    function inputValidationCreate() {
        const inpObjFirstName = document.getElementById("firstname");
        const inpObjLastName = document.getElementById("lastname");
        const inpObjUsername = document.getElementById("username");
        if (!inpObjFirstName.checkValidity() || !inpObjLastName.checkValidity() || !inpObjUsername.checkValidity()) {
            return true;
        }
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
                $.ajax({
                    url: '/deleteUser',
                    type: 'DELETE',
                    data: {
                        id: currentRow.id
                    },
                    success: function () {
                        alert('User successfuly deleted.')
                        currentRow.remove();
                        deleteUserModal.style.display = "none";
                        document.body.style.overflow = 'auto';
                    }
                })
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
            const currentRow = this.closest('tr');

            document.getElementById('editFirstname').value = currentRow.children[0].innerHTML;
            document.getElementById('editLastname').value = currentRow.children[1].innerHTML;
            document.getElementById('editUsername').value = currentRow.children[2].innerHTML;
            document.getElementById('editEmail').value = currentRow.children[3].innerHTML;
            document.getElementById('editPhone').value = currentRow.children[4].innerHTML;
            document.getElementById("editUserType").value = currentRow.children[5].innerHTML.toLowerCase();
            document.getElementById("editPassword").value = "";

            $('#editUserBtn').off();
            $('#editUserBtn').click(() => {
                var phoneLength = $("#editPhone").val();
                if (phoneLength.length != 10) {
                    document.getElementById("editUserErrorMessage").innerHTML = "The phone number must be of length 10";
                } else if (!isEmail($("#editEmail").val())) {
                    document.getElementById("editUserErrorMessage").innerHTML = "Please follow this email pattern: example@gmail.com";
                } else if (inputValidationEdit()) {
                    document.getElementById("editUserErrorMessage").innerHTML = "There are empty fields.";
                } else {
                    $.ajax({
                        url: '/editUser',
                        type: 'PUT',
                        data: {
                            id: currentRow.id,
                            firstname: $("#editFirstname").val().charAt(0).toUpperCase() + $("#editFirstname").val().substring(1),
                            lastname: $("#editLastname").val().charAt(0).toUpperCase() + $("#editLastname").val().substring(1),
                            username: $("#editUsername").val().toLowerCase(),
                            email: $("#editEmail").val(),
                            phone: $("#editPhone").val(),
                            userType: $("#editUserType").val(),
                            password: $("#editPassword").val()
                        },
                        success: function (data) {
                            if (data == "existingEmail") {
                                $("#editUserErrorMessage").html("A user with that email already exists");
                            } else if (data == "existingPhone") {
                                $("#editUserErrorMessage").html("A user with that phone number already exists");
                            } else if (data == "existingUsername") {
                                $("#editUserErrorMessage").html("A user with that username already exists");
                            } else if (data == "updatedWithPassword") {
                                $("#editUserErrorMessage").html("");
                                alert('User successfully updated.')
                                location.reload();
                            } else {
                                $("#editUserErrorMessage").html("");
                                alert('User successfully updated. Except password.')
                                location.reload();
                            }
                        }
                    })
                }
            });
        }
    }

    function inputValidationEdit() {
        const inpObjFirstName = document.getElementById("editFirstname");
        const inpObjLastName = document.getElementById("editLastname");
        const inpObjUsername = document.getElementById("editUsername");
        if (!inpObjFirstName.checkValidity() || !inpObjLastName.checkValidity() || !inpObjUsername.checkValidity()) {
            return true;
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

// Display therapy field options if usertype is a therapist
function showTherapyOptions(selectObject) {
    const value = selectObject.value;
    const therapyFieldOptions = document.querySelectorAll('.therapistOptions');
    if (value == 'therapist') {
        for (var i = 0; i < therapyFieldOptions.length; i++) {
            therapyFieldOptions[i].style.display = 'flex';
        }
    } else {
        for (var i = 0; i < therapyFieldOptions.length; i++) {
            therapyFieldOptions[i].style.display = 'none';
        }
    }
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

// Trigger click function for enter key for all input fields for create form
const inputCreate = document.querySelectorAll("#createUserForm .form-control");
for (var i = 0; i < inputCreate.length; i++) {
    inputCreate[i].addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("createUserBtn").click();
        }
    });
}

// Trigger click function for enter key for all input fields for create form
const inputEdit = document.querySelectorAll("#editUserForm .form-control");
for (var i = 0; i < inputEdit.length; i++) {
    inputEdit[i].addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("editUserBtn").click();
        }
    });
}