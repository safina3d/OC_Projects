// DOM Elements
const modalElement = document.querySelector(".bground");
const displayModalButtonElements = document.querySelectorAll(".modal-btn");
const closeModalButtonElement = document.querySelector(".close");
const burgerIconElement = document.querySelector(".icon");
const subscriptionFormElement = document.querySelector("#subscription");
const congratulationModalElement = document.querySelector(".modal-congratulation");
const closeCongratulationButton = document.querySelector("#close-congrat-btn");

const errorMessages = {
    first: {
        tooShort: "Veuillez entrer 2 caractères ou plus.",
        patternMismatch: "Veuillez utiliser uniquement des lettres."
    },
    last: {
        tooShort: "Veuillez entrer 2 caractères ou plus.",
        patternMismatch: "Veuillez utiliser uniquement des lettres."
    },
    email: {
        patternMismatch: "Vous devez entrer une adresse email valide."
    },
    birthdate: {
        rangeOverflow: "Vous devez avoir au moins 10 ans pour participer.",
        rangeUnderflow: "Date de naissance non valide, veuillez réessayer.",
        valueMissing: "Veuillez entrer votre date de naissance."
    },
    quantity: {
        rangeOverflow: "La valeur entrée doit être inférieure ou égale à 99.",
        rangeUnderflow: "La valeur entrée doit être supérieure ou égale à 0."
    },
    location: {
        valueMissing: "Vous devez choisir une option."
    },
    termsofuse: {
        valueMissing: "Vous devez accepter les termes et conditions."
    }
};

/** Toggle the visibility of a given element.*/
const toggleVisibility = (element, isVisible, displayType = "block") => {
    element.style.display = isVisible ? displayType : "none";
}

/** Retrieve the error message element related to a specific input element. */
const getErrorElement = (inputElement) => {
    const parent = inputElement.closest(".formData");
    return parent ? parent.querySelector(".error-msg") : null;
}

subscriptionFormElement.addEventListener("invalid", function (event) {
    event.preventDefault();
    const targetEl = event.target;
    const errorEl = getErrorElement(targetEl);
    if (errorEl) {
        // find the first error type, within the validity property, that has a value of true.
        const errorType = Object.keys(errorMessages[targetEl.name]).find(
            (key) => targetEl.validity[key]
        );
        errorEl.innerText = errorMessages[targetEl.name][errorType] || "Ce champ est requis.";
        toggleVisibility(errorEl, true);
    }
}, true);

subscriptionFormElement.addEventListener("input", e => {
    e.preventDefault();
    const targetEl = e.target;
    const errorEl = getErrorElement(targetEl);
    if (targetEl.checkValidity() && errorEl) {
        errorEl.innerText = "";
        toggleVisibility(errorEl, false);
    }
});

subscriptionFormElement.addEventListener("submit", e => {
    e.preventDefault();
    toggleVisibility(congratulationModalElement , true, "grid");
});

// Make the modal container visible
displayModalButtonElements.forEach((btn) =>
    btn.addEventListener("click", () => toggleVisibility(modalElement, true))
);

// Hide the modal container using the cross icon
closeModalButtonElement .addEventListener("click", () => {
    toggleVisibility(modalElement, false);
    subscriptionFormElement.reset();
});

// Handle the menu burger icon
burgerIconElement.addEventListener("click", e => {
    e.preventDefault();
    const headerElement = document.getElementById("myTopnav");
    headerElement.classList.toggle("responsive");
});

// Hide the modal container using the close button
closeCongratulationButton .addEventListener("click", e => {
    toggleVisibility(congratulationModalElement , false);
    toggleVisibility(modalElement, false);
    subscriptionFormElement.reset();
});
