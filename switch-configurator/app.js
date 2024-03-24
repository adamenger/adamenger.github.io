function addKeyValuePair() {
    const keyValuePairs = document.getElementById("keyValuePairs");
    const div = document.createElement("div");
    div.innerHTML = '<input class="input is-primary" type="text" placeholder="Key">';
    keyValuePairs.appendChild(div);
}

function generateTable() {
    const portCount = document.getElementById("portCount").value;
    const keyValuePairs = document.querySelectorAll("#keyValuePairs div");
    const tableContainer = document.getElementById("tableContainer");

    let tableHtml = "<table border='1'><tr>";

    // Add interface header
    tableHtml += "<th class='p-2'>Interface</th>";

    // add custom Headers
    for (const pair of keyValuePairs) {
        const inputs = pair.querySelectorAll("input");
        tableHtml += `<th class='p-2'>${inputs[0].value}</th>`;
    }
    tableHtml += "<th class='p-2'>Config</th></tr>";

    // Rows
    for (let i = 0; i < portCount; i++) {
        tableHtml += "<tr>";
        tableHtml += `<td class="p-2"><input class='input' type='text' value='int gi 1/0/${i+1}'></td>`;
        for (const pair of keyValuePairs) {
            tableHtml += `<td class="p-2"><input class='input' type='text' placeholder='${pair.querySelector("input").value}'></td>`;
        }

        // Add button for each row to render template
        tableHtml += `<td class="p-2"><button class="button is-primary" onclick="renderRowTemplate(this)">Render</button></td>`;
        tableHtml += "</tr>";
    }

    tableHtml += "</table>";
    tableContainer.innerHTML = tableHtml;
}

function renderRowTemplate(button) {
    const row = button.parentNode.parentNode;
    const templateText = document.getElementById("template").value;
    const template = Handlebars.compile(templateText);

    let portData = {};
    const cells = row.querySelectorAll("td");
    cells.forEach((cell, index) => {
        if (index < cells.length - 1) { // Skip the last cell which contains the button
            let key = row.parentNode.rows[0].cells[index].textContent;
            let value = cell.querySelector("input").value;
            portData[key] = value;
        }
    });

    const renderedText = template(portData);
    copyToClipboard(renderedText);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    alert("Copied to clipboard");
}
