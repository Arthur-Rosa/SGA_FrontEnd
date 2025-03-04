import { fromUnixTime, toDate } from "date-fns"
import { createContext, ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { API } from "../lib/axios"
import { useLocation } from 'react-router-dom'

export interface LoginProps {
  nif: string,
  senha: string,
}


interface AuthContextType {
  autheticated: boolean
  login: (data: LoginProps) => void
  logout: () => void
  userAutheticated: UserType
}


interface AuthProviderProvideProps {
  children: ReactNode
}

export const userInput = z.object({
  id: z.string(),
  nif: z.string().min(3, { message: "* Deve ter mais de 3 caracteres..." }),
  nome: z.string().max(30, { message: "* O nome não deve ter mais de 20 caracteres..." }),
  email: z.string().email({ message: "* Informe um email válido..." }),
  senha: z.string().optional(),
  tipoUsuario: z.string().optional()
})

export type UserType = z.infer<typeof userInput>;

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProvideProps) {
  const [autheticated, setAutheticated] = useState(false)
  const [userAutheticated, setuserAutheticated] = useState<UserType>({
    email: "", nome: "", senha: undefined, nif: "", id: ""
  });
  const today = new Date()
  const navigate = useNavigate()
  const paginaAtual = useLocation()
  console.log(paginaAtual.pathname)
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const object = JSON.parse(atob(token.split('.')[1]))
      if (fromUnixTime(object.exp) > today) {
        setuserAutheticated(object)
        setAutheticated(true)
        paginaAtual.pathname === "/" &&
        navigate('/inicio', { replace: true })
      } else {
        localStorage.removeItem("token")
      }
    }
  }, [autheticated])

  async function login(user: LoginProps) {
    const { nif, senha } = user

    const { data: { token } } = await API.post('usuario/login', {
      nif,
      senha

    })

    if (token !== null) {
      localStorage.setItem('token', JSON.stringify(token))
      setAutheticated(true)
      API.defaults.headers.common['Authorization'] = token;
      navigate('/inicio', { replace: true })
    }
  }

  async function logout() {
    setAutheticated(false)
    localStorage.removeItem('token')
    delete API.defaults.headers.common['Authorization']
    navigate('/', { replace: true })
  }

  return (
    <AuthContext.Provider value={
      {
        login,
        autheticated,
        logout,
        userAutheticated
      }}>
      {children}
    </AuthContext.Provider>
  )
}