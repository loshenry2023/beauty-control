export default function divideArray(arr, divisionSize) {
    let divisions = [];
    let numDivisions = Math.ceil(arr.length / divisionSize);
    let remainingElements = arr.length;
    
    for (let i = 0; i < numDivisions; i++) {
        let currentDivisionSize = Math.min(divisionSize, remainingElements);
        let division = arr.slice(i * divisionSize, i * divisionSize + currentDivisionSize);
        divisions.push(division);
        remainingElements -= currentDivisionSize;
    }

    console.log(divisions);
    return divisions;
}