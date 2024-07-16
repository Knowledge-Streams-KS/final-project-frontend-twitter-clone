import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../axios/axios.jsx";
import toast from "react-hot-toast";

import XSvg from "../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUpPage = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      fullName: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      username: Yup.string()
        .min(3, "username must be atleast 3 characters long")
        .max(20, "username cannot exceed 20 characters")
        .matches(
          /^[0-9a-z]*$/,
          "Username can only contain alphanumeric characters"
        )
        .required("Required"),
      fullName: Yup.string()
        .min(3, "fullName must be atleast 3 characters long")
        .max(20, "fullName cannot exceed 20 characters")
        .required("Required"),
      password: Yup.string()
        .min(6, "Password must be 6 characters long")
        .max(30, "Password must not exceed 30 characters")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .required("Required"),
    }),
    onSubmit: (values) => {
      mutate(values);

      // alert(JSON.stringify(values, null, 2));
    },
  });

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await axiosInstance.post("/auth/signup", data);
        console.log("status: ", response.status);
        console.log("message: ", response.data.message);
        console.log("data: ", response.data.createdUser);
        toast.success("Account created successfully");
      } catch (err) {
        console.log("status: ", err.response.status);
        console.log(err.response.data);
        toast.error(err.response.data.message);
        throw error;
      }
    },
  });

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          onSubmit={formik.handleSubmit}
          className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col"
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </label>
          {formik.touched.email && formik.errors.email ? (
            <p className="text-red-500 text-xs italic">{formik.errors.email}</p>
          ) : null}
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
              />
            </label>
            {formik.touched.username && formik.errors.username ? (
              <p className="text-red-500 text-xs italic items-center">
                {formik.errors.username}
              </p>
            ) : null}
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={formik.handleChange}
                value={formik.values.fullName}
              />
            </label>
            {formik.touched.fullName && formik.errors.fullName ? (
              <p className="text-red-500 text-xs italic">
                {formik.errors.fullName}
              </p>
            ) : null}
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </label>
          {formik.touched.password && formik.errors.password ? (
            <p className="text-red-500 text-xs italic">
              {formik.errors.password}
            </p>
          ) : null}
          <button
            type="submit"
            className="btn rounded-full btn-primary text-white"
          >
            {isPending ? "Loading..." : "Sign Up"}
          </button>
          {isError && (
            <p className="text-red-500 text-xs italic">Something went wrong</p>
          )}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
