import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function D3Graph({ data }) {
    const ref = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const width = 600;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        const x = d3
            .scaleLinear()
            .domain([0, data.length - 1])
            .range([margin.left, width - margin.right]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.count) || 100])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const line = d3
            .line()
            .x((_, i) => x(i))
            .y((d) => y(d.count))
            .curve(d3.curveMonotoneX);


        const defs = svg.append("defs");

        const gradient = defs
            .append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", margin.left)
            .attr("x2", width - margin.right)
            .attr("y1", 0)
            .attr("y2", 0);

        gradient
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#00bcd4"); // cyan
        gradient
            .append("stop")
            .attr("offset", "50%")
            .attr("stop-color", "#9c27b0"); // purple
        gradient
            .append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#ff4081"); // pink

        svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "url(#line-gradient)")
            .attr("stroke-width", 2.5)
            .attr("d", line)
            .attr("opacity", 0.95);
    }, [data]);

    return (
        <svg ref={ref} viewBox="0 0 600 300" style={{width: "100%", height: "300px", border: "1px solid #4b5563", borderRadius: "8px", backgroundColor: "#1c1c1f",}}></svg>
    );
}

export default D3Graph;
