import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { API } from "../../lib/axios";
import { AdminItem } from "./components/AdminItem";
import { NewAdminModal } from "./components/NewAdminModal";
import {
  AdminButtonContainer,
  AdminContainer,
  AdminContent,
  AdminList,
  AdminTitleContainer,
} from "./style";

export interface AdminProps {
  id: string;
  nome: string;
  email: string;
  nif: string;
  tipoCurso: string;
  senha: string;
  ativo: string;
}
[];

export function Admin() {
  const [admin, setAdmin] = useState<AdminProps[]>([]);
  const [adminMatches, setAdminMatches] = useState<AdminProps[]>([]);
  const [open, setOpen] = useState(false);

  function closeModal() {
    setOpen(false);
  }
  

  async function fetchAdmin() {
    const res = await API.get("usuario");

    console.log(res.data);
    setAdmin(res.data);
    setAdminMatches(res.data);
  }

  useEffect(() => {
    fetchAdmin();
  }, []);

  const searchAdmin = (text: String) => {
    if (!text) {
      setAdminMatches(admin)
    } else {
      let matches = admin.filter((admin) => {
        const regex = new RegExp(`${text}`, "gi");
        return admin.nome.match(regex) || admin.nif.match(regex);
      });
      setAdminMatches(matches);
    }
  };

  return (
    <AdminContainer>
      <AdminContent>
        <AdminTitleContainer>
          <h1>Administradores</h1>
          <p>Chamadas realizadas no momento</p>
          <AdminButtonContainer>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger>
                Novo administrador
              </Dialog.Trigger>
              <NewAdminModal closeModal={closeModal}/>
            </Dialog.Root>
          </AdminButtonContainer>
        </AdminTitleContainer>
        <input
          type="text"
          placeholder="Buscar por Ambiente"
          onChange={(e) => searchAdmin(e.target.value)}
        />
        <AdminList>
          {adminMatches.map((admin) => (
            <AdminItem key={admin.id} admin={admin} />
          ))}
        </AdminList>
      </AdminContent>
    </AdminContainer>
  );
}
