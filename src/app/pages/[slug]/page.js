import { getPageBySlug } from "@/lib/database";

export default async function Page({ params }) {
  const { slug } = params;
  const page = getPageBySlug(slug);

  if (!page) {
    return <div className="p-8">Page not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Title + Content */}
          <div className="flex-1">
            <h1 className="text-3xl text-center font-bold mb-4 uppercase">{page.title}</h1>
            <div
              dangerouslySetInnerHTML={{ __html: page.content }}
              className="prose text-center"
            />
          </div>

          {/* Right Column: Photo */}
          {page.photo && (
            <div className="w-full md:w-60 flex-shrink-0">
              <img
                src={page.photo}
                alt={page.title}
                className="w-full h-auto rounded-xl shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
