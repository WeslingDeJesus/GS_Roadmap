import { useState, useEffect } from 'react'
import { getProyectos } from './api/proyectos_api'
import './App.css'

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getProyectos()
      .then(res => {
        console.log("DATA:", res);
        setData(res);
      })
      .catch(err => {
        console.error("ERROR:", err);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Prueba API</h1>

      {/* Mostrar raw */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App
