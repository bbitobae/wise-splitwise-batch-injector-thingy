import React, {useState} from 'react';
import './App.css';
import './css/output.css';
import {TokenFlow} from "./FlowElements/TokenFlow";
import {UploadCSVFlow} from "./FlowElements/UploadCSVFlow";
import {FilterTable} from "./FlowElements/FilterTable";
import {CSVRow} from "./FlowElements/CSVDataTable";

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientID: '',
    clientSecret: '',
    csvRows: [],
    transactions: [],
  });

  const handleNextStep = () => {setStep(step + 1);}
  const handlePrevStep = () => {setStep(step - 1);}
  const handleFormDataChange = (data: { [key: string]: string|CSVRow[] }) => {
    setFormData({ ...formData, ...data });
  };

  return <div className="m-10 p-8 self-center">
      {step === 1 && <TokenFlow onNext={handleNextStep} onChange={handleFormDataChange} />}
      {step === 2 && <UploadCSVFlow onNext={handleNextStep} onPrev={handlePrevStep} onChange={handleFormDataChange} />}
      {step === 3 && <FilterTable onPrev={handlePrevStep} onNext={handleNextStep} onChange={handleFormDataChange} csvRows={formData.csvRows} />}
    </div>
}

export default App;
