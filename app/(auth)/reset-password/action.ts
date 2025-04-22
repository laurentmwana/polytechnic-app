'use server'

import { ResetPasswordSchemaInfer } from "@/definitions/auth-schema"


const resetPasswordUser = async (data: ResetPasswordSchemaInfer) => {
  console.log(data)
}
