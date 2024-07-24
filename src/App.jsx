import "./App.css";
import InvoiceForm from "./Components/Form";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Showpdf from "./Components/Find";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<InvoiceForm />} />
          <Route path="/find" element={<Showpdf />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
