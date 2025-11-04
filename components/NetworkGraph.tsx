import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { NetworkData, Node as NodeType, Link as LinkType } from '../types';

interface NetworkGraphProps {
  data: NetworkData;
}

// Fix: Explicitly add d3-force properties to the D3Node interface to resolve TypeScript errors.
interface D3Node extends NodeType, d3.SimulationNodeDatum {
  id: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}
interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  value: number;
}


const NetworkGraph: React.FC<NetworkGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const groupColors: Record<NodeType['group'], string> = {
    'Bot': '#f97316',
    'Influencer': '#ec4899',
    'Media': '#3b82f6',
    'Citizen': '#84cc16',
  };

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    const { nodes, links } = data;
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    // Clear previous render
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const d3Nodes: D3Node[] = nodes.map(n => ({...n}));
    const d3Links: D3Link[] = links.map(l => ({...l, source: l.source, target: l.target }));

    const simulation = d3.forceSimulation<D3Node>(d3Nodes)
      .force("link", d3.forceLink<D3Node, D3Link>(d3Links).id(d => d.id).distance(60))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width/2).strength(0.05))
      .force("y", d3.forceY(height/2).strength(0.05));

    const g = svg.append("g");

    const link = g.append("g")
      .attr("stroke", "#4b5563")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(d3Links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    const nodeRadiusScale = d3.scaleSqrt()
      .domain([d3.min(d3Nodes, d => d.influenceScore) || 0, d3.max(d3Nodes, d => d.influenceScore) || 100])
      .range([5, 20]);

    const node = g.append("g")
      .attr("stroke", "#1a2a3a")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(d3Nodes)
      .join("circle")
      .attr("r", d => nodeRadiusScale(d.influenceScore))
      .attr("fill", d => groupColors[d.group])
      .call(drag(simulation) as any);

    const tooltip = d3.select(containerRef.current)
      .append("div")
      .attr("class", "absolute p-2 text-sm bg-brand-primary rounded-md shadow-lg opacity-0 pointer-events-none transition-opacity")
      .style("border", "1px solid #2a3b4a");

    node.on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`
            <strong>ID:</strong> ${d.id}<br/>
            <strong>Group:</strong> ${d.group}<br/>
            <strong>Influence:</strong> ${d.influenceScore}
        `)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as D3Node).x!)
        .attr("y1", d => (d.source as D3Node).y!)
        .attr("x2", d => (d.target as D3Node).x!)
        .attr("y2", d => (d.target as D3Node).y!);
      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);
    });
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Legend
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(20,20)");

    Object.entries(groupColors).forEach(([group, color], i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);
      legendRow.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color)
        .attr("rx", 4);
      legendRow.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("text-anchor", "start")
        .style("text-transform", "capitalize")
        .style("fill", "#e0e0e0")
        .style("font-size", "12px")
        .text(group);
    });

    return () => {
      simulation.stop();
    };

  }, [data, groupColors]);

  const drag = (simulation: d3.Simulation<D3Node, undefined>) => {
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>, d: D3Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>, d: D3Node) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event: d3.D3DragEvent<SVGCircleElement, D3Node, D3Node>, d: D3Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    return d3.drag<SVGCircleElement, D3Node>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
  
  return (
    <div className="bg-brand-secondary p-4 rounded-lg shadow-lg h-[600px] relative" ref={containerRef}>
      <h3 className="text-xl font-bold text-brand-accent mb-2 absolute top-4 left-4 z-10">Narrative Spread Network</h3>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default NetworkGraph;