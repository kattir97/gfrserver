import { Type } from "@sinclair/typebox";

export const LoginUserDto = Type.Object({
  username: Type.String(),
  password: Type.String(),
})