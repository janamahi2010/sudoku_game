export const downloadSudokuScreenshot = (
  board: number[][],
  difficulty: string,
  elapsedSeconds: number,
): void => {
  const size = board.length;
  const px = 640;
  const cell = px / size;
  const canvas = document.createElement("canvas");
  canvas.width = px;
  canvas.height = px + 100;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 28px Manrope";
  ctx.fillText(`Sudoku • ${difficulty}`, 24, 38);
  ctx.font = "20px Manrope";
  ctx.fillText(`Time: ${elapsedSeconds}s`, 24, 70);

  ctx.strokeStyle = "#0f172a";
  for (let i = 0; i <= size; i += 1) {
    ctx.lineWidth = i % Math.sqrt(size) === 0 ? 4 : 1;
    ctx.beginPath();
    ctx.moveTo(i * cell, 100);
    ctx.lineTo(i * cell, px + 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 100 + i * cell);
    ctx.lineTo(px, 100 + i * cell);
    ctx.stroke();
  }

  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.max(16, Math.floor(cell * 0.42))}px Manrope`;
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const value = board[r][c];
      if (value === 0) continue;
      ctx.fillText(String(value), c * cell + cell / 2, 100 + r * cell + cell / 2);
    }
  }

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `sudoku-${Date.now()}.png`;
  a.click();
};
