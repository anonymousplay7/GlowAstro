from flask import Flask, render_template, request, jsonify, redirect, url_for
import sqlite3

app = Flask(__name__)

DATABASE = "glowastro.db"


def get_db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_database():
    connection = get_db()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            gender TEXT NOT NULL,
            date_of_birth TEXT NOT NULL,
            time_of_birth TEXT NOT NULL,
            country TEXT NOT NULL,
            state TEXT NOT NULL,
            city TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


@app.route("/")
def login():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    connection = get_db()

    visitors = connection.execute(
        "SELECT * FROM visitors ORDER BY id DESC"
    ).fetchall()

    connection.close()

    return render_template(
        "dashboard.html",
        visitors=visitors
    )


@app.route("/api/visitors", methods=["POST"])
def add_visitor():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received"
        }), 400

    required_fields = [
        "name",
        "gender",
        "date_of_birth",
        "time_of_birth",
        "country",
        "state",
        "city"
    ]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "success": False,
                "message": f"Missing {field}"
            }), 400

    connection = get_db()

    connection.execute("""
        INSERT INTO visitors (
            name,
            gender,
            date_of_birth,
            time_of_birth,
            country,
            state,
            city
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data["name"],
        data["gender"],
        data["date_of_birth"],
        data["time_of_birth"],
        data["country"],
        data["state"],
        data["city"]
    ))

    connection.commit()
    connection.close()

    return jsonify({
        "success": True,
        "message": "Visitor saved successfully"
    })


@app.route("/delete/<int:visitor_id>", methods=["POST"])
def delete_visitor(visitor_id):

    connection = get_db()

    connection.execute(
        "DELETE FROM visitors WHERE id = ?",
        (visitor_id,)
    )

    connection.commit()
    connection.close()

    return redirect(url_for("dashboard"))


if __name__ == "__main__":
    create_database()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
