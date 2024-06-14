import { LoginForm } from "./components/LoginForm";

type Props = {};

const LoginPage = (props: Props) => {
  return (
    <div className="flex h-svh items-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
