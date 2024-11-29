import { useEffect, useState } from "react";

function App() {
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/checklist");
        const data = await response.json();
        console.log(data);
        setChecklist(data);
      } catch (error) {
        console.error("Error fetching checklist:", error);
      }
    };
    fetchChecklist();
  }, []);

  console.log(checklist);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Checklist Dashboard</h1>
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>Rule ID</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {checklist.map((rule) => (
            <tr key={rule.id}>
              <td>{rule.id}</td>
              <td>{rule.description}</td>
              <td style={{ color: rule.status === "Passed" ? "green" : "red" }}>
                {rule.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
