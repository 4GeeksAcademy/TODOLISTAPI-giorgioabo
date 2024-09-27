import React, { useEffect, useState } from "react";

const Home = () => {
  const [tareas, setTareas] = useState([]);
  const [label, setLabel] = useState("");
  const name = "Giorgio_Behna";

  const getAllData = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${name}`);
      if (response.ok) {
        const dataJson = await response.json();
        setTareas(dataJson.todos || []);
      } else if (response.status === 404) {
        await fetch(`https://playground.4geeks.com/todo/users/${name}`, {
          method: "POST",
        });
        setTareas([]);
        alert("Usuario API creado. Recargue la página.");
      }
    } catch (error) {
      console.error("Error al recuperar datos:", error);
    }
  };

  const createNewElement = async (event) => {
    event.preventDefault();
    const newTask = { label, done: false };
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${name}`, {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        setTareas([...tareas, newTask]);
      }
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };

  const deleteElement = async (todoId) => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTareas(tareas.filter((item) => item.id !== todoId));
      } 
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const deleteAllElements = async () => {
    try {
      await Promise.all(tareas.map((item) => fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, { method: 'DELETE' })));      
      setTareas([]);
    } catch (error) {
      console.error("Error al eliminar todas las tareas:", error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <div className="row m-auto py-2">
      <form onSubmit={createNewElement}>
        <div className="mb-3">
          <label className="form-label"><strong>Listado de tareas</strong></label>
          <input
            placeholder="Añade tu nueva tarea"
            value={label}
            className="form-control"
            onChange={(event) => setLabel(event.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-info mb-3">Añadir tarea</button>
      </form>
	  <div className="w-100 m-auto">
        <ol>
          {tareas.map((item, index) => (
            <li key={index}>
              {item.label}
              <button
                className="btn btn-success btn-sm ms-2"
                onClick={() => deleteElement(item.id)}
              >
                ¡Hecho!
              </button>
            </li>
          ))}
        </ol>
		<button 
          className="btn btn-warning text-danger my-3" 
          onClick={deleteAllElements}>
            <strong>Completar todas las tareas</strong>
        </button>
      </div>
    </div>
  );
};

export default Home;