import { useState } from "react";
import "./App.css";

function App() {
  const [host, setHost] = useState("127.0.0.1");
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hostAlive, setHostAlive] = useState(null);

  const checkHost = async () => {
    setIsScanning(true);
    setScanResults(null);
    setHostAlive(null);

    try {
      const pingResponse = await fetch("http://127.0.0.1:5000/api/scan/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host }),
      });
      const pingData = await pingResponse.json();
      setHostAlive(pingData.alive);

      const portsResponse = await fetch("http://127.0.0.1:5000/api/scan/ports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host }),
      });
      const portsData = await portsResponse.json();
      setScanResults(portsData.ports);
    } catch (error) {
      console.error("Scan failed:", error);
    }

    setIsScanning(false);
  };

  const openCount = scanResults ? scanResults.filter((p) => p.status === "open").length : 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo-bracket">[</span>
          <h1>NETSEC DASHBOARD</h1>
          <span className="logo-bracket">]</span>
        </div>
        <div className="header-right">v1.0</div>
      </header>

      <main className="main">
        <section className="scan-panel">
          <label className="field-label">TARGET HOST</label>
          <div className="input-row">
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="127.0.0.1"
              className="host-input"
            />
            <button onClick={checkHost} disabled={isScanning} className="scan-btn">
              {isScanning ? "SCANNING..." : "RUN SCAN"}
            </button>
          </div>
        </section>

        {hostAlive !== null && (
          <section className="status-panel">
            <div className={`status-dot ${hostAlive ? "online" : "offline"}`}></div>
            <span className="status-text">
              {host} is <strong>{hostAlive ? "ONLINE" : "OFFLINE"}</strong>
            </span>
            {scanResults && (
              <span className="port-summary">
                {openCount} open / {scanResults.length} scanned
              </span>
            )}
          </section>
        )}

        {isScanning && (
          <div className="scan-loading">
            <div className="scan-bar"></div>
            <span>probing ports...</span>
          </div>
        )}

        {scanResults && !isScanning && (
          <table className="results-table">
            <thead>
              <tr>
                <th>PORT</th>
                <th>SERVICE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {scanResults.map((p) => (
                <tr key={p.port}>
                  <td className="mono">{p.port}</td>
                  <td className="mono">{p.service}</td>
                  <td>
                    <span className={`badge ${p.status}`}>{p.status.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default App;