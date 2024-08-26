import { Type } from "@sinclair/typebox";

export const WordBody = Type.Object({
  word: Type.String(),
  description: Type.String(),
  speechPart: Type.String(),
  origin: Type.String(),
  comment: Type.String(),
  ergative: Type.String(),
  defaultMorfant: Type.String(),
  tags: Type.Array(Type.String()),
  definitions: Type.Array(Type.Object({
    definition: Type.String(),
  })),
  examples: Type.Array(Type.Object({
    example: Type.String(),
    translation: Type.String(),
  })),
  conjugations: Type.Array(Type.Object({
    conjugation: Type.String(),
    translation: Type.String(),
    morfant: Type.String(),
  })),
})

