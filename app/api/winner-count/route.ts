import { CemantixApi } from "@/app/utils/cemantixApi";

export async function GET() {
  return Response.json(await CemantixApi.getWinnerCount());
}
