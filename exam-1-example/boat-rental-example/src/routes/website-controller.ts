import { Request, Response } from "express";
import path from "path";

export function serveWebsite(_: Request, response: Response) {
  const relative = path.join(process.cwd(), "public", "index.html");

  response.sendFile(relative);
}
