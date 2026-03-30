// C:\Developer_main\Projects\react-pdf-flipbook-viewer-master\react-pdf-flipbook-viewer-master\app\(pages)\Meto_Engine\index.tsx
import React, { useState } from "react";
import ProfileSection from "./components/ProfileSection";
import VitalsSection from "./components/VitalsSection";
import LifestyleSection from "./components/LifestyleSection";
import SymptomsSection from "./components/SymptomsSection";
import LabsSection from "./components/LabsSection";
import NotesSection from "./components/NotesSection";

const MetoEnginePage: React.FC = () => {
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // local state for all sections
  const [subject, setSubject] = useState<any>({});
  const [biometrics, setBiometrics] = useState<any>({});
  const [lifestyle, setLifestyle] = useState<any>({});
  const [labs, setLabs] = useState<any>({});
  const [symptomResponses, setSymptomResponses] = useState<any[]>([]);
  const [userNotes, setUserNotes] = useState<any>({});

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    const payload = {
      version: "1.0.0",
      assessment_id: crypto.randomUUID(),
      subject,
      biometrics,
      lifestyle,
      labs,
      symptom_responses: symptomResponses,
      user_notes: userNotes
    };

    try {
      // Option 1: POST directly to Python API
      const res = await fetch("http://localhost:8000/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engine_config: { engine_version: "1.0.0" },
          assessment: payload
        })
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error calling scoring API", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", fontFamily: "system-ui" }}>
      <h1>Metabolic Engine</h1>

      <ProfileSection value={subject} onChange={setSubject} />
      <VitalsSection value={biometrics} onChange={setBiometrics} />
      <LifestyleSection value={lifestyle} onChange={setLifestyle} />
      <SymptomsSection value={symptomResponses} onChange={setSymptomResponses} />
      <LabsSection value={labs} onChange={setLabs} />
      <NotesSection value={userNotes} onChange={setUserNotes} />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Calculating..." : "Calculate Score"}
      </button>

      {result && (
        <pre style={{ marginTop: "1rem", background: "#f5f5f5", padding: "1rem" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default MetoEnginePage;
