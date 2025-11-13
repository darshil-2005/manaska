const fs = require("fs");
const pdf = require("pdf-parse-fixed"); 

const filePath = process.argv[2];
if (!filePath) {
  console.error("No file path provided to pdfExtractWorker");
  process.exit(1);
}

try {
  const dataBuffer = fs.readFileSync(filePath);
  pdf(dataBuffer)
    .then((data) => {
      console.log(data.text.trim());
    })
    .catch((err) => {
      console.error("Error parsing PDF:", err);
      process.exit(1);
    });
} catch (err) {
  console.error("Failed to read file:", err);
  process.exit(1);
}
