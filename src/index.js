export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/check" && request.method === "POST") {
      try {
        const data = await request.json();

        const username = String(data.username || "")
          .trim()
          .replace(/^@/, "");

	if (!/^[A-Za-z0-9._]+$/.test(username)) {
  	 return Response.json({
    	   status: "BANNED"
  	  });
	}

        if (!username) {
          return Response.json({
            status: "BANNED"
          });
        }

        const threadsUrl =
          `https://www.threads.com/@${encodeURIComponent(username)}`;

        const response = await fetch(threadsUrl, {
          redirect: "manual",
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        });

        let status;

        if (response.status === 200) {
          status = "AKTIF";
        } else if (
          response.status === 301 ||
          response.status === 302 ||
          response.status === 303 ||
          response.status === 307 ||
          response.status === 308
        ) {
          status = "BANNED";
        } else {
          status = "BANNED";
        }

        return Response.json({
          username,
          status
        });

      } catch (error) {
        return Response.json({
          status: "BANNED"
        });
      }
    }

    return new Response("Threads Checker Worker", {
      status: 200
    });
  }
};