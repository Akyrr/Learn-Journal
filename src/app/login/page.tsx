import { redirect } from "next/navigation";
import { hasWriteSession } from "@/lib/auth";
import { safeNextPath } from "@/lib/redirect";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : null);

  if (await hasWriteSession()) redirect(next);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <div className="text-center">
        <h1 className="m3-headline-small text-on-surface">Writing mode</h1>
        <p className="m3-body-medium mt-1 text-on-surface-variant">
          Reading is open to everyone. Enter the password to create or edit entries.
        </p>
      </div>
      <LoginForm next={next} />
    </div>
  );
}
