const sections = {
     "Produce": [650, 400],
    "Meat": [350, 400],
    "Frozen Foods": [700,300],
    "Bakery": [500, 350],
    "Canned Goods": [330,500 ],
    "Dry Goods": [700,580 ],
    "Health & Beauty": [650, 220],
    "Electronics": [450, 590],
    "Household": [520, 490],
    "Clothing": [350, 250],
    "Checkout": [300,590]
};

const neighbors = {
    "Produce": ["Frozen Foods"],
    "Meat": ["Frozen Foods"],
    "Frozen Foods": ["Produce", "Meat", "Checkout"],
    "Bakery": ["Canned Goods"],
    "Canned Goods": ["Bakery", "Dry Goods"],
    "Dry Goods": ["Canned Goods", "Health & Beauty"],
    "Health & Beauty": ["Dry Goods", "Electronics", "Clothing"],
    "Electronics": ["Health & Beauty", "Household"],
    "Household": ["Electronics", "Clothing"],
    "Clothing": ["Health & Beauty", "Household", "Checkout"],
    "Checkout": ["Frozen Foods", "Clothing"]
};

const svg = d3.select("#map").append("svg")
    .attr("width", 500)
    .attr("height", 400);

for (const [section, [x, y]] of Object.entries(sections)) {
    svg.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("class", "section")
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle")
        .text(section);
}

function calculateCost(currentSection, nextSection) {
    return 1;
}

function heuristic(goal, nextSection) {
    const [x1, y1] = sections[goal];
    const [x2, y2] = sections[nextSection];
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

function astar(start, goal) {
    const frontier = [[0, start]];
    const cameFrom = {};
    const costSoFar = {};
    cameFrom[start] = null;
    costSoFar[start] = 0;

    while (frontier.length > 0) {
        frontier.sort((a, b) => a[0] - b[0]);
        const [currentCost, currentSection] = frontier.shift();

        if (currentSection === goal) {
            break;
        }

        for (const nextSection of neighbors[currentSection]) {
            const newCost = costSoFar[currentSection] + calculateCost(currentSection, nextSection);
            if (!(nextSection in costSoFar) || newCost < costSoFar[nextSection]) {
                costSoFar[nextSection] = newCost;
                const priority = newCost + heuristic(goal, nextSection);
                frontier.push([priority, nextSection]);
                cameFrom[nextSection] = currentSection;
            }
        }
    }

    const path = [];
    let currentSection = goal;
    while (currentSection !== start) {
        path.push(currentSection);
        currentSection = cameFrom[currentSection];
    }
    path.push(start);
    return path.reverse();
}

function drawPath(path, color) {
    for (let i = 0; i < path.length - 1; i++) {
        const startPos = sections[path[i]];
        const endPos = sections[path[i + 1]];
        svg.append("line")
            .attr("x1", startPos[0])
            .attr("y1", startPos[1])
            .attr("x2", endPos[0])
            .attr("y2", endPos[1])
            .attr("class", "path")
            .attr("stroke", color)
            .attr("fill", "none");
    }
}

document.getElementById("find-route").addEventListener("click", () => {
    const start = document.getElementById("start").value;
    const goal = document.getElementById("goal").value;
    svg.selectAll(".path").remove();
    const astarPath = astar(start, goal);
    drawPath(astarPath, "red");
});
