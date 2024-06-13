// src/Clock.js
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./Clock.css";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const drawClock = () => {
    const svg = d3
      .select("#clock-svg")
      .attr("viewBox", "0 0 400 400")
      .attr("width", "400")
      .attr("height", "400");

    // Clear previous elements
    svg.selectAll("*").remove();

    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const hourAngle = (hours + minutes / 60) * 30;
    const minuteAngle = (minutes + seconds / 60) * 6;
    const secondAngle = seconds * 6;

    // Outer circle
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 200)
      .attr("r", 195)
      .attr("stroke", "white")
      .attr("stroke-width", 10)
      .attr("fill", "black");

    // Texts
    svg
      .append("text")
      .attr("x", 200)
      .attr("y", 90)
      .attr("fill", "white")
      .attr("font-size", 24)
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .text("Omega");

    svg
      .append("text")
      .attr("x", 200)
      .attr("y", 120)
      .attr("fill", "white")
      .attr("font-size", 16)
      .attr("text-anchor", "middle")
      .text("Speedmaster");

    svg
      .append("text")
      .attr("x", 200)
      .attr("y", 140)
      .attr("fill", "white")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .text("Professional");

    // Markers
    for (let i = 0; i < 60; i++) {
      const angle = ((i * 6 - 90) * Math.PI) / 180;
      const length = i % 5 === 0 ? 15 : 7;
      const color = i % 5 === 0 ? "white" : "#9acd32"; // Glow-in-the-dark effect for minor markers
      svg
        .append("line")
        .attr("x1", 200 + 170 * Math.cos(angle))
        .attr("y1", 200 + 170 * Math.sin(angle))
        .attr("x2", 200 + (170 - length) * Math.cos(angle))
        .attr("y2", 200 + (170 - length) * Math.sin(angle))
        .attr("stroke", color)
        .attr("stroke-width", i % 5 === 0 ? 3 : 1);
    }

    // Sub-dials
    const subDials = [
      { cx: 120, cy: 150 },
      { cx: 200, cy: 250 },
      { cx: 280, cy: 150 },
    ];

    subDials.forEach(({ cx, cy }) => {
      svg
        .append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", 30)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("fill", "black");
      for (let i = 0; i < 60; i++) {
        const angle = ((i * 6 - 90) * Math.PI) / 180;
        const length = i % 5 === 0 ? 6 : 3;
        svg
          .append("line")
          .attr("x1", cx + 30 * Math.cos(angle))
          .attr("y1", cy + 30 * Math.sin(angle))
          .attr("x2", cx + (30 - length) * Math.cos(angle))
          .attr("y2", cy + (30 - length) * Math.sin(angle))
          .attr("stroke", "white")
          .attr("stroke-width", i % 5 === 0 ? 2 : 1);
      }
      svg
        .append("line")
        .attr("x1", cx)
        .attr("y1", cy)
        .attr("x2", cx)
        .attr("y2", cy - 15)
        .attr("stroke", "white")
        .attr("stroke-width", 2);
    });

    // Clock Hands
    const hands = [
      { angle: hourAngle, length: 90, width: 6, color: "white", pointed: true },
      {
        angle: minuteAngle,
        length: 140,
        width: 4,
        color: "white",
        pointed: true,
      },
      { angle: secondAngle, length: 150, width: 2, color: "red", arrow: true },
    ];

    hands.forEach(({ angle, length, width, color, pointed, arrow }) => {
      const x = 200 + length * Math.sin(radians(angle));
      const y = 200 - length * Math.cos(radians(angle));

      // Draw the hand
      svg
        .append("line")
        .attr("x1", 200)
        .attr("y1", 200)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", color)
        .attr("stroke-width", width);

      if (arrow) {
        const xBack = 200 - 20 * Math.sin(radians(angle));
        const yBack = 200 + 20 * Math.cos(radians(angle));
        svg
          .append("line")
          .attr("x1", 200)
          .attr("y1", 200)
          .attr("x2", xBack)
          .attr("y2", yBack)
          .attr("stroke", color)
          .attr("stroke-width", width);

        const arrowSize = 10;
        const arrowHead1 = {
          x: x + arrowSize * Math.cos(radians(angle - 90)),
          y: y + arrowSize * Math.sin(radians(angle - 90)),
        };
        const arrowHead2 = {
          x: x + arrowSize * Math.cos(radians(angle + 90)),
          y: y + arrowSize * Math.sin(radians(angle + 90)),
        };

        svg
          .append("polygon")
          .attr(
            "points",
            `${x},${y} ${arrowHead1.x},${arrowHead1.y} ${arrowHead2.x},${arrowHead2.y}`
          )
          .attr("fill", color);
      } else if (pointed) {
        // Add the pointed end for hour and minute hands
        svg
          .append("polygon")
          .attr(
            "points",
            `${x},${y} ${x - 5 * Math.sin(radians(angle + 2))},${
              y - 5 * Math.cos(radians(angle + 2))
            } ${x - 5 * Math.sin(radians(angle - 2))},${
              y - 5 * Math.cos(radians(angle - 2))
            }`
          )
          .attr("fill", color);
      }
    });

    // Center circle
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 200)
      .attr("r", 10)
      .attr("fill", "white");
  };

  useEffect(drawClock, [time]);

  return (
    <div className="clock">
      <svg id="clock-svg"></svg>
    </div>
  );
};

const radians = (degrees) => degrees * (Math.PI / 180);

export default Clock;
