let currentProcess = 0;
let numProcesses;
let numResources;

function initializeForm() {
    numProcesses = document.getElementById('numProcesses').value;
    numResources = document.getElementById('numResources').value;
    currentProcess = 0;
    const inputFields = document.getElementById('inputFields');
    inputFields.innerHTML = '';
    document.getElementById('inputForm').style.display = 'block';
    document.getElementById('navigationButtons').style.display = 'flex';
    document.getElementById('prevButton').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
    document.getElementById('submitButton').style.display = 'none';

    for (let i = 0; i < numProcesses; i++) {
        inputFields.innerHTML += `<div class="process-fields" id="process${i}" style="display: none;">
                                    <h3>Process ${i}</h3>
                                    <div class="input-group"><label for="max${i}">Max:</label><input type="text" id="max${i}" placeholder="e.g. 7 5 3"></div>
                                    <div class="input-group"><label for="alloc${i}">Allocation:</label><input type="text" id="alloc${i}" placeholder="e.g. 0 1 0"></div>
                                  </div>`;
    }

    showProcess(0);

    // Show the navigation buttons after form initialization
    document.getElementById('navigationButtons').style.display = 'flex';
}

function showProcess(index) {
    const processFields = document.querySelectorAll('.process-fields');
    processFields.forEach((field, i) => {
        field.style.display = i === index ? 'block' : 'none';
    });
    currentProcess = index;

    if (currentProcess === 0) {
        document.getElementById('prevButton').style.display = 'none';
    } else {
        document.getElementById('prevButton').style.display = 'inline-block';
    }

    if (currentProcess === numProcesses - 1) {
        document.getElementById('nextButton').style.display = 'none';
        document.getElementById('availableResources').style.display = 'block'; // Show available resources input
        document.getElementById('submitButton').style.display = 'inline-block'; // Show check safe state button
    } else {
        document.getElementById('nextButton').style.display = 'inline-block';
        document.getElementById('availableResources').style.display = 'none'; // Hide available resources input
        document.getElementById('submitButton').style.display = 'none'; // Hide check safe state button
    }
}

function showNextProcess() {
    if (currentProcess < numProcesses - 1) {
        showProcess(currentProcess + 1);
    }
}

function showPreviousProcess() {
    if (currentProcess > 0) {
        showProcess(currentProcess - 1);
    }
}

function parseInput(input, numResources) {
    return input.split(' ').map(Number).slice(0, numResources);
}

function checkSafeState(event) {
    event.preventDefault();

    const numProcesses = parseInt(document.getElementById('numProcesses').value);
    const numResources = parseInt(document.getElementById('numResources').value);

    let max = [], allocation = [], need = [];
    for (let i = 0; i < numProcesses; i++) {
        max.push(parseInput(document.getElementById(`max${i}`).value, numResources));
        allocation.push(parseInput(document.getElementById(`alloc${i}`).value, numResources));
    }

    const available = parseInput(document.getElementById('avail').value, numResources);

    for (let i = 0; i < numProcesses; i++) {
        need.push(max[i].map((m, j) => m - allocation[i][j]));
    }

    console.log("Max:", max);
    console.log("Allocation:", allocation);
    console.log("Need:", need);
    console.log("Available:", available);

    let f = Array(numProcesses).fill(false);
    let ans = Array(numProcesses).fill(0);
    let ind = 0;
    let work = available.slice();

    for (let k = 0; k < numProcesses; k++) {
        for (let i = 0; i < numProcesses; i++) {
            if (!f[i]) {
                let flag = true;
                for (let j = 0; j < numResources; j++) {
                    if (need[i][j] > work[j]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    for (let j = 0; j < numResources; j++) {
                        work[j] += allocation[i][j];
                    }
                    ans[ind++] = i;
                    f[i] = true;
                }
            }
        }
    }

    let flag = true;
    for (let i = 0; i < numProcesses; i++) {
        if (!f[i]) {
            flag = false;
            document.getElementById('result').innerHTML = "The given sequence is not safe";
            break;
        }
    }

    if (flag) {
        document.getElementById('result').innerHTML = "Following is the SAFE Sequence<br> " + ans.map(p => `P${p}`).join(" -> ");
    }

    console.log("Finish:", f);
    console.log("Safe sequence:", ans);
}
