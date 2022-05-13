const contacts = document.getElementsByClassName("contacts")[0];
const stickyHeader = document.getElementsByClassName("stickyHeader")[0];
function createContact(i, fragment) {
    let child = document.createElement("div");

    child.setAttribute("data-number", i);
    child.textContent = i;
    child.classList.add("contact");
    fragment.appendChild(child);
    return child;
}
function addContacts(start = 0, finish = 50, create = false) {
    const fragment = document.createDocumentFragment();
    if (finish < 50000) {
        for (let i = start; i < finish; i++) {
            let child = createContact(i, fragment);
            if (i == finish - 10) {
                observer.observe(child);
            }
        }

        contacts.appendChild(fragment);
    }
}

contacts.addEventListener("scroll", (e) => {
    const items = Array.from(contacts.getElementsByClassName("contact"));
    const itemOffsets = items.map((item) => item.offsetTop);
    const topItemIndex = itemOffsets.findIndex((offset) => contacts.scrollTop - offset <= -18);
    if (topItemIndex !== -1) {
        stickyHeader.textContent = items[topItemIndex].textContent;
    }
});

const config = {
    root: contacts, // avoiding 'root' or setting it to 'null' sets it to default value: viewport
    rootMargin: "5px",
    threshold: 1,
};
let observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // we are ENTERING the "capturing frame". Set the flag.

            const curent_number = Number(entry.target.getAttribute("data-number"));
            observer.unobserve(entry.target);
            changeContacts(curent_number, curent_number + 100);
        }
    });
}, config);

addContacts(0, 200, true);
