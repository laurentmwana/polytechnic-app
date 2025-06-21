import { getRouteApi } from "../lib/route";

export const loginUser = async (body: { email: string; password: string }) => {
  return await fetch(getRouteApi("login"), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const forgotPasswordUser = async (body: { email: string }) => {
  return await fetch(getRouteApi("forgot"), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const resetPasswordUser = async (body: {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}) => {
  return await fetch(getRouteApi("reset-password"), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const verifiedEmail = async (
  token: string,
  params: { expires: string; signature: string; id: number; hash: string }
) => {
  return await fetch(getRouteApi("verified-email", params), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendVerificationEmail = async (token: string) => {
  return await fetch(getRouteApi("send-verified-email"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
