import { useFormik } from "formik";
import * as Yup from "yup";
import { useRef } from "react";
import axiosInstance from "../../axios/axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const EditProfileModal = () => {
  const modalRef = useRef(null);
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      username: "",
      email: "",
      bio: "",
      link: "",
      newPassword: "",
      currentPassword: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(3, "fullName must be atleast 3 characters long")
        .max(20, "fullName cannot exceed 20 characters"),
      username: Yup.string()
        .min(3, "username must be atleast 3 characters long")
        .max(20, "username cannot exceed 20 characters")
        .matches(
          /^[0-9a-z]*$/,
          "Username can only contain alphanumeric characters"
        ),
      email: Yup.string().email("Invalid email address"),
      bio: Yup.string()
        .min(1, "Bio must be atleast 1 character long")
        .max(50, "Bio must be atleast 50 character long"),
      link: Yup.string(),
      newPassword: Yup.string().oneOf(
        [Yup.ref("currentPassword")],
        "Passwords must match"
      ),
      currentPassword: Yup.string()
        .min(6, "Password must be 6 characters long")
        .max(30, "Password must not exceed 30 characters")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter"),
    }),
    onSubmit: (values) => {
      const initialValues = Object.entries(formik.initialValues);
      const newValues = Object.entries(values);
      const dataToUpdate = checkFormikValues(initialValues, newValues);
      updateprofile(dataToUpdate);
      // alert(JSON.stringify(values, null, 2));
    },
  });

  const checkFormikValues = (initialValues, newValues) => {
    const data = {};
    for (let i = 0; i < newValues.length; i++) {
      if (initialValues[i][1] !== newValues[i][1]) {
        const key = newValues[i][0];
        const value = newValues[i][1];
        data[key] = value;
      }
    }
    return data;
  };

  const {
    mutate: updateprofile,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await axiosInstance.post("/user/update", data);
        console.log(response);
        console.log("status: ", response.status);
        // console.log("message: ", response.data.message);
        console.log("data: ", response.data.data);
        toast.success("Profile updated successfully");
      } catch (err) {
        if (!err.response.data.message) {
          // If request was sent but no response received
          console.log("ERROR: ", err.message);
          throw new Error("Something went wrong");
        } else {
          // Request was sent but response received with a status code
          // that falls out of the range of 2xx
          console.log("status: ", err.response.status);
          console.log(err.response.data);
          toast.error(err.response.data.message);
          throw new Error(err.response.data.message);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      modalRef.current.click();
    },
  });

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() =>
          document.getElementById("edit_profile_modal").showModal()
        }
      >
        Edit profile
      </button>
      <dialog id="edit_profile_modal" className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formik.values.fullName}
                name="fullName"
                onChange={formik.handleChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formik.values.username}
                name="username"
                onChange={formik.handleChange}
              />
              {formik.touched.username && formik.errors.username ? (
                <p className="text-red-500 text-xs italic items-center">
                  {formik.errors.username}
                </p>
              ) : null}
              {formik.touched.fullName && formik.errors.fullName ? (
                <p className="text-red-500 text-xs italic items-center">
                  {formik.errors.fullName}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formik.values.email}
                name="email"
                onChange={formik.handleChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formik.values.bio}
                name="bio"
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-xs italic items-center">
                  {formik.errors.email}
                </p>
              ) : null}
              {formik.touched.bio && formik.errors.bio ? (
                <p className="text-red-500 text-xs italic items-center">
                  {formik.errors.bio}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formik.values.currentPassword}
                name="currentPassword"
                onChange={formik.handleChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formik.values.newPassword}
                name="newPassword"
                onChange={formik.handleChange}
              />
              {formik.touched.currentPassword &&
              formik.errors.currentPassword ? (
                <p className="text-red-500 text-xs italic items-center">
                  {formik.errors.currentPassword}
                </p>
              ) : null}
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <p className="text-red-500 text-xs italic items-center">
                  {formik.errors.newPassword}
                </p>
              ) : null}
            </div>
            <input
              type="text"
              placeholder="Link"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formik.values.link}
              name="link"
              onChange={formik.handleChange}
            />
            {formik.touched.link && formik.errors.link ? (
              <p className="text-red-500 text-xs italic items-center">
                {formik.errors.link}
              </p>
            ) : null}
            <button
              type="submit"
              className="btn btn-primary rounded-full btn-sm text-white"
            >
              {isPending ? "Updating..." : "Update"}
            </button>
            {isError && (
              <p className="text-red-500 text-xs italic">{error.message}</p>
            )}
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            ref={modalRef}
            className="outline-none"
            onClick={() => {
              modalRef.current.value = null;
            }}
          >
            close
          </button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
