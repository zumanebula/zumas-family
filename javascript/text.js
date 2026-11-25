const preview = document.querySelector("#share-preview");
const shareButton = document.querySelector("#share-jpg");
const download = document.querySelector("#download-jpg");
const shareStatus = document.querySelector("#share-status");
const pick = new URLSearchParams(location.hash.slice(1)).get("pick");

document.querySelector("#close-preview").addEventListener("click", () => {
  window.close();
  window.setTimeout(() => location.replace("diamond.html"), 100);
});

async function createCard(choice) {
  const art = new Image();
  art.src = "../pics/birthday-confirmation-page.jpeg";
  await art.decode();
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  const width = 1200;
  const inset = 64;
  const right = width - inset;
  const artWidth = right - inset;
  const artHeight = Math.round(artWidth * art.naturalHeight / art.naturalWidth);
  canvas.width = width;
  canvas.height = artHeight + 740;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.fillStyle = "#fff8ee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(art, inset, 48, artWidth, artHeight);
  ctx.textBaseline = "middle";
  const heading = artHeight + 108;
  const fontFamily = '"PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", system-ui, sans-serif';

  function write(value, x, y, size, weight = 500, color = "#302522") {
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.fillText(value, x, y, artWidth);
  }

  write("My Pick", inset, heading, 30, 700, "#a33757");
  write(choice, inset, heading + 56, 44, 750);

  const plusX = inset + 20;
  const plusY = heading + 112;
  ctx.fillStyle = "#ffd9df";
  ctx.beginPath();
  ctx.arc(plusX, plusY, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#a33757";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(plusX - 8, plusY);
  ctx.lineTo(plusX + 8, plusY);
  ctx.moveTo(plusX, plusY - 8);
  ctx.lineTo(plusX, plusY + 8);
  ctx.stroke();

  write("钻石存折 · 10 Years Diamond Plan", inset, heading + 162, 40, 750);
  write("起始日：TBD （需要求婚成功）", inset, heading + 219, 30, 500, "#67534d");

  const entries = [
    ["每月底存入（固定 $100 + 戒烟约 $60）", `$${diamondPassbook.monthlyDeposit}`],
    ["存入本金", diamondPassbook.principal],
    ["复利收益", diamondPassbook.interest],
    ["10年存折余额", diamondPassbook.balance],
    ["After x2 Match", diamondPassbook.budget],
  ];

  entries.forEach(([label, amount], index) => {
    const row = heading + 292 + index * 58;
    const isDeposit = index === 0;
    const isBudget = index === entries.length - 1;
    ctx.fillStyle = isDeposit ? "#ffd0a1" : isBudget ? "#ffd9df" : "#fffdf7";
    ctx.fillRect(inset, row - 27, artWidth, 55);
    write(label, inset + 16, row, 28, isDeposit || isBudget ? 750 : 500);
    ctx.textAlign = "right";
    write(amount, right - 16, row, 30, 750);
    ctx.textAlign = "left";
  });

  write("把二氧化碳变成真碳 ♡", inset, heading + 578, 32, 750, "#a33757");

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(new File([blob], "diamond-passbook.jpg", { type: "image/jpeg" }));
      else reject(new Error("JPEG export failed"));
    }, "image/jpeg", 0.94);
  });
}

async function showCard() {
  if (!pick || pick.length > 80) {
    shareStatus.textContent = "请回到钻石页选择一个方案，再点 Save & Send。";
    return;
  }
  try {
    const jpg = await createCard(pick);
    const url = URL.createObjectURL(jpg);
    preview.src = url;
    preview.alt = `求婚插图。My Pick：${pick}。起始日：TBD（需要求婚成功）。After Match：${diamondPassbook.budget}。`;
    preview.hidden = false;
    download.href = url;
    download.hidden = false;
    if (navigator.canShare?.({ files: [jpg] })) {
      shareButton.hidden = false;
      shareButton.addEventListener("click", async () => {
        try {
          await navigator.share({ files: [jpg] });
        } catch (error) {
          if (error.name !== "AbortError") shareStatus.textContent = "可以下载 JPG，再把它附到 iMessage。";
        }
      });
      shareStatus.textContent = "点分享后选择 Messages，或下载 JPG 附到 iMessage。";
    } else {
      shareStatus.textContent = "下载 JPG 后，就可以把它附到 iMessage 发给 Alvin。";
    }
  } catch {
    shareStatus.textContent = "JPG 暂时无法生成，请刷新页面再试一次。";
  }
}

showCard();
