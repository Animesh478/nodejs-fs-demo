const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === "/") {
    res.setHeader("content-type", "text/html");
    fs.readFile("dataFile.txt", (err, data) => {
      res.end(`
            <p>${data}</p>
            <form action="/writeFile" method="post">
                <input type="text" name="username"/>
                <button type="submit">Send</button>
            </form>
            `);
    });
  } else {
    if (url === "/writeFile") {
      const data = [];
      req.on("data", (chunk) => {
        data.push(chunk);
      });

      req.on("end", () => {
        const formData = Buffer.concat(data).toString();
        const formValues = formData.split("=")[1];

        fs.appendFile("dataFile.txt", `${formValues}\n`, (err) => {
          res.statusCode = 302;
          res.setHeader("Location", "/");
          res.end();
        });
      });
    }
  }
});

server.listen(3000, () => {
  console.log("Server is running");
});
