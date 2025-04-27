import { useEffect, useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

interface Note {
  _id: string;
  title: string;
  content: string;
  updatedAt?: string;
  isPublic?: string;
  slug?: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [form, setForm] = useState({ title: "", content: "" });

  const fetchNotes = async () => {
    const res = await axios.get("http://localhost:5000/api/notes", { withCredentials: true });
    setNotes(res.data);
  };

  const handleEdit = (id: string, field: keyof Note, value: string) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? { ...n, [field]: value } : n))
    );
    debouncedUpdate(id, field, value);
  };

  const debouncedUpdate = debounce(async (id: string, field: string, value: string) => {
    const updatedNote = notes.find((n) => n._id === id);
    if (!updatedNote) return;

    await axios.put(
      `http://localhost:5000/api/notes/${id}`,
      { ...updatedNote, [field]: value },
      { withCredentials: true }
    );
  }, 800);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/notes/${id}`, { withCredentials: true });
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  const handleToggleShare = async (id: string) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/notes/share/${id}`,
        {},
        { withCredentials: true }
      );

      const updatedNote = res.data;

      setNotes((prev) =>
        prev.map((n) => (n._id === id ? { ...n, ...updatedNote } : n))
      );
    } catch (err) {
      console.error("Failed to toggle share", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/notes", form, { withCredentials: true });
    setForm({ title: "", content: "" });
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h2>Your Notes</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} value={form.title} required />
        <textarea name="content" placeholder="Content" onChange={handleChange} value={form.content}></textarea>
        <button type="submit">Add Note</button>
      </form>

      <ul>
        {notes.map((note) => (
          <li key={note._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <input
              value={note.title}
              onChange={(e) => handleEdit(note._id, "title", e.target.value)}
              placeholder="Title"
              style={{ fontWeight: "bold", fontSize: "16px", width: "100%" }}
            />
            <textarea
              value={note.content}
              onChange={(e) => handleEdit(note._id, "content", e.target.value)}
              placeholder="Content"
              style={{ width: "100%", minHeight: "80px", marginTop: "5px" }}
            ></textarea>
            <button onClick={() => handleDelete(note._id)} style={{ marginTop: "5px" }}>
              Delete
            </button>
            {/* 👇 Share toggle */}
            <label style={{ display: "block", marginTop: "10px" }}>
              <input
                type="checkbox"
                checked={!!note.isPublic}
                onChange={() => handleToggleShare(note._id)}
              />{" "}
              Share publicly
            </label>

            {/* 👇 Show link if shared */}
            {note.isPublic && note.slug && (
              <div style={{ marginTop: "5px", fontSize: "0.9rem" }}>
                🔗 <a
                  href={`http://localhost:5173/shared/note/${note.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Shared Link
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
