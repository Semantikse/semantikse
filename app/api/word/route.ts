import { CemantixApi } from "@/app/utils/cemantixApi";
import z from "zod";

const BodySchema = z.object({
  word: z.string(),
});

export async function POST(request: Request) {
  const { word } = BodySchema.parse(await request.json());

  return Response.json(await CemantixApi.submitWord(word));
}
