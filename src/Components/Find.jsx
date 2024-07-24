import axios from "axios";
import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Document, Page } from "react-pdf";
import Loding from "./Loding";

const Find = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [pdf, setPdf] = useState("");

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const url = `${import.meta.env.VITE_FIND_URL}/find-by/${searchTerm}`;

      const response = await axios.get(url, {
        responseType: "arraybuffer",
      });

      const pdfBytes = response.data;

      // Convert buffer to a PDF document
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Create a Blob and generate a URL
      const blob = new Blob([await pdfDoc.save()], { type: "application/pdf" });
      const urll = URL.createObjectURL(blob);
      setPdf(urll);
      setIsLoading(false);
    } catch (error) {
      console.log("ERRor:", error);
      setIsLoading(false);
      alert("Invoice Not Found");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {isLoading && <Loding />}
      <h1 className="text-2xl font-bold mb-4">
        Find Invoice By Invoice Number
      </h1>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter Invoice No. Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleSearch}
          className="absolute right-0 top-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
      {pdf && (
        <div className="w-full px-4 py-2 border border-gray-300 rounded-md mt-8">
          <Document
            file={pdf}
            onLoadSuccess={handleDocumentLoadSuccess}
            className="pdf-document"
          >
            <Page
              pageNumber={pageNumber}
              onLoadSuccess={handleDocumentLoadSuccess}
              className="pdf-page"
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
          {pdf && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
              onClick={() => {
                const link = document.createElement("a");
                link.href = pdf;
                link.download = "invoice.pdf";
                link.click();
              }}
            >
              Download PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Find;
