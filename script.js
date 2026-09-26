* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;

    font-family: Georgia, serif;

    background:
        radial-gradient(
            circle at top,
            #fff4b8,
            transparent 35%
        ),
        linear-gradient(
            135deg,
            #160b2e,
            #35145c,
            #090414
        );

    color: white;
}


.container {
    min-height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 25px;
}


.glow-card {
    width: 100%;
    max-width: 480px;

    padding: 32px;

    border-radius: 25px;

    background: rgba(20, 10, 40, 0.88);

    border: 1px solid rgba(255, 215, 100, 0.6);

    box-shadow:
        0 0 25px rgba(255, 215, 100, 0.35),
        0 0 60px rgba(170, 90, 255, 0.25);
}


h1 {
    text-align: center;

    margin: 0;

    color: #ffd95a;

    text-shadow:
        0 0 15px rgba(255, 217, 90, 0.8);
}


.subtitle {
    text-align: center;

    color: #ddd0ff;

    margin-bottom: 25px;
}


/* =========================
   YOUTUBE BUTTON
========================= */

.youtube-button {
    display: block;

    width: 100%;

    margin: 15px 0 25px;

    padding: 13px;

    border-radius: 12px;

    background: #ff0000;

    color: white;

    text-align: center;

    text-decoration: none;

    font-weight: bold;

    font-size: 16px;

    box-shadow:
        0 0 15px rgba(255, 0, 0, 0.3);

    transition: 0.2s;
}


.youtube-button:hover {
    opacity: 0.9;

    transform: translateY(-1px);
}


/* =========================
   FORM
========================= */

label {
    display: block;

    margin-top: 15px;

    margin-bottom: 7px;

    color: #f8df91;

    font-weight: bold;
}


input,
select {
    width: 100%;

    padding: 13px;

    border: 1px solid #8c6bc4;

    border-radius: 10px;

    background: #170d2c;

    color: white;

    font-size: 15px;

    outline: none;
}


input:focus,
select:focus {
    border-color: #ffd95a;

    box-shadow:
        0 0 10px rgba(255, 217, 90, 0.35);
}


/* =========================
   SUBMIT BUTTON
========================= */

button[type="submit"] {
    width: 100%;

    margin-top: 25px;

    padding: 14px;

    border: none;

    border-radius: 12px;

    background:
        linear-gradient(
            135deg,
            #ffd95a,
            #c98bff
        );

    color: #1a0c2e;

    font-size: 17px;

    font-weight: bold;

    cursor: pointer;

    box-shadow:
        0 0 20px rgba(255, 217, 90, 0.35);

    transition: 0.2s;
}


button[type="submit"]:hover {
    transform: translateY(-1px);
}


/* =========================
   MESSAGE
========================= */

#message {
    text-align: center;

    margin-top: 18px;

    font-weight: bold;

    min-height: 20px;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 500px) {

    .container {
        padding: 15px;
    }

    .glow-card {
        padding: 24px;
        border-radius: 20px;
    }

    h1 {
        font-size: 28px;
    }

            }
