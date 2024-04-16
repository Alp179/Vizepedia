import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";

import FormRow from "../../ui/FormRow";
import { useLogin } from "./useLogin";

import SpinnerMini from "../../ui/SpinnerMini";
import { useDarkMode } from "./path/to/DarkModeContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit} theme={darkMode ? "dark-mode" : "light-mode"}>
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
        Vizepedia ya Hoş Geldiniz
      </div>
      <div style={{ textAlign: "center", fontSize: "16px" }}>
        Vize alma sürecindeki karmaşıklığı ortadan kaldırmak için buradayız!
        Akıcı ve kolay bir vize başvuru deneyimi için hazır olun.
      </div>
      <FormRow orientation="vertical" label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </FormRow>

      <FormRow orientation="vertical" label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </FormRow>
      <FormRow orientation="vertical">
        <Button size="login" disabled={isLoading}>
          {!isLoading ? "Login" : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default LoginForm;
