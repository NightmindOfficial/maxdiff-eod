const prompt = require('prompt-sync')({ sigint: true });
var v, b, r;
var k = [3, 4, 5, 6];
var m = 0;
var verbose = false;
var options = [];
var optionSet = [];
var numberOfPossibleCombinations;



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
if (!verbose) console.log("Calculating. If you want to see more details, set [verbose] to true.");

for (let i = 0; i < k.length - 1; i++) {

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


    console.log("\nSolution: With " + v + " options combined in pairs of " + k[i] + ", we will need " + b + " question blocks. Each item will be represented in " + r + " blocks, with each combination of two different options occurring exactly " + m + " times.");

}


// Next, ask the user if they want to continue (for now, only calculate for sets of 3)
prompt("\nEnter if you would like to continue solving for sets of 3.");


options = setOptions(v);
console.log("\nCalculating.");
console.log("Options: " + JSON.stringify(options) + " (" + v + " options)");
console.log("Total possible combinations: " + getNumberOfPossibleCombinations(v, k[0]) + "\n\n");

// Next, create a set of all possible combinations given the above attributes (like in secondAttempt.js, but all at the same time)






function getNumberOfPossibleCombinations(n, intk) {
    if (2 * intk > n) { k = n - intk }
    var ergebnis = 1;
    for (let i = 1; i <= intk; i++) {
        ergebnis *= (n + 1 - i) / i
    }
    return ergebnis;
}

function setOptions(numberOfOptions) {
    for (i = 1; i <= numberOfOptions; i++) {
        options.push(i);

    }
    return options;
}