import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../axios/axios";

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: followUnfollow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const response = await axiosInstance.post(`/user/follow/${userId}`);
        console.log("status: ", response.status);
        console.log("message: ", response.data.message);
      } catch (err) {
        console.log("status: ", err.response.status);
        console.log("Error: ", err.response.data.message);
        console.log(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { followUnfollow, isPending };
};

export default useFollow;
