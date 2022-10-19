const toPdf = require("html-pdf-node");
const fs = require("fs");
const path = require("path");

toPdf
  .generatePdf(
    { url: "http://localhost:3000" },
    {
      width: "5in",
      height: "8in",
      margin: {
        left: "0.5in",
        right: "0.5in",
        top: "0.5in",
        bottom: "0.5in",
      },
    }
  )
  .then((pdfBuffer) => {
    fs.writeFileSync(path.join(__dirname, "rulebook.pdf"), pdfBuffer);
  });
