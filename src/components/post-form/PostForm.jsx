import React from "react";
import { Button, Input, Select, RTE } from "../index";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import service from "../../firebase/config";

function PostForm({ post }) {
  const { register, handleSubmit, setValue, control } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    try {
      let fileUrl = null;

      // Upload new image if selected
      if (data.image && data.image[0]) {
        fileUrl = await service.uploadFile(data.image[0]);
      }

      // Prepare post data
      const postData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: fileUrl || post?.featuredImage || "",
        author: userData?.name,
        userId: userData?.uid,
        createdAt: new Date().toISOString(),
      };

      if (post) {
        // Update existing post
        await service.updatePost(post.id, postData);
      } else {
        // Create new post
        const dbPost = await service.createPost(postData);
        if (dbPost) {
          navigate(`/post/${dbPost.id}`);
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="max-w-2xl mx-auto bg-gray-100 p-6 rounded-xl shadow-md space-y-5"
    >
      <Input
        label="Title"
        placeholder="Enter post title"
        {...register("title", { required: true })}
      />

      <Input
        label="Slug"
        placeholder="Enter unique slug"
        {...register("slug", { required: true })}
      />

      <Input
        type="file"
        label="Featured Image"
        accept="image/*"
        {...register("image")}
      />

      <RTE label="Content" control={control} name="content" />

      <Select
        label="Status"
        options={["active", "draft"]}
        {...register("status")}
      />

      <Button type="submit" className="w-full">
        {post ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
}

export default PostForm;
