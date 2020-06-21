function sortByPosition(a,b,rounds) {
    return rounds[a].position - rounds[b].position;
}

export function getSortedRoundNames(rounds) {
    return Object.keys(rounds).sort((a,b) => sortByPosition(a,b,rounds))
}