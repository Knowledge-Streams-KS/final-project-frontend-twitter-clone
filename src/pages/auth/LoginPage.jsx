import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axiosInstance from "../../axios/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import XSvg from "../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";

const LoginPage = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "username must be atleast 3 characters long")
        .max(20, "username cannot exceed 20 characters")
        .matches(
          /^[0-9a-z]*$/,
          "Username can only contain alphanumeric characters"
        )
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
      console.log(values);
      loginMutation(values);
      // alert(JSON.stringify(values, null, 2));
    },
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data) => {
      try {
        console.log(document.cookie);
        const response = await axiosInstance.post("/auth/login", data);
        console.log("status: ", response.status);
        console.log("message: ", response.data.message);
      } catch (err) {
        console.log("status: ", err.response.status);
        console.log("Error: ", err.response.data.message);
        toast.error(err.response.data.message);
        console.log(err);
        throw new Error(err.response.data.message || "Something went wrong");
      }
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      // Invalidate the last query and refetch data
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={formik.handleSubmit}>
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="username"
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
            <p className="text-red-500 text-xs italic items-center">
              {formik.errors.password}
            </p>
          ) : null}
          <button
            type="submit"
            className="btn rounded-full btn-primary text-white"
          >
            {isPending ? "Loading..." : "Login"}
          </button>
          {isError && <p className="text-red-500 italic">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
