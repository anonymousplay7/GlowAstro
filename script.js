const form = document.getElementById("astroForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    message.textContent = "Submitting...";
    message.style.color = "#ffd95a";

    const visitorData = {
        name: document.getElementById("name").value.trim(),
        gender: document.getElementById("gender").value,
        date_of_birth: document.getElementById("date_of_birth").value,
        time_of_birth: document.getElementById("time_of_birth").value,
        country: document.getElementById("country").value.trim(),
        state: document.getElementById("state").value.trim(),
        city: document.getElementById("city").value.trim()
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
