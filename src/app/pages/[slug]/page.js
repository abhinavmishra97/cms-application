import { getPageBySlug } from "@/lib/database";

export default async function Page({ params }) {
  const { slug } = params;
  const page = getPageBySlug(slug);
  if (!page) {
    return <div className="p-8">Page not found</div>;
  }
  return (
    <div className="prose mx-auto p-8">
      <h1 className="text-4xl">{page.title.toUpperCase()}</h1>
      <br/>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}
