import Image from "next/image";
import styles from "./page.module.css";
import { auth } from "@/auth/lucia";
import * as context from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const authRequest = auth.handleRequest("GET", context);
  const session = (await authRequest.validate()) ?? null;
  if (!session) redirect("/login");
  return (
    <main>
      {session ? (
        <div>
          <h1>Home</h1>
          <code>{JSON.stringify(session)}</code>
        </div>
      ) : (
        <div>
          <h1>Home</h1>
          <p>
            <a href="/login">Login</a>
          </p>
          <p>
            <a href="/signup">Sign up</a>
          </p>
        </div>
      )}
    </main>
  );
}
