import React from "react";

type Notes = {
  title?: string;
  text?: string;
  tags?: string;
};

type Props = {
  value: Notes;
  onChange: (v: Notes) => void;
};

const NotesSection: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (field: keyof Notes, v: any) => {
    onChange({ ...value, [field]: v });
  };

  return (
    <section>
      <h2>Notes (black & white)</h2>
      <div
        style={{
          border: "1px solid #000",
          padding: "0.5rem",
          background: "#fff",
          color: "#000"
        }}
      >
        <label>
          Title:
          <input
            type="text"
            value={value.title ?? ""}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </label>
        <label>
          Notes:
          <textarea
            rows={4}
            value={value.text ?? ""}
            onChange={(e) => handleChange("text", e.target.value)}
          />
        </label>
        <label>
          Tags (comma separated):
          <input
            type="text"
            value={value.tags ?? ""}
            onChange={(e) => handleChange("tags", e.target.value)}
          />
        </label>
      </div>
    </section>
  );
};

export default NotesSection;



