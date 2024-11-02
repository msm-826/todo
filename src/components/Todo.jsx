import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ title: "", description: "" });
    const [editingTodo, setEditingTodo] = useState(null);
    const newItemRef = useRef(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    useEffect(() => {
        if (newItemRef.current) {
            newItemRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [todos]);

    const fetchTodos = async () => {
        try {
            const response = await axios.get("http://localhost:8000/todos");
            console.log("response received from django:");
            console.log(response.data);
            setTodos(response.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingTodo) {
            try {
                const response = await axios.put(`http://localhost:8000/todos/${editingTodo.id}`, newTodo);
                setTodos(todos.map((todo) => (todo.id === editingTodo.id ? response.data : todo)));
                setEditingTodo(null);
                setNewTodo({ title: "", description: "" });
            } catch (error) {
                console.error("Error updating todo:", error);
            }
        } else {
            try {
                const response = await axios.post("http://localhost:8000/todos", newTodo);
                setTodos([...todos, response.data]);
                setNewTodo({ title: "", description: "" });
            } catch (error) {
                console.error("Error adding todo:", error);
            }
        }
    };

    const handleEdit = (todo) => {
        setNewTodo({ title: todo.title, description: todo.description });
        setEditingTodo(todo);
    };

    const handleCancelEdit = () => {
        setNewTodo({ title: "", description: "" });
        setEditingTodo(null);
    };

    const handleToggleCompletion = async (id) => {
        try {
            const todo = todos.find((todo) => todo.id === id);
            const response = await axios.patch(`http://localhost:8000/todos/${id}`, { completed: !todo.completed });
            setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/todos/${id}`);
            setTodos(todos.filter((todo) => todo.id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const completedTodos = todos.filter((todo) => todo.completed);
    const uncompletedTodos = todos.filter((todo) => !todo.completed);

    return (
        <div className="container p-8">
            <h1 className="text-3xl font-bold text-center p-4">Todo List</h1>
            <div className="container text-center">
                <form onSubmit={handleSubmit}>
                    <input type="text" value={newTodo.title} onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })} placeholder="Task" className="input input-bordered w-full max-w-xs m-2" required />
                    <input type="text" value={newTodo.description} onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })} placeholder="Description" className="input input-bordered w-full max-w-xs m-2" required />
                    <button className="btn btn-secondary m-2" type="submit">
                        {editingTodo ? "Edit Todo" : "Add Todo"}
                    </button>
                    {editingTodo && (
                        <button className="btn btn-secondary m-2" type="button" onClick={handleCancelEdit}>
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="w-full container">
                    <h2 className="text-2xl font-semibold text-center">Tasks</h2>
                    <div className="divider m-2"></div>
                    {uncompletedTodos.map((todo) => (
                        <div key={todo.id} ref={todo.id === (todos[todos.length - 1]?.id || editingTodo?.id) ? newItemRef : null} className="card bg-neutral text-neutral-content w-11/12 m-2">
                            <div className="card-body items-center text-center p-4">
                                <h2 className="card-title">{todo.title}</h2>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-secondary" onClick={() => handleEdit(todo)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => handleDelete(todo.id)}>
                                        Delete
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => handleToggleCompletion(todo.id)}>
                                        Mark as Completed
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full container">
                    <h2 className="text-2xl font-semibold text-center">Completed Tasks</h2>
                    <div className="divider m-2"></div>
                    {completedTodos.map((todo) => (
                        <div key={todo.id} ref={todo.id === (todos[todos.length - 1]?.id || editingTodo?.id) ? newItemRef : null} className="card bg-neutral text-neutral-content w-11/12 m-2">
                            <div className="card-body items-center text-center p-4">
                                <h2 className="card-title">{todo.title}</h2>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-secondary" onClick={() => handleEdit(todo)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => handleDelete(todo.id)}>
                                        Delete
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => handleToggleCompletion(todo.id)}>
                                        Mark as not Completed
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Todo;
