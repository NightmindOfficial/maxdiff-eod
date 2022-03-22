var verbose = true;
var numberOfOptions = 7;
var options = [];
var cycle = 0;
var solutionFound = false;
var newCycleItem = [];
var newOptionItem = [];
var currentCycleSet = [];
var currentCycleOccurrences = [];
var currentOptionOccurrences = [];
var currentOptionCombinations = [];
var slot1 = 0,
    slot2 = 1,
    slot3 = 2;
var moreCombinationsAvailable;

console.log(verbose ? "MaxDiff DOE Runner v2.0 (Verbose Mode)\n" : "MaxDiff DOE Runner v2.0 (Silent Mode)\n");
options = setOptions(numberOfOptions);
numberOfPossibleCombinations = getNumberOfPossibleCombinations(numberOfOptions, 3);
currentOptionCombinations = getAllPossibleOptionCombinations();

function setOptions(numberOfOptions) {
    for (i = 1; i <= numberOfOptions; i++) {
        options.push(i);

    }
    return options;
}

function getNumberOfPossibleCombinations(n, k) {
    if (2 * k > n) { k = n - k }
    var ergebnis = 1;
    for (let i = 1; i <= k; i++) {
        ergebnis *= (n + 1 - i) / i
    }
    return ergebnis;
}

function getAllPossibleOptionCombinations() {
    var moreOptionCombinationsAvailable = true;

    do {
        newOptionItem = [options[slot1], options[slot2]];
        currentOptionCombinations.push(newOptionItem);
        // console.log("DONE: " + JSON.stringify(currentOptionCombinations));

        if (slot2 != options.length - 1) {
            slot2++;
        } else {
            if (slot1 != options.length - 2) {
                slot1++;
                slot2 = slot1 + 1;
            } else {
                moreOptionCombinationsAvailable = false;
            }
        }
    } while (moreOptionCombinationsAvailable);

    slot1 = 0;
    slot2 = 1;

    return currentOptionCombinations;
}

console.log("Options: " + JSON.stringify(options) + " (" + numberOfOptions + " options)");
console.log("Number of Cycles possible: " + numberOfPossibleCombinations);
if (verbose) console.log("Possible Pairs: " + JSON.stringify(currentOptionCombinations));
console.log("-Trying to solve combinations now.");

// MAIN CYCLE
do {
    // sleep(1000);
    cycleThrough();
    // sleep(1000);
    var balanced = checkForBalance();
    if (!balanced) { continue; }
    // sleep(1000);

    var orthogonal = checkForOrthogonality();
    if (!orthogonal) { continue; }
    // sleep(1000);

} while (!solutionFound && moreCombinationsAvailable);

// RESULTS
if (!solutionFound && !moreCombinationsAvailable) {
    console.log("\n\n\n\nFinished. Could not create a suitable EOD for given parameters. Try again");
}

if (solutionFound) {
    console.log("\n\n\n----- SOLUTION FOUND! -----");
    console.log(JSON.stringify(currentCycleSet));
    console.log("---------------------------");
}


function cycleThrough() {
    moreCombinationsAvailable = true;
    cycle++;
    if (verbose) console.log("\n--- CYCLE " + cycle + " ---");
    currentCycleOccurrences = [];
    currentOptionOccurrences = [];

    newCycleItem = [options[slot1], options[slot2], options[slot3]];
    currentCycleSet.push(newCycleItem);

    if (slot3 != options.length - 1) {
        slot3++;
    } else {
        if (slot2 != options.length - 2) {
            slot2++;
            slot3 = slot2 + 1;
        } else {
            if (slot1 != options.length - 3) {
                slot1++;
                slot2 = slot1 + 1;
                slot3 = slot2 + 1;
            } else {
                console.log("[CAUTION] This set is using the highest number of combinations possible.");
                moreCombinationsAvailable = false;
            }
        }
    }
    if (verbose) console.log("Added next lowest combination " + JSON.stringify(newCycleItem) + " to the set.");
    if (verbose) console.log("Current Set: " + JSON.stringify(currentCycleSet));
    if (verbose) console.log("\n--- BALANCE CHECK ---");
    return moreCombinationsAvailable;
}

function checkForBalance() {
    /* Check if all numbers are present equally often */
    for (var o = 0; o <= options.length - 1; o++) {
        countOccurrence(currentCycleSet, options[o]);
    }
    if (verbose) console.log("Balance Check finished. Results: " + JSON.stringify(currentCycleOccurrences));
    let allTheSame = currentCycleOccurrences.every((val, i, arr) => val === arr[0]);

    if (allTheSame) {
        console.log("Cycle Set created after " + cycle + " attempts. Result: " + JSON.stringify(currentCycleSet));
        console.log("Balance check PASSED!");
        if (verbose) console.log("\n--- ORTHOGONALITY CHECK ---");

        return true;
    } else {
        if (verbose) console.log("Balance Check FAILED. Starting new cycle (No. " + (cycle + 1) + ").");
        return false;
    }

}

function checkForOrthogonality() {

    for (let i = 0; i < currentOptionCombinations.length; i++) {
        // console.log("ORTH: Checking for set " + JSON.stringify(currentOptionCombinations[i]) + " now.");
        let subArray = currentOptionCombinations[i];
        var currentOccurrence = 0;

        for (let j = 0; j < currentCycleSet.length; j++) {
            let currentOccurrence1 = countOptionOccurrence(currentCycleSet[j], subArray[0]);
            let currentOccurrence2 = countOptionOccurrence(currentCycleSet[j], subArray[1]);
            if (currentOccurrence1 == currentOccurrence2) { currentOccurrence++; }
        }

        // console.log("Result: " + currentOptionCombinations[i] + " found " + currentOccurrence + " matches.");
        currentOptionOccurrences.push(currentOccurrence);
    }

    if (verbose) console.log("Orthogonality Check finished. Results: " + JSON.stringify(currentOptionOccurrences));
    let allTheSame = currentCycleOccurrences.every((val, i, arr) => val === arr[0]);

    if (allTheSame) {
        console.log("Orthogonality check PASSED!");
        solutionFound = true;
        return true;
    } else {
        if (verbose) console.log("Orthogonality check FAILED. Starting new cycle (No. " + (cycle + 1) + ").");
        return false;
    }
}

function countOccurrence(arr, val) {
    let newArr = arr.flat();
    var number = newArr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    // console.log("Option '" + val + "' found " + number + " times");
    currentCycleOccurrences.push(number);
}

function countOptionOccurrence(arr, val) {
    let newArr = arr.flat();
    var number = newArr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    return number;
}


// For debug purposes
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}