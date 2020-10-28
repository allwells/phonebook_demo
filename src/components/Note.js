import React from "react";

const Note = ({ note, toggleImportance }) => {
	const label = note.importance ? "Make not important" : "Make important";

	return (
		<div>
			<li className="note">
				<button className="btn" onClick={toggleImportance}>
					{label}
				</button>
				{note.content}
			</li>
		</div>
	);
};

export default Note;
