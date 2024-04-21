
// Specify the dimensions of the chart.
const width = 928;
const height = 600;

// Specify the color scale.
const color = d3.scaleOrdinal(d3.schemeCategory10);
const data = {
    nodes: [
        { id: "Harish", group: 1 },
        { id: "Rahul", group: 1 }
    ],
    links: [{ source: "Harish", target: "Rahul", value: 20 }]
}

drawChart();

function drawChart() {
    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = data.links.map(d => ({ ...d }));
    const nodes = data.nodes.map(d => ({ ...d }));

    // Create a simulation with several forces.
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).distance(120).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-70))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Add a line for each link, and a circle for each node.
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(nodes)
        .join("circle")
        .attr("r", 15)
        .attr("fill", d => color(d.group));

    const label = svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .text(d => d.id)
        .attr("stroke-width", "0")
        .style("text-anchor", "middle")
        .style("font-family", "Arial")
        .style("font-size", 17)
        .style("fill", "#2B3035")
    // .style("font-weight", d => d.isRoot ? "bold" : "normal");

    node.append("title")
        .text(d => d.id);

    // Add a drag behavior.
    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Set the position attributes of links and nodes each time the simulation ticks.
    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y + 30);
    }

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    // When this cell is re-run, stop the previous simulation. (This doesn’t
    // really matter since the target alpha is zero and the simulation will
    // stop naturally, but it’s a good practice.)
    // invalidation.then(() => simulation.stop());

    container.innerHTML = "";
    container.append(svg.node());
}

var ijk = 0;
function addNewNode() {
    // ijk += 1;
    // data.nodes.push({ id: ijk.toString(), group: ijk });
    // data.links.push({ source: ijk.toString(), target: "Harish", value: 4 })

    const nodeName = document.getElementById("new-node-name");
    const linkTo = document.getElementById("link-node-to");
    data.nodes.push({ id: nodeName.value });
    linkTo.value && data.links.push({ source: nodeName.value, target: linkTo.value, value: 4 })
    drawChart();
    linkTo.innerHTML += `<option>${nodeName.value}</option>`
    document.getElementById("new-node-name").value = "";
    document.getElementById("link-node-to").value = "";
}

