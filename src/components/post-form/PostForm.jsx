import React, { useCallback, useState } from "react";
import { Button, Input, Select, RTE } from "../index";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import service from "../../firebase/config";

function PostForm({ post }) {
  const { register, handleSubmit, setValue, control, watch, getValues, formState: { errors } } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  
  // ✅ Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");

  const submit = async (data) => {
    setIsSubmitting(true);
    setError("");
    
    try {
      let fileUrl = null;

      // Upload new image if selected
      if (data.image && data.image[0]) {
        setUploadProgress("Uploading image...");
        fileUrl = await service.uploadFile(data.image[0]);
        
        // Delete old image if updating post
        if (post?.featuredImage && fileUrl) {
          setUploadProgress("Removing old image...");
          await service.deleteFile(post.featuredImage);
        }
      }

      // Prepare post data
      setUploadProgress(post ? "Updating post..." : "Creating post...");
      const postData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: fileUrl || post?.featuredImage || "",
        author: userData?.name || "Anonymous",
        userId: userData?.uid,
        createdAt: post?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (post) {
        // Update existing post
        await service.updatePost(post.id, postData);
        setUploadProgress("Post updated successfully!");
        setTimeout(() => navigate(`/post/${post.id}`), 500);
      } else {
        // Create new post
        const dbPost = await service.createPost(postData);
        if (dbPost) {
          setUploadProgress("Post created successfully!");
          setTimeout(() => navigate(`/post/${dbPost}`), 500);
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
      setError(error.message || "Failed to save post. Please try again.");
      setUploadProgress("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        {/* Title Input */}
        <Input
          label="Title :"
          placeholder="Enter post title"
          className="mb-4"
          {...register("title", { 
            required: "Title is required",
            minLength: { value: 3, message: "Title must be at least 3 characters" }
          })}
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1 mb-2">{errors.title.message}</p>
        )}

        {/* Slug Input */}
        <Input
          label="Slug :"
          placeholder="post-slug"
          className="mb-4"
          {...register("slug", { 
            required: "Slug is required",
            pattern: {
              value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: "Slug must be lowercase with hyphens only"
            }
          })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
          }}
        />
        {errors.slug && (
          <p className="text-red-600 text-sm mt-1 mb-2">{errors.slug.message}</p>
        )}

        {/* Rich Text Editor */}
        <RTE 
          label="Content :" 
          name="content" 
          control={control} 
          defaultValue={getValues("content")} 
        />
      </div>

      <div className="w-1/3 px-2">
        {/* Featured Image Upload */}
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { 
            required: !post ? "Featured image is required" : false
          })}
        />
        {errors.image && (
          <p className="text-red-600 text-sm mt-1 mb-2">{errors.image.message}</p>
        )}

        {/* Current Image Preview */}
        {post && post.featuredImage && (
          <div className="w-full mb-4">
            <p className="text-sm text-gray-600 mb-2">Current Image:</p>
            <img
              src={post.featuredImage}
              alt={post.title}
              className="rounded-lg w-full object-cover"
            />
          </div>
        )}

        {/* Status Select */}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <p className="text-sm">{uploadProgress}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          bgColor={post ? "bg-green-500" : "bg-blue-600"} 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            post ? "Update Post" : "Create Post"
          )}
        </Button>

        {/* Cancel Button */}
        {!isSubmitting && (
          <Button
            type="button"
            bgColor="bg-gray-500"
            className="w-full mt-2"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default PostForm;