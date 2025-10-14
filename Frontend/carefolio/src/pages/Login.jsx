const LoginPage = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "100vh", backgroundColor: "#f9fcf8" }}
    >
      <h2 className="mb-4 fw-bold text-primary">Login to CareFolio</h2>
      <form style={{ width: "300px" }}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" placeholder="Enter email" />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" placeholder="Enter password" />
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-2">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
