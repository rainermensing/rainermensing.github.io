const headerTarget = document.querySelector("[data-cv-header]");
const contentTarget = document.querySelector("[data-cv-content]");
const svgNamespace = "http://www.w3.org/2000/svg";

function requiredString(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`The ${field} value is missing.`);
  }
  return value.trim();
}

function contactItem(symbol, href, label) {
  const item = document.createElement("li");
  const iconHolder = document.createElement("span");
  const icon = document.createElementNS(svgNamespace, "svg");
  const use = document.createElementNS(svgNamespace, "use");
  const link = document.createElement("a");

  iconHolder.className = "contact-icon";
  iconHolder.setAttribute("aria-hidden", "true");
  icon.classList.add("icon", "icon-brand");
  icon.setAttribute("viewBox", "0 0 24 24");
  use.setAttribute("href", `assets/icons.svg?v=2#${symbol}`);
  link.href = href;
  link.textContent = label;

  icon.append(use);
  iconHolder.append(icon);
  item.append(iconHolder, link);
  return item;
}

function phoneHref(phone) {
  const normalized = phone.replace(/[\s().-]/g, "");
  if (!/^\+?\d{7,15}$/.test(normalized)) {
    throw new Error("The phone value is invalid.");
  }
  return `tel:${normalized}`;
}

async function loadFragment(target, path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${path}.`);
  }
  target.innerHTML = await response.text();
  return target;
}

async function loadCv() {
  const [header, content] = await Promise.all([
    loadFragment(headerTarget, "templates/header.html"),
    loadFragment(contentTarget, "templates/cv-content.html")
  ]);

  if (document.body.dataset.cvPage !== "private") {
    return;
  }

  const secretsResponse = await fetch(".cv-secrets.json", { cache: "no-store" });
  if (!secretsResponse.ok) {
    throw new Error("Could not load .cv-secrets.json.");
  }

  const secrets = await secretsResponse.json();
  const email = requiredString(secrets.email, "email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("The email value is invalid.");
  }
  const phone = requiredString(secrets.phone, "phone");
  const contacts = header.querySelector(".contact-list");

  if (!contacts) {
    throw new Error("The shared CV header is incomplete.");
  }

  contacts.prepend(
    contactItem("contact-email", `mailto:${email}`, email),
    contactItem("contact-phone", phoneHref(phone), phone)
  );
}

function showError(error) {
  headerTarget.replaceChildren();
  contentTarget.replaceChildren(document.createTextNode("The CV could not be loaded."));
  console.error(error);
}

if (headerTarget && contentTarget) {
  loadCv().catch(showError);
}
