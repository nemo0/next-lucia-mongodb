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

    const user = await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: email,
        password,
      },
      attributes: {
        email,
      },
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {
        email: user.providerUserId,
      },
    });

    const authRequest = await auth.handleRequest(req.method, context);
    authRequest.setSession(session);

    return new Response(
      JSON.stringify({
        message: "User created",
      }),
      {
        status: 201,
        headers: {
          Location: "/",
        },
      }
    );
  } catch (e: any) {
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
