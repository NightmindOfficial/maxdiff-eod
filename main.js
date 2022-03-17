console.log("MaxDiff EOD Runner v1.0");
var verbose = false;
var numberOfOptions = 15;
var options = [];
var cycle = 0;
var solutionFound = false;
var newCycleItem = [];
var currentCycleSet = [];
var currentCycleOccurrences = [];

options = setOptions(numberOfOptions);

function setOptions(numberOfOptions) {
    for (i = 1; i <= numberOfOptions; i++) {
        options.push(i);

    }
    return options;
}

console.log("Options: " + JSON.stringify(options) + " (" + numberOfOptions + " options) \n-Trying to solve combinations now.");
do {
    cycleThrough();
    var balanced = checkForBalance();
    if (!balanced) { continue; }
    var orthogonal = checkForOrthogonality();
} while (!solutionFound);


function cycleThrough() {
    cycle++;
    if (verbose) console.log("\n--- CYCLE " + cycle + " ---");
    currentCycleSet = [];
    currentCycleOccurrences = [];
    do {
        // sleep(500);
        createNewCandidate();
    } while (checkIfNumbersAreStillMissing());
    if (verbose) console.log("All Candidates found! Proceeding with next step, checking for BALANCE.");
}

function checkForBalance() {
    /* Check if all numbers are present equally often */
    for (var o = 0; o <= options.length - 1; o++) {
        countOccurrence(currentCycleSet, options[o]);
    }
    if (verbose) console.log("Balance Check finished. Results: " + JSON.stringify(currentCycleOccurrences));
    let allTheSame = currentCycleOccurrences.every((val, i, arr) => val === arr[0]);

    if (allTheSame) {
        console.log("Cycle Set created: " + JSON.stringify(currentCycleSet));
        console.log("Balance Check PASSED! Proceeding with the next step, checking for ORTHOGONALITY.");
        return true;
    } else {
        if (verbose) console.log("Balance Check FAILED. Starting new cycle (No. " + (cycle + 1) + ").\n\n\n\n");
        return false;
    }

}

function checkForOrthogonality() {
    solutionFound = true;
    console.log("Nice.");
}

function countOccurrence(arr, val) {
    let newArr = arr.flat();
    var number = newArr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    // console.log("Option '" + val + "' found " + number + " times");
    currentCycleOccurrences.push(number);
}

function checkIfNumbersAreStillMissing() {
    /* Check if all numbers are present */
    var notAllNumbersPresent = false;
    for (var o = 0; o < options.length - 1; o++) {
        // console.log("Checking if Option '" + options[o] + "' is in the set.");
        let numberIsInMaj = currentCycleSet.some(function(e) {
            let numberIsInSub = e.some(function(i) {
                // console.log("Currently checking if entry value " + i + " matches option value " + options[o]);
                return i == options[o];
            });
            return numberIsInSub;
        });
        if (!numberIsInMaj) {
            notAllNumbersPresent = true;
            if (verbose) console.log("Option '" + options[o] + "' not found in entire cycleSet. Aborting!");
            break;
        }

    }
    if (notAllNumbersPresent) {
        if (verbose) console.log("There are numbers missing in the set. We need at least one more cycleItem.");
        return true;
    }
}

function createNewCandidate() {
    do {
        if (verbose) console.log("Searching for new Candidate.");
        newCycleItem = [options[Math.floor(Math.random() * options.length)], options[Math.floor(Math.random() * options.length)], options[Math.floor(Math.random() * options.length)]];
        if (verbose) console.log(JSON.stringify(newCycleItem));
    } while ((newCycleItem[0] == newCycleItem[1] || newCycleItem[1] == newCycleItem[2] || newCycleItem[0] == newCycleItem[2]));

    currentCycleSet.push(newCycleItem);
    if (verbose) console.log("Appropriate candidate found. Adding it to the set...");
    if (verbose) console.log(JSON.stringify(currentCycleSet));
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}