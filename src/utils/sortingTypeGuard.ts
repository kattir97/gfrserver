import { OrderByDirectionExpression } from "kysely";
import { Words } from "kysely-codegen";

export function isSortBy(thing: unknown): thing is keyof Words & string {
  return (
    typeof thing === "string" &&
    [
      "audio",
      "comment",
      "created_at",
      "default_morfant",
      "description",
      "ergative",
      "id",
      "origin",
      "speech_part",
      "word",
    ].includes(thing)
  );
}

export function isOrderBy(thing: unknown): thing is OrderByDirectionExpression {
  return typeof thing === 'string' && ['asc', 'desc'].includes(thing);
}

export function assertIsSortBy(
  thing: unknown,
): asserts thing is keyof Words & string {
  if (!isSortBy(thing)) {
    throw new Error("not sort by");
  }
}

export function assertIsOrderBy(
  thing: unknown,
): asserts thing is OrderByDirectionExpression {
  if (!isOrderBy(thing)) {
    throw new Error("not order by");
  }
}