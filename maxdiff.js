const prompt = require('prompt-sync')({ sigint: true });
var v, b, r;
var k = [6, 5, 4, 3];
var m = 0;
var verbose = false;
var moreCombinationsAvailable = true;
var moreSetsAvailable = true;
var solutionFound = false;
var options = [];
var optionSet = [];
var currentCycleSet = [];
var currentCycleOccurrences = [];
var currentOptionCombinations = [];
var currentOptionOccurrences = [];
var cycleSlots = [];
var slot1 = 0,
    slot2 = 1,
    slot3 = 2;



// Start of Loop
console.log("MaxDiff EOD Runner (v.3.0)");

/*
/       TABLE OF CONTENTS
/
/       -- Variables used --
/       Note: Objects denoted in [] Brackets will be generated automatically.
/
/        v  - Number of Elements (Questions) used - the "X"
/       [b] - Number of Blocks
/       [r] - Number of Blocks containing a given point
/        k  - Number of Points (Questions) in a block - this should default to 3!!
/       [m] - Number of Blocks containing any 2 (or more generally t) distinct points (questions)
/
/
/       -- General Statements --
/       
/       1. v, k and m determine the values of b and r.
/       2. Not all combinations of v, k and m will lead to results.
/       3. bk = vr
        4. m(v-1) = r(k-1)
/
*/


// First, get all relevant params from the user.
v = Number(prompt('Please enter the number of options (v): '));
// k = Number(prompt('Please enter the number of questions in a block (k) [You should use 3 here as a reference point]: '));
if (!verbose) console.log("Calculating. If you want to see more details, set [verbose] to true.\n");

for (let i = 0; i < k.length; i++) {
    m = 0;
    r = 0;
    b = 0;

    if (verbose) console.log("Checking for the first dependency that is: " + v + " * r = " + k[i] + " * b");
    if (verbose) console.log("Checking for the second dependency that is: " + (k[i] - 1) + " * r = " + (v - 1) + " * m");

    do {
        do {
            m++;
            if (verbose) console.log("\nSuppose m is " + m + ".");
            if (verbose) console.log("Checking for the second dependency again: " + (k[i] - 1) + " * r = " + (v - 1) * m);
            if (verbose) console.log("Reformulating for the second dependency : r = " + ((v - 1) * m) / (k[i] - 1));
            r = ((v - 1) * m) / (k[i] - 1);
        } while (r % 1 !== 0);

        if (verbose) console.log("\nUsing r = " + r + " to determine values for b, r");
        if (verbose) console.log("Checking for the first dependency again : " + k[i] + " * b = " + v * r);
        b = (v * r) / k[i];
        if (verbose) console.log("Reformulating for the first dependency  : b = " + (v * r) / k[i]);
    } while (b % 1 !== 0);


    console.log(v + " options combined in pairs of " + k[i] + " will need " + b + " blocks. Each item will be present in " + r + " blocks, with each combination of two different options occurring exactly " + m + " times.");

}


// Next, ask the user if they want to continue (for now, only calculate for sets of 3)
prompt("\nEnter if you would like to continue solving for sets of 3.");


options = setOptions(v);
currentOptionCombinations = getAllPossibleOptionCombinations();

console.log("\nCalculating.");
console.log("Options: " + JSON.stringify(options) + " (" + v + " options)");
console.log("Total possible combinations: " + getNumberOfPossibleCombinations(v, k[3]) + "\n\n");
console.log("All Option Combinations: " + JSON.stringify(currentOptionCombinations) + "(" + currentOptionCombinations.length + " combinations)");

// Next, create a set of all possible combinations given the above attributes (like in secondAttempt.js, but all at the same time)

do {
    cycleThrough();
} while (moreCombinationsAvailable);

console.log("Final Set              : " + JSON.stringify(optionSet) + "(" + optionSet.length + " combinations)");

// Next, cycle through all possible combinations of array combinations with exactly b blocks and check for balance and orthogonality

console.log("\n[DEBUG] There are " + optionSet.length + " sets available. We need " + b + " of them that satisfy the conditions of BALANCE and ORTHOGONALITY.");
console.log("There are " + getNumberOfPossibleCombinations(optionSet.length, b) + " combinations to cycle through. As a rough guide, this could take approximately up to " + (getNumberOfPossibleCombinations(optionSet.length, b) / 2500 / 60).toFixed(1) + " minutes (or " + (getNumberOfPossibleCombinations(optionSet.length, b) / 2500 / 60 / 60).toFixed(1) + " hours).");
let prompter = prompt("Approve? (y - yes | v - yes, show combinations tried | any other input - cancel) > ");
let showCombinationsTried = false;
switch (prompter) {
    case "y":
        break;
    case "v":
        showCombinationsTried = true;
        break;
    default:
        process.exit();
}

// Initialize Cycle Slots (as many as there are needed)
for (let z = 0; z < b; z++) {
    cycleSlots.push(z);
}
if (verbose) console.log(JSON.stringify(cycleSlots));

//Then fall into a loop (checking loop) - build currentCycleSets based on the next combination, update the combination slots, check the currentCycleSet against BALANCE and ORTH check.
// MAIN CYCLE

do {
    createNextCurrentCycleSet();
    balanced = checkForBalance();
    if (!balanced) { continue; }
    orthogonal = checkForOrthogonality();
    if (!orthogonal) { continue; }
    // prompt("[DEBUG] Continue?");

} while (!solutionFound && moreSetsAvailable);

if (!solutionFound) console.log("The program has cycled through all possible combinations but could not find a valid solution.")
else {
    console.log();
    console.log("---------- S O L U T I O N   F O U N D ----------");
    console.log(JSON.stringify(currentCycleSet));
    console.log("-------------------------------------------------");
};


function createNextCurrentCycleSet() {
    currentCycleSet = [];
    currentCycleOccurrences = [];

    for (let c = 0; c < b; c++) {
        if (verbose) console.log("Next slot value is " + cycleSlots[c] + ", so add " + optionSet[cycleSlots[c]] + " to the set.");
        currentCycleSet.push(optionSet[cycleSlots[c]]);
    }

    if (showCombinationsTried) console.log(JSON.stringify(currentCycleSet));



    // Update the slots - this is by far the hardest ive ever done in JS so far
    for (let p = 0; p < cycleSlots.length; p++) {
        if (cycleSlots[p] == optionSet.length - (cycleSlots.length - p)) {
            if (cycleSlots[p] == cycleSlots[0]) {
                // We reached the end!
                moreSetsAvailable = false;
                break;
            }
            cycleSlots[p - 1]++;
            let aheadOfPMinus = 0;
            for (let q = p; q < cycleSlots.length; q++) {
                aheadOfPMinus++;
                cycleSlots[q] = cycleSlots[p - 1] + aheadOfPMinus;
            }
            if (verbose) console.log("New Slot Status: " + JSON.stringify(cycleSlots));

            // Skip the rest because the new values already have been adjusted
            break;
        } else if (p == cycleSlots.length - 1) {
            cycleSlots[p]++;
            if (verbose) console.log("New Slot Status: " + JSON.stringify(cycleSlots));
        }
    }
}

function cycleThrough() {
    moreCombinationsAvailable = true;

    var newCycleItem = [options[slot1], options[slot2], options[slot3]];
    optionSet.push(newCycleItem);

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
                moreCombinationsAvailable = false;
            }
        }
    }
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
        if (verbose) console.log("Balance check PASSED!");
        return true;
    } else {
        if (verbose) console.log("Balance Check FAILED.");
        return false;
    }

}

function checkForOrthogonality() {

    currentOptionOccurrences = [];

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
    let allTheSame = currentOptionOccurrences.every((val, i, arr) => val === arr[0]);

    if (allTheSame) {
        if (verbose) console.log("Orthogonality check PASSED!");
        solutionFound = true;
        return true;
    } else {
        if (verbose) console.log("Orthogonality check FAILED.");
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


function getNumberOfPossibleCombinations(n, intk) {
    if (2 * intk > n) { k = n - intk }
    var ergebnis = 1;
    for (let i = 1; i <= intk; i++) {
        ergebnis *= (n + 1 - i) / i
    }
    return ergebnis.toFixed(0);
}

function setOptions(numberOfOptions) {
    for (i = 1; i <= numberOfOptions; i++) {
        options.push(i);

    }
    return options;
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