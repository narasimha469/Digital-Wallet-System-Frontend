function HomePage() {
  return (
    <div className="container mt-5 ">
      <div className="row align-items-center ">
        
        <div className="col-md-7 text-center text-md-start mb-4 mb-md-0">
          <h1 className="fw-bold display-5 text-primary mb-3">
            💼 Digital Wallet System
          </h1>
          <p className="lead text-muted">
            The Digital Wallet System is a secure and user-friendly platform 
            that allows customers to manage their money digitally. 
            With features like wallet balance management, transactions, 
            add/deduct funds, and an admin panel, it provides a seamless 
            digital payment experience.
          </p>
          <p className="text-muted ">
            Built with <strong>React</strong> for the frontend and <strong>Spring Boot</strong> for the backend, 
            this project ensures a clean UI, robust functionality, 
            and smooth performance across devices.
          </p>
          <button className="btn btn-primary btn-lg mt-2 shadow-sm">
            Get Started 🚀
          </button>
        </div>

    
        <div className="col-md-5 text-center">
          <img
            src="https://img.freepik.com/free-vector/mobile-banking-concept-illustration_114360-19588.jpg"
            alt="Digital Wallet"
            className="img-fluid rounded shadow-lg"
            style={{ maxHeight: "400px", transition: "0.3s ease-in-out" }}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
