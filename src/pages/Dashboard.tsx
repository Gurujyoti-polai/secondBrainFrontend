import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Notes from "./Notes";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return <p>Loading or unauthorized...</p>;

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>

      <hr />
      <Notes />
    </div>
  );
};

export default Dashboard;
