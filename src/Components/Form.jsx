import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Document, Page } from "react-pdf";

import { useNavigate } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import Loding from "./Loding";

function InvoiceForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageChange = (pageNumber) => {
    setPageNumber(pageNumber);
  };
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    items: [],

    paid: "",
    invoice_nr: "",
  });
  const [pdf, setPdf] = useState("");
  const [items, setItems] = useState([
    { item: "", description: "", quantity: "", amount: "" },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { item: "", description: "", quantity: "", amount: "" },
    ]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;

    let newItems = [...items];
    newItems[index][name] = value;
    setItems(newItems);
    setFormData((prev) => {
      return {
        ...prev,
        items: [...items],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);

    try {
      const url = `${import.meta.env.VITE_FIND_URL}`;
      setIsLoading(true);

      const response = await axios.post(url, formData, {
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

      // Set the URL to be used by iframe
    } catch (error) {
      console.log("ERRor:", error);
      setIsLoading(false);
      alert("Invoice Can't be Genrated");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {isLoading && <Loding />}
      <h2 className="text-2xl font-semibold mb-4">Invoice Genrater</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleOnchange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleOnchange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleOnchange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State:
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleOnchange}
              placeholder="Only Indian states are allowed"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country:
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleOnchange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="postal_code"
              className="block text-sm font-medium text-gray-700"
            >
              Postal Code:
            </label>
            <input
              type="number"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleOnchange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div id="itemsContainer">
          {items.map((item, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor={`item-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Item:
                  </label>
                  <input
                    type="text"
                    id={`item-${index}`}
                    name={`item`}
                    value={item.item}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor={`description-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description:
                  </label>
                  <input
                    type="text"
                    id={`description-${index}`}
                    name={`description`}
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor={`quantity-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity:
                  </label>
                  <input
                    type="number"
                    id={`quantity-${index}`}
                    name={`quantity`}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor={`amount-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Amount:
                  </label>
                  <input
                    type="number"
                    id={`amount-${index}`}
                    name={`amount`}
                    value={item.amount}
                    onChange={(e) => handleItemChange(index, e)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md mt-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Add Item
        </button>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="paid"
              className="block text-sm font-medium text-gray-700"
            >
              Amount Paid:
            </label>
            <input
              type="number"
              id="paid"
              name="paid"
              value={formData.paid}
              onChange={handleOnchange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="invoice_nr"
              className="block text-sm font-medium text-gray-700"
            >
              Invoice Number:
            </label>
            <input
              type="number"
              id="invoice_nr"
              name="invoice_nr"
              value={formData.invoice_nr}
              onChange={handleOnchange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
        >
          Submit
        </button>
        <Link to="/find">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4">
            Find Your Invoice
          </button>
        </Link>
      </form>

      {pdf && (
        <div className="p-1 bg-slate-400 mt-1">
          <Document
            file={pdf}
            onLoadSuccess={handleDocumentLoadSuccess}
            className="pdf-document"
          >
            <Page
              pageNumber={pageNumber}
              onLoadSuccess={handleDocumentLoadSuccess}
              className="pdf-page"
              renderTextLayer={false}
              renderAnnotationLayer={false}
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

      {!pdf && (
        <p>
          {pdf
            ? "PDF loaded successfully"
            : "Please fill the form to generate the invoice"}
        </p>
      )}
    </div>
  );
}

export default InvoiceForm;
