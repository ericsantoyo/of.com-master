import { LoginForm } from "./components/LoginForm";

type Props = {};

const LoginPage = (props: Props) => {
  return (
    <div className="flex my-12 items-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
