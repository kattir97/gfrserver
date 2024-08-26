import { Type } from "@sinclair/typebox";

export const WordId = Type.Object({
  wordId: Type.String(),
});

export const QueryString = Type.Object({
  query: Type.String()
})