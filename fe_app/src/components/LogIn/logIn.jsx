import jwtDecode from "jwt-decode";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authAPI";

function LoginForm() {
  const [error, setError] = useState();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await authApi.login(data);
      console.log("Login successfully", response);
      localStorage.setItem("access_token", response.access_token);
      let access_token = jwtDecode(response.access_token);
      if (access_token.role === "admin") {
        localStorage.setItem("activeTab", "/dashboard/report");
        navigate("/dashboard/report");
      } else {
        localStorage.setItem("activeTab", "/dashboard/swipecard");
        navigate("/dashboard/swipecard");
      }
    } catch (error) {
      console.log("Failed to login", error);
      if (error?.response?.status === 400) {
        setError(error.response.data.error_message);
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center p-2">
      <div className="justify-content-center w-50 p-3">
        <h2 className="text-center">Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="text-start">
          <div className="mb-3">
            <input
              {...register("username", { required: true })}
              type="text"
              className="form-control"
              placeholder="Tên đăng nhập"
            />
          </div>

          <div className="mb-3">
            <input
              {...register("password", { required: true })}
              type="password"
              className="form-control"
              placeholder="Mật khẫu"
            />
          </div>

          <p className="mt-3 text-sm">
            <br />
          </p>
          {error?.length && <h6 className="text-center">{error}</h6>}

          <div className="text-center">
            <button type="submit" className="btn btn-primary w-100 my-0 mb-2">
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
