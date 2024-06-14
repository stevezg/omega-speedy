import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./Clock.css";

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 100); // Update every 100 milliseconds for smooth second hand

    return () => clearInterval(timerId);
  }, []);

  const drawClock = () => {
    const svg = d3
      .select("#clock-svg")
      .attr("viewBox", "0 0 450 450")
      .attr("width", "450")
      .attr("height", "450");

    // Clear previous elements
    svg.selectAll("*").remove();

    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();
    const hourAngle = (hours + minutes / 60) * 30;
    const minuteAngle = (minutes + (seconds + milliseconds / 1000) / 60) * 6;
    const secondAngle = (seconds + milliseconds / 1000) * 6;

    // Outer bezel circle
    svg
      .append("circle")
      .attr("cx", 225)
      .attr("cy", 225)
      .attr("r", 210)
      .attr("stroke", "#C0C0C0") // Grey steel color
      .attr("stroke-width", 10)
      .attr("fill", "black");

    // Bezel text (Tachymeter markings)
    const bezelText = [
      { text: "TACHYMÈTRE", angle: 0 },
      { text: "500", angle: -30 },
      { text: "450", angle: -60 },
      { text: "400", angle: -90 },
      { text: "350", angle: -120 },
      { text: "300", angle: -150 },
      { text: "250", angle: -180 },
      { text: "225", angle: -210 },
      { text: "200", angle: -240 },
      { text: "190", angle: -270 },
      { text: "180", angle: -300 },
      { text: "160", angle: -330 },
    ];

    bezelText.forEach(({ text, angle }) => {
      svg
        .append("text")
        .attr("x", 225 + 180 * Math.cos(((angle - 90) * Math.PI) / 180))
        .attr("y", 225 + 180 * Math.sin(((angle - 90) * Math.PI) / 180))
        .attr("fill", "#C0C0C0") // Grey color
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          `rotate(${angle}, ${
            225 + 180 * Math.cos(((angle - 90) * Math.PI) / 180)
          }, ${225 + 180 * Math.sin(((angle - 90) * Math.PI) / 180)})`
        )
        .text(text);
    });

    // Inner circle (main dial)
    svg
      .append("circle")
      .attr("cx", 225)
      .attr("cy", 225)
      .attr("r", 195)
      .attr("stroke", "#C0C0C0") // Grey steel color
      .attr("stroke-width", 10)
      .attr("fill", "black");

    // Anderson and Speedmaster text
    svg
      .append("text")
      .attr("x", 225)
      .attr("y", 115)
      .attr("fill", "white")
      .attr("font-size", 24)
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .text("Anderson");

    svg
      .append("text")
      .attr("x", 225)
      .attr("y", 145)
      .attr("fill", "white")
      .attr("font-size", 16)
      .attr("text-anchor", "middle")
      .text("Speedmaster");

    svg
      .append("text")
      .attr("x", 225)
      .attr("y", 165)
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
        .attr("x1", 225 + 170 * Math.cos(angle))
        .attr("y1", 225 + 170 * Math.sin(angle))
        .attr("x2", 225 + (170 - length) * Math.cos(angle))
        .attr("y2", 225 + (170 - length) * Math.sin(angle))
        .attr("stroke", color)
        .attr("stroke-width", i % 5 === 0 ? 3 : 1);
    }

    // Sub-dials
    const subDials = [
      { cx: 150, cy: 220, label: "Sub-dial 1" }, // Adjusted position for more space
      { cx: 300, cy: 220, label: "Sub-dial 2" }, // Adjusted position for more space
      { cx: 225, cy: 300, label: "Sub-dial 3" },
    ];

    // Sub-dial details
    const subDialDetails = [
      {
        // First sub-dial (left)
        ticks: 5,
        numbers: [
          { text: "40", x: -25, y: 15 },
          { text: "20", x: 25, y: 15 },
          { text: "60", x: 0, y: -25 },
        ],
      },
      {
        // Second sub-dial (right)
        ticks: 10,
        numbers: [
          { text: "20", x: -25, y: 15 },
          { text: "10", x: 25, y: 15 },
          { text: "30", x: 0, y: -25 },
        ],
      },
      {
        // Third sub-dial (bottom)
        ticks: 12,
        numbers: [
          { text: "12", x: 0, y: -25 },
          { text: "3", x: 30, y: 5 },
          { text: "6", x: 0, y: 30 },
          { text: "9", x: -30, y: 5 },
        ],
      },
    ];

    subDials.forEach(({ cx, cy }, index) => {
      svg
        .append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", 40)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("fill", "black");

      const details = subDialDetails[index];

      // Sub-dial ticks
      for (let i = 0; i < details.ticks; i++) {
        const angle = ((i * (360 / details.ticks) - 90) * Math.PI) / 180;
        const length = i % (details.ticks / 4) === 0 ? 6 : 3;
        if (
          details.numbers.some((num) => radians(angle) === radians(num.angle))
        ) {
          continue; // Skip adding tick if there's a number
        }
        svg
          .append("line")
          .attr("x1", cx + 40 * Math.cos(angle))
          .attr("y1", cy + 40 * Math.sin(angle))
          .attr("x2", cx + (40 - length) * Math.cos(angle))
          .attr("y2", cy + (40 - length) * Math.sin(angle))
          .attr("stroke", "white")
          .attr("stroke-width", i % (details.ticks / 4) === 0 ? 2 : 1);
      }

      // Sub-dial numbers
      details.numbers.forEach(({ text, x, y }) => {
        svg
          .append("text")
          .attr("x", cx + x)
          .attr("y", cy + y)
          .attr("fill", "white")
          .attr("font-size", 12)
          .attr("text-anchor", "middle")
          .text(text);
      });

      // Sub-dial hands
      svg
        .append("line")
        .attr("x1", cx)
        .attr("y1", cy)
        .attr("x2", cx)
        .attr("y2", cy - 20)
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
      const x = 225 + length * Math.sin(radians(angle));
      const y = 225 - length * Math.cos(radians(angle));

      // Draw the hand
      svg
        .append("line")
        .attr("x1", 225)
        .attr("y1", 225)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", color)
        .attr("stroke-width", width);

      if (arrow) {
        const xBack = 225 - 20 * Math.sin(radians(angle));
        const yBack = 225 + 20 * Math.cos(radians(angle));
        svg
          .append("line")
          .attr("x1", 225)
          .attr("y1", 225)
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
        const point1 = {
          x: x + 10 * Math.sin(radians(angle + 90)),
          y: y - 10 * Math.cos(radians(angle + 90)),
        };
        const point2 = {
          x: x + 10 * Math.sin(radians(angle - 90)),
          y: y - 10 * Math.cos(radians(angle - 90)),
        };
        svg
          .append("polygon")
          .attr(
            "points",
            `${x},${y} ${point1.x},${point1.y} ${point2.x},${point2.y}`
          )
          .attr("fill", color);
      }
    });

    // Center circle
    svg
      .append("circle")
      .attr("cx", 225)
      .attr("cy", 225)
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
