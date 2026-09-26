const form = document.getElementById("astroForm");
const message = document.getElementById("message");

const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");


// ================================
// LOAD COUNTRIES
// ================================

fetch("https://countriesnow.space/api/v0.1/countries/states")
    .then(response => response.json())
    .then(data => {

        if (data.error) {
            throw new Error("Unable to load countries");
        }

        data.data.forEach(country => {

            const option = document.createElement("option");

            option.value = country.name;
            option.textContent = country.name;

            countrySelect.appendChild(option);
        });

    })
    .catch(error => {

        console.error("Country loading error:", error);

        countrySelect.innerHTML =
            '<option value="">Unable to load countries</option>';

    });


// ================================
// LOAD STATES
// ================================

countrySelect.addEventListener("change", function () {

    const selectedCountry = countrySelect.value;

    stateSelect.innerHTML =
        '<option value="">Loading states...</option>';

    if (!selectedCountry) {

        stateSelect.innerHTML =
            '<option value="">Select state / province / region</option>';

        return;
    }

    fetch("https://countriesnow.space/api/v0.1/countries/states", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            country: selectedCountry
        })

    })
    .then(response => response.json())
    .then(data => {

        stateSelect.innerHTML =
            '<option value="">Select state / province / region</option>';

        if (
            data.error ||
            !data.data ||
            !data.data.states
        ) {
            return;
        }

        data.data.states.forEach(state => {

            const option = document.createElement("option");

            option.value = state.name;
            option.textContent = state.name;

            stateSelect.appendChild(option);

        });

    })
    .catch(error => {

        console.error("State loading error:", error);

        stateSelect.innerHTML =
            '<option value="">Unable to load states</option>';

    });

});


// ================================
// SUBMIT FORM
// ================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    message.textContent = "Submitting...";
    message.style.color = "#ffd95a";


    const visitorData = {

        name:
            document.getElementById("name").value.trim(),

        gender:
            document.getElementById("gender").value,

        date_of_birth:
            document.getElementById("date_of_birth").value,

        time_of_birth:
            document.getElementById("time_of_birth").value,

        country:
            document.getElementById("country").value.trim(),

        state:
            document.getElementById("state").value.trim(),

        city:
            document.getElementById("city").value.trim()

    };


    try {

        const response = await fetch(
            "https://glowastroadmin.onrender.com/api/visitors",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(visitorData)

            }
        );


        const result = await response.json();


        if (response.ok && result.success) {

            message.textContent =
                "✨ Your details were submitted successfully!";

            message.style.color = "#7CFF9B";

            form.reset();

            stateSelect.innerHTML =
                '<option value="">Select state / province / region</option>';

        } else {

            message.textContent =
                result.message || "Something went wrong.";

            message.style.color = "#ff7777";

        }

    } catch (error) {

        console.error("Submission error:", error);

        message.textContent =
            "Unable to connect to Glow Astro. Please try again.";

        message.style.color = "#ff7777";

    }

});
