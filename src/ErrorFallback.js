import React, { useEffect } from "react";
import "./App.css";

const ErrorFallback = ({ error, errorInfo }) => {
  useEffect(() => {
    document.body.classList.add("loading");
    const timeout = setTimeout(() => {
      document.body.classList.remove("loading");
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className='error-container d-flex justify-content-center align-items-center vh-100'>
      <h1 className='error-code'>500</h1>
      <h2 className='error-msg'>
        Unexpected Error <b>:(</b>
      </h2>
      <div className='error-msg-container'>
        <h5 className='my-3'>Oops! Something went wrong.</h5>
        {process.env.REACT_APP_ENV_TOKEN === "development" && error && (
          <p>Error: {error.toString()}</p>
        )}

        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
