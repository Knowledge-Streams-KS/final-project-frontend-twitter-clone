import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../axios/axios";
import { useEffect } from "react";

const Posts = ({ feedType }) => {
  const getPostEndPoint = () => {
    if (feedType === "forYou") {
      return "/post/all";
    } else if (feedType === "following") {
      return "/post/following";
    }
    return "/post/all";
  };

  const POST_ENDPOINT = getPostEndPoint();

  const {
    data: POSTS,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(POST_ENDPOINT);
        // console.log("status: ", response.status);
        // console.log("data: ", response.data.data);
        return response.data.data;
      } catch (err) {
        console.log("status: ", err.response.status);
        console.log("Error: ", err.response.data.message);
        console.log(err);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && POSTS?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && POSTS && (
        <div>
          {POSTS.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
