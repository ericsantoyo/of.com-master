"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth-actions";

type Props = {};

const SignInWithGoogle = (props: Props) => {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        signInWithGoogle();
      }}
    >
      Iniciar sesión con Google
    </Button>
  );
};

export default SignInWithGoogle;
