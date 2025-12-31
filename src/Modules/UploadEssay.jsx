import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import {
  onLoading,
  onLoadingClose,
  onSuccess,
  onError,
} from "../Utils/ErrorHandler";
import Cookies from "js-cookie";
import uploadIcon from "../Assets/upload-icon.png";
import { useNavigate } from "react-router-dom";
import MakersLogo from "../Utils/MakersLogo";

const Registration = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const tokenKey = process.env.REACT_APP_TOKEN || "token";
  const token = Cookies.get(tokenKey);

  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const file_name = file.name;
    setFileName(file_name);

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOC, or DOCX files are allowed");
      e.target.value = "";
      return;
    }

    setFile(file);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (error) return;
      setError("");
      if (!file) {
        setError("Upload the File");
        return;
      }

      onLoading();

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const formdata = new FormData();
      formdata.append("file", file);
      const res = await axios.post(`${baseUrl}/essay/submit`, formdata, {
        headers,
      });

      onLoadingClose();
      if (res.status === 201) {
        onSuccess({ message: "Essay Submitted Successfully." });
        setTimeout(() => {
          navigate("/submitted");
        }, 2000);
      }
    } catch (err) {
      onLoadingClose();
      onError(err);
    }
  };

  return (
    <div className='container'>
      <div className='registration-cont upload-form-cont m-auto mb-5'>
        <div className='registration-card p-4'>
          <h5>Upload Your Essay</h5>
          <span className='d-block my-2'>
            Upload your essay in DOC, DOCX, or PDF format{" "}
            <small>(Word limit 2500)</small>
          </span>

          <div>
            <div className='upload-sec rounded-4 d-flex flex-column justify-content-center align-items-center'>
              {fileName ? (
                <p className='my-2'>{fileName}</p>
              ) : (
                <>
                  <img
                    src={uploadIcon}
                    alt='upload'
                    className='otp-logo my-3'
                  />
                  <p>Drag and Drop your essay here</p>
                  <span className='d-block text-secondary'>
                    or click to browse
                  </span>
                </>
              )}
              <Form.Group className='position-relative mt-2 d-inline-block'>
                <Form.Label className='fw-semibold border border-1 rounded-4 border-secondary p-2'>
                  Browse Files
                </Form.Label>

                <Form.Control
                  type='file'
                  className='position-absolute top-0 start-0 w-100 h-100 opacity-0'
                  accept='.pdf,.doc,.docx'
                  onChange={handleFile}
                />
              </Form.Group>

              {error && <small className='text-danger'>{error}</small>}
            </div>
            <p className='fw-normal my-2 note-text'>
              <span className='text-danger fw-bold'>Note: </span>Submission
              deadline is 15 Feb 2026, ensure your essay follows all competition
              guidelines before submitting.
            </p>
            <button onClick={handleSubmit} className='sec-btn w-100 border-0'>
              Submit Essay
            </button>
          </div>
        </div>
      </div>
      <div className='makers-section'>
        <MakersLogo />
      </div>
    </div>
  );
};

export default Registration;
