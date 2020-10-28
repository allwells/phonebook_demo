import React, { useState, useEffect } from "react";
import Note from "./components/Note";
import service from "./services/notes";
import "./index.css";
import Notification from "./components/Notification";

const Footer = () => {
	const footerStyle = {
		color: "royalblue",
		fontStyle: "italic",
		fontSize: 16,
		textAlign: "center",
	};

	return (
		<div style={footerStyle}>
			<br />
			<em>
				Note app, Department of Computer Science, University of Helsinki 2020
			</em>
		</div>
	);
};

const App = () => {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState("");
	const [showAll, setShowAll] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		service.getAll().then((initialNotes) => {
			setNotes(initialNotes);
		});
	}, []);

	const toggleImportanceOf = (id) => {
		const note = notes.find((n) => n.id === id);
		const changedNote = { ...note, important: !note.important };

		service
			.update(id, changedNote)
			.then((returnedNote) => {
				setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
			})
			.catch((error) => {
				setErrorMessage(
					`Note '${note.content}' was already removed from server!`
				);
				setTimeout(() => {
					setErrorMessage(null);
				}, 5000);
				setNotes(notes.filter((n) => n.id !== id));
			});
	};

	const addNote = (event) => {
		event.preventDefault();
		const noteObject = {
			content: newNote,
			date: new Date(),
			important: Math.random() < 0.5,
		};

		service.create(noteObject).then((returnedNote) => {
			setNotes(notes.concat(returnedNote));
			setNewNote("");
		});
	};

	const handleNoteChange = (event) => {
		setNewNote(event.target.value);
	};

	const notesToShow = showAll
		? notes
		: notes.filter((note) => note.important === true);

	return (
		<div className="main-div">
			<h1>Notes</h1>
			<Notification message={errorMessage} />
			<div>
				<button className="show" onClick={() => setShowAll(!showAll)}>
					Show {showAll ? "important" : "all"}
				</button>
			</div>
			<div className="note-div">
				{notesToShow.map((note) => (
					<Note
						key={note.id}
						note={note}
						toggleImportance={() => toggleImportanceOf(note.id)}
					/>
				))}
			</div>
			<form onSubmit={addNote}>
				<input
					className="input"
					placeholder="Type notes here"
					value={newNote}
					onChange={handleNoteChange}
				/>
				<button className="save" type="submit">
					Save
				</button>
			</form>
			<Footer />
		</div>
	);
};

export default App;
