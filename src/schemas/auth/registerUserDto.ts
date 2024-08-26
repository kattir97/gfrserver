import { Type } from "@sinclair/typebox";

export const RegisterUserDto = Type.Object({
  username: Type.String(),
  password: Type.String(),
  role: Type.Optional(Type.String())
});