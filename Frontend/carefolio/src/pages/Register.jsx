import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === "user") {
      navigate("/dashboard");
    } else {
      alert(`${role} dashboard coming soon!`);
    }
  };

  return (
    <div
      className=" d-flex  flex-column align-items-center justify-content-center"
      style={{ height: "100vh",width:"200vb" ,backgroundColor: "#f9fcf8" }}
    >
      <h2 className="mb-4 fw-bold text-primary">Choose your role</h2>
      <div className="d-flex gap-3">
        <button className="btn btn-outline-primary px-4 py-2" onClick={() => handleRoleSelect("user")}>
          User
        </button>
        <button className="btn btn-outline-success px-4 py-2" onClick={() => handleRoleSelect("doctor")}>
          Doctor
        </button>
        <button className="btn btn-outline-secondary px-4 py-2" onClick={() => handleRoleSelect("admin")}>
          Admin
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
