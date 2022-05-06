$(document).ready(function () {
    document.getElementById('0').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('1').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('2').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('3').setAttribute("class", "bi bi-caret-down-fill");
    document.getElementById('4').setAttribute("class", "bi bi-caret-down-fill");

    var modal = document.getElementById("createUserModal");

    document.getElementById('createUser').onclick = function () {
        modal.style.display = "block";
        document.body.style.overflow = 'hidden';
    }

    document.getElementById("close").onclick = function () {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    }

    const dashSet = document.querySelectorAll('.dashSettings');

    for (const set of dashSet) {
        set.onclick = function () {
            if (this.classList.contains('active') || this.classList.contains('inactive')) {
                this.classList.toggle('active');
                this.classList.toggle('inactive');
                this.firstElementChild.classList.toggle('active');

                if (this.children[1].classList.contains('active')
                    || this.children[1].classList.contains('inactive')
                    || this.children[2].classList.contains('active')
                    || this.children[2].classList.contains('inactive'))  {
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
            else {
                this.classList.add('inactive');
            }
        };
    }
});

function searchTable() {
    var input = document.getElementById("myInput").value.toUpperCase();
    var table = document.getElementById("myTable");
    var tr = table.getElementsByTagName("tr");

    for (var i = 0; i < tr.length; i++) {
        var td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            var txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(input) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}

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

