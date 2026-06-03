import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { getBlogBySlug } from "../services/blog";

const formatDate = (value) => {
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export default function PublicBlog() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getBlogBySlug(slug)
      .then((item) => {
        if (mounted) setBlog(item);
      })
      .catch(() => {
        if (mounted) setError("This article is not available.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 pt-32 text-gray-950">
        <div className="mx-auto max-w-3xl animate-pulse space-y-5">
          <div className="h-5 w-40 rounded bg-gray-100" />
          <div className="h-12 w-4/5 rounded bg-gray-100" />
          <div className="h-4 w-64 rounded bg-gray-100" />
          <div className="h-96 rounded bg-gray-100" />
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-white px-6 pt-32 text-gray-950">
        <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold">Article unavailable</h1>
          <p className="mt-3 text-gray-600">{error || "This article is not available."}</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-pink-600">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const content = blog.humanized_content || blog.content || "";

  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-32 text-gray-950">
      <article className="mx-auto max-w-3xl">
        <Link to="/#published-blogs" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-pink-600">
          <ArrowLeft className="h-4 w-4" />
          Back to blogs
        </Link>

        <header className="border-b border-gray-200 pb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>{formatDate(blog.created_at)}</span>
            {blog.word_count > 0 && <span>{blog.word_count} words</span>}
            <span>By {blog.author_name || blog.author?.name || "ScriptNova author"}</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-gray-950 md:text-5xl">
            {blog.title || "Untitled blog"}
          </h1>
          {blog.prompt && <p className="mt-5 text-lg leading-8 text-gray-600">{blog.prompt}</p>}
        </header>

        <div className="prose prose-gray mt-10 max-w-none prose-headings:text-gray-950 prose-a:text-pink-600">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
