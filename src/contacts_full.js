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

function deleteContacts(start_count = 0, finish_count) {
    const elements = document.getElementsByClassName("contact");
    for (let i = start_count; i < finish_count; i++) {
        while (elements[i]) {
            contacts.removeChild(elements[i])
        }
    }
}

function addContacts(start = 0, finish = 100, before = false) {
    const fragment = document.createDocumentFragment();
    const count_scroll = Math.round((finish - start) / 2)
    let offset_top = Math.round((contacts.clientHeight / 2) + 100);
    if (finish < 100000) {
        for (let i = start; i < finish; i++) {
            let child = createContact(i, fragment);
            if (i == start) {
                observer_up.observe(child);
            }
            if (i == finish - 6) {

                observer_down.observe(child);
            }
        }
        if (before) {
            offset_top += 800;
            contacts.prepend(fragment);
        } else {
            offset_top -= 200;
            contacts.appendChild(fragment);
        }
        contacts.scrollTop = offset_top;
    }
}

contacts.addEventListener("scroll", (e) => {
    const items = Array.from(contacts.getElementsByClassName("contact"));
    const itemOffsets = items.map((item) => item.offsetTop);
    const topItemIndex = itemOffsets.findIndex((offset) => contacts.scrollTop - offset <= -18);
    if (topItemIndex !== -1) {
        stickyHeader.textContent = Number(items[topItemIndex].textContent) - 1;
    }
});

const config = {
    root: contacts, // avoiding 'root' or setting it to 'null' sets it to default value: viewport
    rootMargin: "5px",
    threshold: 1,
};
let observer_down = new IntersectionObserver(function(entries) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const curent_number = Number(entry.target.getAttribute("data-number"));
            observer_down.unobserve(entry.target);
            deleteContacts(0, curent_number - 100);
            addContacts(curent_number, curent_number + 100, false);
        }
    });
}, config);
let observer_up = new IntersectionObserver(function(entries) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const curent_number = Number(entry.target.getAttribute("data-number"));
            observer_up.unobserve(entry.target);
            if (curent_number - 100 > 0) {
                console.log(curent_number, curent_number + 120)
                deleteContacts(curent_number, curent_number + 120);
                addContacts(curent_number - 100, curent_number, true, false);
            } else {
                if (curent_number > 1) {
                    const items = Array.from(contacts.getElementsByClassName("contact"));
                    deleteContacts(100, items.length);
                    addContacts(0, curent_number, true);
                }
            }

        }
    });
}, config);
window.onload = function() {
    addContacts(0, 120, true)
}