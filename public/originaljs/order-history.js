$(document).ready(async function () {

    // await $.ajax({
    //     url: '/getAllUsersData',
    //     type: "GET",
    //     success: function (data) {
    //         data.forEach(userData => {
    //             var x = `<tr class="tableRows" id="${userData._id}">`;
    //             x += `<td>${userData.firstName}</td>`;
    //             x += `<td>${userData.lastName}</td>`
    //             x += `<td>${userData.username}</td>`
    //             x += `<td>${userData.email}</td>`
    //             x += `<td>${userData.phoneNum}</td>`
    //             x += `<td>${userData.userType.charAt(0).toUpperCase() + userData.userType.substring(1)}</td>`
    //             x += `<td class="hiddenRow">${userData.yearsExperience}</td>`
    //             x += `<td class="hiddenRow">${userData.sessionCost}</td>`
    //             x += `<td>`
    //             x += `<div class="dashSettings inactive">`
    //             x += `<i class="bi bi-gear-fill"></i>`
    //             x += `<i class="bi bi-pencil-fill settingIcon editUser"></i>`
    //             x += `<i class="bi bi-trash-fill settingIcon deleteUser"></i>`
    //             x += `</div>`
    //             x += `</td>`
    //             x += `</tr>`
    //             $("tbody").append(x);
    //         });
    //         document.getElementById("resultsFound").innerHTML = data.length
    //     }
    // });

    // Set the caret icons faced down by default
    document.getElementById('0').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('1').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('2').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('3').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('4').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('5').setAttribute("class", "bi bi-caret-down-fill");

    // Call sort table fucntion when user clicks table headings
    sortTable();
});

// Live search function for table search 
function searchTable() {
    const searchInput = document.getElementById("searchbar").value.toUpperCase();
    const table = document.getElementById("orderTable");
    const trs = table.tBodies[0].getElementsByTagName("tr");
    let count = 0;

    // Loop through tbody's rows
    for (var i = 0; i < trs.length; i++) {
        var tds = trs[i].getElementsByTagName("td");
        trs[i].style.display = "none";

        // loop through row cells to check each element
        for (var j = 0; j < tds.length; j++) {
            // check if there's a match in the table
            if (tds[j].innerHTML.toUpperCase().indexOf(searchInput) > -1) {
                trs[i].style.display = "";
                count++;
                break;
            }
        }
    }
    $("#resultsFound").html(`${count}`);
}

// Sort table function when table headings is clicked
function sortTable() {
    const table = document.getElementById('orderTable');
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
            const cellA = rowA.querySelectorAll('td')[index].innerHTML.toLowerCase();
            const cellB = rowB.querySelectorAll('td')[index].innerHTML.toLowerCase();

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
            for (var i = 0; i < headers.length; i++) {
                if (i == index) {
                    if (directions[index] === 'asc') {
                        document.getElementById(i).parentElement.style.color = '#000';
                    } else {
                        document.getElementById(i).parentElement.style.color = '#09C5A3';
                    }
                } else {
                    document.getElementById(i).parentElement.style.color = '#000';
                }
            }
        });
    });
}