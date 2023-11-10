import { useEffect, useState } from "react";

export interface PostInformation {
  id: string;
  title: string;
  blogTitle: string;
}

const BlogNavigator = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostInformation[]>([]);

  useEffect(() => {
    async function inner() {
      try {
        const blogsResponse = await fetch(`/blog/list/all`);
        if (blogsResponse.ok) {
          const blogs = await blogsResponse.json();
          const posts: PostInformation[] = blogs.flatMap((b: any) =>
            (b.fetchPosts || []).map((post: any) => {
              return {
                id: post._id,
                title: post.title,
                blogTitle: b.title,
              };
            }),
          );
          setPosts(posts);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    inner();
  });

  function renderLoading() {
    return <div>Loading</div>;
  }

  function renderPost(post: PostInformation) {
    return (
      <li key={post.id}>
        <a
          href={`${window.location.origin}${window.location.pathname}?doc=${post.id}&source=blog`}
        >
          {post.blogTitle} - {post.title}
        </a>
      </li>
    );
  }

  function renderPostLists() {
    return <ul>{posts.map((p) => renderPost(p))}</ul>;
  }

  return loading ? renderLoading() : renderPostLists();
};

export default BlogNavigator;
