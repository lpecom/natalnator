import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        View Page
      </button>
    </div>
  );
};

export default AdminHeader;