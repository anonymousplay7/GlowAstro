const form = document.getElementById("astroForm");

const message = document.getElementById("message");

const countrySelect =
    document.getElementById("country");

const stateSelect =
    document.getElementById("state");

const daySelect =
    document.getElementById("birth_day");

const monthSelect =
    document.getElementById("birth_month");

const yearSelect =
    document.getElementById("birth_year");


// ==========================================
// CREATE DAYS 1 - 31
// ==========================================

for (let day = 1; day <= 31; day++) {

    const option =
        document.createElement("option");

    option.value =
        String(day).padStart(2, "0");

    option.textContent = day;

    daySelect.appendChild(option);
}


// ==========================================
// CREATE YEARS
// ==========================================

const currentYear =
    new Date().getFullYear();

for (
    let year = currentYear;
    year >= 1900;
    year--
) {

    const option =
        document.createElement("option");

    option.value = year;

    option.textContent = year;

    yearSelect.appendChild(option);
}


// ==========================================
// LOAD ALL COUNTRIES
// ==========================================

fetch(
    "https://countriesnow.space/api/v0.1/countries/states"
)

.then(response => response.json())

.then(data => {

    if (data.error) {

        throw new Error(
            "Unable to load countries"
        );
    }


    data.data.forEach(country => {

        const option =
            document.createElement("option");

        option.value =
            country.name;

        option.textContent =
            country.name;

        countrySelect.appendChild(option);

    });

})

.catch(error => {

    console.error(
        "Country loading error:",
        error
    );

    countrySelect.innerHTML =
        '<option value="">Unable to load countries</option>';

});


// ==========================================
// LOAD STATES
// ==========================================

countrySelect.addEventListener(
    "change",
    function () {

        const selectedCountry =
            countrySelect.value;


        stateSelect.innerHTML =
            '<option value="">Loading states...</option>';


        if (!selectedCountry) {

            stateSelect.innerHTML =
                '<option value="">Select State</option>';

            return;
        }


        fetch(
            "https://countriesnow.space/api/v0.1/countries/states",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    country:
                        selectedCountry
                })

            }
        )

        .then(response =>
            response.json()
        )

        .then(data => {

            stateSelect.innerHTML =
                '<option value="">Select State</option>';


            if (
                data.error ||
                !data.data ||
                !data.data.states
            ) {

                return;
            }


            data.data.states.forEach(
                state => {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        state.name;

                    option.textContent =
                        state.name;

                    stateSelect.appendChild(
                        option
                    );

                }
            );

        })

        .catch(error => {

            console.error(
                "State loading error:",
                error
            );

            stateSelect.innerHTML =
                '<option value="">Unable to load states</option>';

        });

    }
);


// ==========================================
// SUBMIT FORM
// ==========================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        message.textContent =
            "Saving your details...";

        message.style.color =
            "#9a762d";


        // ==================================
        // BUILD DATE OF BIRTH
        // ==================================

        const day =
            daySelect.value;

        const month =
            monthSelect.value;

        const year =
            yearSelect.value;


        const dateOfBirth =
            `${year}-${month}-${day}`;


        // ==================================
        // COLLECT DATA
        // ==================================

        const visitorData = {

            name:
                document
                    .getElementById("name")
                    .value
                    .trim(),

            gender:
                document
                    .getElementById("gender")
                    .value,

            date_of_birth:
                dateOfBirth,

            time_of_birth:
                document
                    .getElementById(
                        "time_of_birth"
                    )
                    .value,

            country:
                countrySelect
                    .value
                    .trim(),

            state:
                stateSelect
                    .value
                    .trim(),

            city:
                document
                    .getElementById("city")
                    .value
                    .trim()

        };


        // ==================================
        // SEND TO ADMIN DATABASE
        // ==================================

        try {

            const response =
                await fetch(
                    "https://glowastroadmin.onrender.com/api/visitors",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                visitorData
                            )

                    }
                );


            const result =
                await response.json();


            // ==============================
            // SUCCESS
            // ==============================

            if (
                response.ok &&
                result.success
            ) {

                message.textContent =
                    "✨ Your details were saved successfully!";

                message.style.color =
                    "#278044";


                form.reset();


                stateSelect.innerHTML =
                    '<option value="">Select State</option>';

            }


            // ==============================
            // SERVER ERROR
            // ==============================

            else {

                message.textContent =
                    result.message ||
                    "Something went wrong.";

                message.style.color =
                    "#c62828";

            }

        }


        // ==================================
        // CONNECTION ERROR
        // ==================================

        catch (error) {

            console.error(
                "Submission error:",
                error
            );


            message.textContent =
                "Unable to connect to Glow Astro. Please try again.";

            message.style.color =
                "#c62828";

        }

    }
);
