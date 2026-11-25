for (const [id, amount] of Object.entries({
  principal: diamondPassbook.principal,
  interest: diamondPassbook.interest,
  balance: diamondPassbook.balance,
  budget: diamondPassbook.budget,
})) {
  document.querySelector(`#passbook-${id}`).textContent = amount;
}

const picker = document.querySelector("#diamond-picker");
const options = Array.from(picker.querySelectorAll('input[name="plan"]'));
const storageKey = "adalin-birthday-diamond-plan";

try {
  const restored = options.find((option) => option.value === localStorage.getItem(storageKey));
  if (restored) {
    restored.checked = true;
  }
} catch {
  // The picker still works if the browser blocks local storage.
}

picker.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = options.find((option) => option.checked);
  if (!selected) return;
  const label = selected.labels[0].querySelector("strong").textContent.trim();
  try {
    localStorage.setItem(storageKey, selected.value);
  } catch {
    // The preview still opens if the browser blocks local storage.
  }

  const previewUrl = `text.html#${new URLSearchParams({ pick: label })}`;
  const popup = window.open(previewUrl, "_blank", "popup,width=720,height=860");
  if (popup) popup.opener = null;
  else window.location.assign(previewUrl);
});
