function Home() {
  return (
    <div className="home">
      <h1>🎓 Welcome to University Course Manager</h1>
      <p>Your one-stop solution for managing university courses</p>

      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          margin: "20px 0",
        }}
      >
        <h3>✅ System Status</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>🔌 Backend API: Connected</li>
          <li>🗄️ Database: MongoDB Atlas</li>
          <li>⚛️ Frontend: React + Vite</li>
          <li>🚀 Status: Ready for Stage 1</li>
        </ul>
      </div>

      <div className="action-cards">
        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            margin: "10px 0",
            border: "1px solid #dee2e6",
          }}
        >
          <h4>📚 Course Management</h4>
          <p>Create, view, edit, and delete courses</p>
        </div>

        <div
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            margin: "10px 0",
            border: "1px solid #dee2e6",
          }}
        >
          <h4>🔮 Coming in Stage 2</h4>
          <p>Student enrollment, teacher dashboards, and authentication</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
