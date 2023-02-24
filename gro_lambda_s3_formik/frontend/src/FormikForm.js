import "./FormikForm.css";
import { Formik } from "formik";
import React, { useState } from "react";
import CONFIG from "./app-config.json";

const getApplicableConfig = () => {
  const thisEnv = CONFIG.useEnvironment;
  const envConfig = CONFIG.environments.find((e) => e.environment === thisEnv);
  if (envConfig) return envConfig;
  return null;
};

const applicableConfig = getApplicableConfig();

const handleOnSubmit = (values, callback) => {
  const data = JSON.stringify(values);
  const file = new Blob([data], { type: "application/json" });
  const fileName = "employee.json";
  uploadToS3(file, fileName, callback);
};

const uploadToS3 = async (file, fileName, callback) => {
  const url = `${applicableConfig.apiUrl}/document?file=${fileName}&folder=documents`;
  const options = {
    method: "POST",
  };
  let preSignedUrl;
  await fetch(url, options)
    .then((response) => response.json())
    .then((data) => (preSignedUrl = data));
  const s3Options = {
    method: "PUT",
    body: file,
  };
  await fetch(preSignedUrl.url, s3Options);
  callback();
};

const downloadFromS3 = () => {
  const url = `${applicableConfig.apiUrl}/document?file=documents/employee.json`;
  const options = {
    method: "GET",
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      const s3Options = {
        method: "GET",
      };
      fetch(data.url, s3Options)
        .then((response) => response.json())
        .then((data) => {
          const a = document.createElement("a");
          const file = new Blob([JSON.stringify(data)], {
            type: "application/json",
          });
          a.href = URL.createObjectURL(file);
          a.download = "employee";
          a.click();
          URL.revokeObjectURL(a.href);
        });
    });
};

const FormikForm = () => {
  const [uploaded, setUploaded] = useState(false);

  let initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    gender: "",
    dob: "",
  };
  return (
    <div className="App">
      <header className="App-header">
        <div>ABC Company Employee Portal</div>
      </header>
      <div className="body">
        <div className="query-form">
          <Formik
            initialValues={initialValues}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              handleOnSubmit(values, () => {
                setUploaded(true);
                setTimeout(() => setUploaded(false), 2000);
              });
              setSubmitting(false);
              values = {};
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="dataField">
                  <label>First Name</label>
                  <input
                    className="input"
                    type="text"
                    id="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="dataField">
                  <label>Last Name</label>
                  <input
                    className="input"
                    type="text"
                    id="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="dataField">
                  <label>Email</label>
                  <input
                    className="input"
                    type="text"
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="dataField">
                  <label>Employee ID</label>
                  <input
                    className="input"
                    type="text"
                    id="employeeId"
                    value={values.employeeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="dataField">
                  <label>Gender</label>
                  <input
                    className="input"
                    type="text"
                    id="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="dataField">
                  <label>Date of Birth</label>
                  <input
                    className="input"
                    type="date"
                    id="dob"
                    value={values.dob}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.firstName && touched.firstName && errors.firstName}
                {errors.lastName && touched.lastName && errors.lastName}
                {errors.email && touched.email && errors.email}
                {errors.employeeId && touched.employeeId && errors.employeeId}
                <div className="button">
                  <button
                    type="submit"
                    className="input"
                    disabled={isSubmitting}
                  >
                    Upload Data
                  </button>
                </div>
              </form>
            )}
          </Formik>
          {uploaded && (
            <div>
              <p style={{ backgroundColor: "#ffff99" }}>
                Employee data successfully uploaded!
              </p>
            </div>
          )}
        </div>
        <div className="button">
          <button
            type="submit"
            className="input"
            style={{ backgroundColor: uploaded ? "#99ff66" : "#99ccff" }}
            onClick={downloadFromS3}
          >
            Download Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormikForm;
