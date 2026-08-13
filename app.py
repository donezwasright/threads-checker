from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)


def check_threads(username):
    username = username.strip().lstrip("@")

    if not username:
        return None

    url = f"https://www.threads.com/@{username}"

    try:
        response = requests.get(
            url,
            headers={
                "User-Agent": "Mozilla/5.0"
            },
            timeout=15,
            allow_redirects=False
        )

        if response.status_code == 200:
            return "AKTIF"

        elif response.status_code in (301, 302, 303, 307, 308):
            return "BANNED"

        else:
            return "BANNED"

    except requests.RequestException:
        return "BANNED"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/check", methods=["POST"])
def check():
    data = request.get_json()

    username = data.get("username", "").strip().lstrip("@")

    if not username:
        return jsonify({
            "status": "BANNED"
        })

    status = check_threads(username)

    return jsonify({
        "username": username,
        "status": status
    })


if __name__ == "__main__":
    app.run(debug=True)