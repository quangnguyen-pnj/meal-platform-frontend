import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api-error";

/**
 * Giu form state va submit cho trang login. Component chi nhan gia tri + handler.
 * Sau khi login thanh cong, dieu huong vao shell bao ve.
 */
export function useLoginForm(redirectTo = "/dashboard") {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.replace(redirectTo);
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause
          : new ApiError({ code: "unexpected_error", message: "Dang nhap that bai", status: 0 }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    password,
    error,
    isSubmitting,
    setEmail,
    setPassword,
    onSubmit,
  };
}
