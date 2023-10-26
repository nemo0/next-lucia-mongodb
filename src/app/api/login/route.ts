import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { LuciaError } from "lucia";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {
  try {
    mongoose.connect("mongodb://localhost:27017/lucia" as string);

    const data = await req.json();
    const { email, password } = data;

    const key = await auth.useKey("email", email.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {
        email: key.providerUserId,
      },
    });

    const authRequest = await auth.handleRequest(req.method, context);
    authRequest.setSession(session);

    return new Response(
      JSON.stringify({
        message: "User logged in",
      }),
      {
        status: 200,
        headers: {
          Location: "/",
        },
      }
    );
  } catch (e: any) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      // user does not exist or invalid password
      return NextResponse.json(
        {
          error: "Incorrect username or password",
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        error: "An unknown error occurred",
      },
      {
        status: 500,
      }
    );
  }
};
