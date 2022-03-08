import * as pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfWorker from "pdfjs-dist/build/pdf.worker.entry";

// const pdfParser = new PDFParser();

export const parser = (file) => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
  const loadingTask = pdfjsLib.getDocument(
    "https://pdfjs-express.s3-us-west-2.amazonaws.com/docs/choosing-a-pdf-viewer.pdf"
  );
  loadingTask.promise.then(function (pdf) {
    console.log("PDF loaded");
    pdf.getPage(2).then((page) => {
      page.getTextContent((textContent) => {
        console.log("HERE", textContent);
        var textItems = textContent.items;
        var finalString = "";

        // Concatenate the string of the item to the final string
        for (var i = 0; i < textItems.length; i++) {
          var item = textItems[i];

          finalString += item.str + " ";
        }
        console.log(finalString);
      });
    });
  });
};
