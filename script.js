const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");
const astroForm = document.getElementById("astroForm");
const successMessage = document.getElementById("successMessage");

const API_URL =
    "https://iso3166-2-api.vercel.app/api/all";

let locations = {};

const countryNames = new Intl.DisplayNames(
    ["en"],
    { type: "region" }
);


// ===============================
// LOAD ALL COUNTRIES + SUBDIVISIONS
// ===============================

async function loadLocations() {
    try {
        countrySelect.innerHTML =
            '<option value="">Loading all countries...</option>';

        stateSelect.innerHTML =
            '<option value="">Select Country First</option>';

        stateSelect.disabled = true;

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load location data.");
        }

        const data = await response.json();

        locations = data;

        populateCountries();

    } catch (error) {
        console.error("Location loading error:", error);

        countrySelect.innerHTML =
            '<option value="">Unable to load countries</option>';

        stateSelect.innerHTML =
            '<option value="">Please refresh the page</option>';

        stateSelect.disabled = true;
    }
}


// ===============================
// GET FULL COUNTRY NAME
// ===============================

function getCountryName(code, data) {

    // Prefer API country name if available
    if (data && typeof data === "object") {

        if (data.country_name) {
            return data.country_name;
        }

        if (data.countryName) {
            return data.countryName;
        }
    }

    // Otherwise use browser's country-name database
    try {
        return countryNames.of(code) || code;
    } catch {
        return code;
    }
}


// ===============================
// SHOW ALL COUNTRIES
// ===============================

function populateCountries() {

    countrySelect.innerHTML =
        '<option value="">Select Country</option>';

    Object.keys(locations)
        .sort((a, b) => {

            const nameA =
                getCountryName(a, locations[a]);

            const nameB =
                getCountryName(b, locations[b]);

            return nameA.localeCompare(
                nameB,
                "en",
                { sensitivity: "base" }
            );
        })
        .forEach(code => {

            const option =
                document.createElement("option");

            option.value = code;

            option.textContent =
                getCountryName(
                    code,
                    locations[code]
                );

            countrySelect.appendChild(option);
        });
}


// ===============================
// COUNTRY → STATE / PROVINCE / REGION
// ===============================

countrySelect.addEventListener(
    "change",
    function () {

        const countryCode =
            countrySelect.value;

        stateSelect.innerHTML = "";

        if (!countryCode) {

            stateSelect.disabled = true;

            stateSelect.innerHTML =
                '<option value="">Select Country First</option>';

            return;
        }

        stateSelect.disabled = false;

        const firstOption =
            document.createElement("option");

        firstOption.value = "";

        firstOption.textContent =
            "Select State / Province / Region";

        firstOption.disabled = true;
        firstOption.selected = true;

        stateSelect.appendChild(firstOption);


        // Get subdivisions for selected country
        let subdivisions =
            locations[countryCode];


        // Some API responses can wrap the data
        if (
            subdivisions &&
            typeof subdivisions === "object" &&
            !Array.isArray(subdivisions)
        ) {

            if (subdivisions.subdivisions) {
                subdivisions =
                    subdivisions.subdivisions;
            } else if (subdivisions.data) {
                subdivisions =
                    subdivisions.data;
            } else {
                subdivisions =
                    Object.values(subdivisions);
            }
        }


        if (!Array.isArray(subdivisions)) {
            subdivisions = [];
        }


        // Sort by FULL subdivision name
        subdivisions.sort((a, b) => {

            const nameA =
                getSubdivisionName(a);

            const nameB =
                getSubdivisionName(b);

            return nameA.localeCompare(
                nameB,
                "en",
                { sensitivity: "base" }
            );
        });


        // Add every subdivision
        subdivisions.forEach(item => {

            const name =
                getSubdivisionName(item);

            if (!name) return;


            const option =
                document.createElement("option");

            /*
             * VALUE = full name
             * TEXT  = full name
             *
             * So codes such as:
             * MP
             * MH
             * CA
             * TX
             *
             * are NOT displayed.
             */

            option.value = name;
            option.textContent = name;

            stateSelect.appendChild(option);
        });


        // Country has no listed subdivisions
        if (stateSelect.options.length === 1) {

            const option =
                document.createElement("option");

            option.value =
                "No subdivision listed";

            option.textContent =
                "No subdivision listed";

            stateSelect.appendChild(option);
        }
    }
);


// ===============================
// GET FULL SUBDIVISION NAME
// ===============================

function getSubdivisionName(item) {

    if (!item) return "";


    // If API gives a plain string
    if (typeof item === "string") {
        return item;
    }


    if (typeof item === "object") {

        /*
         * The API's main official subdivision
         * attribute is "name".
         */

        return (
            item.name ||
            item.subdivision_name ||
            item.subdivisionName ||
            item.subdivision ||
            item.label ||
            item.title ||
            item.localOtherName ||
            ""
        );
    }


    return "";
}


// ===============================
// FORM SUBMISSION
// ===============================

astroForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const submitButton =
            astroForm.querySelector("button");


        submitButton.disabled = true;

        submitButton.textContent =
            "Saving...";


        const formData =
            new FormData(astroForm);


        try {

            const response =
                await fetch(
                    "https://formspree.io/f/mrpbadwn",
                    {
                        method: "POST",
                        body: formData,
                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );


            if (response.ok) {

                successMessage.style.display =
                    "block";


                astroForm.reset();


                stateSelect.innerHTML =
                    '<option value="">Select Country First</option>';

                stateSelect.disabled = true;


                successMessage.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


            } else {

                alert(
                    "Something went wrong. Please try again."
                );
            }


        } catch (error) {

            console.error(error);

            alert(
                "Unable to submit. Please check your internet connection."
            );

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "💾 Save Details";
        }
    }
);


// ===============================
// START
// ===============================

loadLocations();
