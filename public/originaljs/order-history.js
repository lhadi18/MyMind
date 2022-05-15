$(document).ready(async function () {

    await $.ajax({
        url: '/getPreviousPurchases',
        type: "GET",
        success: function (data) {
            data.forEach(cartData => {
                getTherapist(cartData.therapist, therapistInfo => {
                    let multiplier;
                    var x = `<tr class="tableRows">`;
                    x += `<td>${new Date(cartData.purchased).toISOString().substring(0, 10)}</td>`;

                    x += `<td>${therapistInfo.fullName}</td>`


                    if (cartData.timeLength == 'freePlan') {
                        x += `<td>Trial</td>`
                        multiplier = 0;
                    } else if (cartData.timeLength == 'monthPlan') {
                        x += `<td>1 Month</td>`
                        multiplier = 1;
                    } else if (cartData.timeLength == 'threeMonthPlan') {
                        x += `<td>3 Months</td>`
                        multiplier = 3;
                    } else {
                        x += `<td>1 Year</td>`
                        multiplier = 12;
                    }

                    x += `<td>$${parseFloat(therapistInfo.sessionCost * multiplier *  1.12).toFixed(2)}</td>`

                    if (new Date(cartData.expiringTime) > new Date()) {
                        x += `<td>Active</td>`
                    } else {
                        x += `<td>Expired</td>`
                    }

                    x += `<td>${cartData.orderId}</td>`
                    x += `</tr>`
                    $("tbody").append(x);
                })

            });
        }
    });

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

function getTherapist(therapistId, callback) {
    let therapistInfo;
    $.ajax({
        url: '/getTherapistInfo',
        method: "POST",
        data: {
            therapistId: therapistId
        },
        success: function (therapist) {
            therapistInfo = {
                fullName: `${therapist.firstName} ${therapist.lastName}`,
                sessionCost: therapist.sessionCost
            }
            callback(therapistInfo)
        }
    })
}

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
        });
    });
}