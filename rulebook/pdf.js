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
        left: "0.65in",
        right: "0.65in",
        top: "0.65in",
        bottom: "0.65in",
      },
    }
  )
  .then((pdfBuffer) => {
    fs.writeFileSync(path.join(__dirname, "rulebook.pdf"), pdfBuffer);
  });
