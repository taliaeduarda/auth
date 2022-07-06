import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies } from "nookies";
import { useRouter } from "next/router";
import { api } from "../services/api";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};
type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api.get("/me").then((response) => {
        const { email, permissions, roles } = response.data;

        setUser({ email, permissions, roles });
      });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;
      // recebe 3 parametros, o primeiro é o contexto da requisição, mas esse contexto não vai exister quuando a aplicação estiver rodando pelo browser, e a função de signIn é executada no browser, quando o usuário clica no botão de submit, ele nunca acontece via server side dentro do next
      // o segundo é o nome do cookie
      // por ultimo, o valor do token
      // é possivel passar mais
      setCookie(undefined, "nextauth.token", token, {
        // por quanto tempo eu quero manter esse token salvo no meu navegador
        // apesar de mto tempo, o backend vai verificar e gerar um novo token, o front end/ browser n precisa ter a responsabilidade de remover o token dos cookies caso ele esteja expirado, essa é um responsabilidade do backend
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: "/",
        // path: quais caminhos da minha aplicação vão ter acesso a esse cookie
      });

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      setUser({
        email,
        permissions,
        roles,
      });

      router.push("/dashboard");
    } catch (err) {
      console.log("err", err);
    }
  }
  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}
