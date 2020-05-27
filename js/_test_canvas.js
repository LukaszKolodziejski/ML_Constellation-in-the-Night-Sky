const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#372";
ctx.fillRect(0, 0, 100, 50);

ctx.beginPath();
ctx.lineWidth = 3;
ctx.strokeStyle = "#932";
ctx.moveTo(50, 50);
ctx.lineTo(100, 100);
ctx.lineTo(200, 150);
// ctx.closePath();
ctx.stroke();
