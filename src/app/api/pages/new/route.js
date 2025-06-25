import path from "path";
import fs from "fs";
import { Readable } from "stream";
import Busboy from "busboy";
import { createPage } from "@/lib/database";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const contentType =
    req.headers.get("content-type") || req.headers.get("Content-Type");

  if (!contentType || !contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Missing or invalid Content-Type header" },
      { status: 400 }
    );
  }

  return new Promise((resolve) => {
    const formData = {};
    let photoPath = null;

    const headers = Object.fromEntries(req.headers.entries());
    const busboy = new Busboy({ headers });

    busboy.on("file", (fieldname, file, filename) => {
      if (!filename) return;

      const uniqueName = `${Date.now()}-${filename}`;
      photoPath = path.join(uploadDir, uniqueName);
      const writeStream = fs.createWriteStream(photoPath);

      file.pipe(writeStream);

      writeStream.on("error", (err) => {
        console.error("File write error:", err);
        return resolve(
          NextResponse.json({ error: "File upload failed" }, { status: 500 })
        );
      });

      writeStream.on("finish", () => {
        console.log(`Uploaded file saved to: ${photoPath}`);
      });
    });

    busboy.on("field", (fieldname, value) => {
      formData[fieldname] = value;
    });

    busboy.on("finish", async () => {
      const { title, slug, content } = formData;

      if (!title || !slug || !content) {
        return resolve(
          NextResponse.json(
            { error: "Missing required fields: title, slug, or content" },
            { status: 400 }
          )
        );
      }

      try {
        const newPage = await createPage({
          title,
          slug,
          content,
          photo: photoPath ? `/uploads/${path.basename(photoPath)}` : null,
        });

        return resolve(NextResponse.json(newPage, { status: 201 }));
      } catch (error) {
        console.error("Database error:", error);
        return resolve(
          NextResponse.json(
            { error: "Failed to save page to database" },
            { status: 500 }
          )
        );
      }
    });

    busboy.on("error", (err) => {
      console.error("Busboy error:", err);
      return resolve(
        NextResponse.json({ error: "File processing error" }, { status: 500 })
      );
    });

    const nodeStream = Readable.from(req.body);
    nodeStream.pipe(busboy);
  });
};
