import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Note {
    title: string;
    content: string;
    updatedAt: string;
}

const SharedNote = () => {
    const { slug } = useParams();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSharedNote = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/notes/shared/${slug}`);
                console.log("Get shared note REACT", res);
                setNote(res.data);
            } catch (err) {
                console.error("Failed to load shared note", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSharedNote();
    }, [slug]);

    if (loading) return <div>Loading...</div>;

    if (!note) return <div>Note not found.</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>{note.title}</h1>
            <p>{note.content}</p>
            <small>Last updated: {new Date(note.updatedAt).toLocaleString()}</small>
        </div>
    );
};

export default SharedNote;
