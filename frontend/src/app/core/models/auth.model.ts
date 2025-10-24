export interface RegisterPayload {
  email: string,
  password: string,
  username: string
}

export interface Email {
  email: string
}

export interface NewPassword {
  token: string,
  new_password: string
}
