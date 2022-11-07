//To DO
//Usar o user Memo para dinumir a redezição desse componente

import * as Dialog from "@radix-ui/react-dialog";
import { Plus, Trash, X } from "phosphor-react";
import { useContext, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ObjectsContext } from "../../../../contexts/ObjectsContext";
import {
  ButtonNewUnidadeCurricular,
  Content,
  FinalButton,
  HeaderButtons,
  InputContainer,
  InputContent,
  InputIndividual,
  InputScroll,
  ModalHeader,
  Overlay,
} from "./style";
import { Notification } from "../../../../components/Notification";

//Varivel de validação
export const coursesInputs = z.object({
  id: z.number().optional(),
  nome: z
    .string()
    .max(30, { message: "* O nome não deve ter mais de 30 caracteres..." })
    .min(3, { message: "* O nome deve ser maior que 3 caracteres..." }),
  tipo: z.enum(["FIC", "REGULAR"]),
  ativo: z.boolean().optional(),
  unidadeCurricular: z
    .object({
      id: z.number().optional().nullable(),
      nome: z
        .string()
        .max(30, { message: "* O nome não deve ter mais de 30 caracteres..." })
        .min(3, { message: "* O nome deve ser maior que 3 caracteres..." }),
      horas: z
        .number({ invalid_type_error: "" })
        .positive({ message: "* Deve ser maior que 6" })
        .gte(6, { message: "* Deve ser maior que 6" }),
    })
    .array(),
});

//Transformando a variavel de validação em uma interface
export type CourseType = z.infer<typeof coursesInputs>;

//Método utilizado para fecha a modal após o submit
interface NewCourseModalProps {
  closeModal: () => void;
}

export default function NewCourseModal({ closeModal }: NewCourseModalProps) {
  const {
    //Variavel para pega o valor dos input
    register,
    //Metodo que é acionado ao fazer o submit do forms
    handleSubmit,
    //Metodo para limpar os campos do formulario
    reset,
    control,
    //Variavel utilizada para acessar os erros do formulario
    formState: { errors },
  } = useForm<CourseType>({
    resolver: zodResolver(coursesInputs),
    defaultValues: {
      unidadeCurricular: [{ nome: "", horas: 0 }],
    },
  });

  //Variavel para usado para exibir a notificaçãp
  const [open, setOpen] = useState(false)

  //Método do context que faz a requisição para API e adiciona o valor no state
  const { createCourseAPI } = useContext(ObjectsContext);

  //Variavel para criar a logica de adicionar uma nova unidade curricular
  const { fields, append, remove } = useFieldArray({
    name: "unidadeCurricular",
    control,
    rules: {
      required: "O curso deve ter pelo menos uma unidade curricular",
    },
  });

  function firstLetterUppercase(value: string) {
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    return value;
  }

  //Criando o curso e setando a primeira letra em maiusculo
  function handleCreateNewCourse(data: CourseType) {
    createCourseAPI(data);
    reset();
    closeModal();
    setOpen(true)
  }

  function openNotificantionMethod(){
    setOpen(false)
  }

  return (
    <>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <ModalHeader>
            <Dialog.Title>Novo curso</Dialog.Title>
            <HeaderButtons>
              <Dialog.Close>
                <X size={50} weight="light" />
              </Dialog.Close>
            </HeaderButtons>
          </ModalHeader>

          <form onSubmit={handleSubmit(handleCreateNewCourse)}>
            <InputScroll>
              <InputContainer>
                <InputContent>
                  <label>Nome</label>
                  <input
                    type="text"
                    placeholder="Digite seu nome"
                    required
                    {...register("nome", {
                      required: true,
                      setValueAs: (v) => firstLetterUppercase(v),
                    })}
                  />
                  {errors.nome && <p>{errors.nome.message}</p>}
                </InputContent>
                <InputContent>
                  <label>Tipo</label>
                  <select
                    {...register("tipo", { required: true })}
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      Selecione o tipo do ambiente
                    </option>
                    <option value="FIC">FIC</option>
                    <option value="REGULAR">Regular</option>
                  </select>
                  {errors.tipo && <p>* Selecione um valor válido...</p>}
                </InputContent>
                {fields.map((field, index) => {
                  return (
                    <InputContent key={field.id}>
                      <InputIndividual>
                        {/* aparecer a label apenas no primeiro componente, validar com o time */}
                        {/* {index == 0 ? <label>Unidade Curricular</label> : <></>} */}
                        <label>Unidade Curricular</label>
                        <input
                          type="text"
                          placeholder="Digite a unidade curricular"
                          required
                          {...register(`unidadeCurricular.${index}.nome`, {
                            required: true,
                            setValueAs: (v) => firstLetterUppercase(v),
                          })}
                        />
                        {errors.unidadeCurricular && (
                          <p>
                            {errors.unidadeCurricular[index]?.nome?.message}
                          </p>
                        )}
                      </InputIndividual>
                      <InputIndividual>
                        {/* {index == 0 ? <label>Horas</label> : <></>} */}
                        <label>Horas</label>
                        <input
                          type="number"
                          placeholder="Digite as horas"
                          required
                          {...register(`unidadeCurricular.${index}.horas`, {
                            valueAsNumber: true,
                            required: true,
                          })}
                        />
                        {errors.unidadeCurricular && (
                          <p>
                            {errors.unidadeCurricular[index]?.horas?.message}
                          </p>
                        )}
                      </InputIndividual>
                      {index !== 0 && (
                        <Trash
                          size={40}
                          weight="light"
                          onClick={() => remove(index)}
                        />
                      )}
                    </InputContent>
                  );
                })}
                <ButtonNewUnidadeCurricular
                  onClick={() => {
                    append({
                      nome: "",
                      horas: 6,
                    });
                  }}
                  type="button"
                >
                  <Plus size={32} />
                  <p>Adicionar unidade curricular</p>
                </ButtonNewUnidadeCurricular>
                <FinalButton>
                  <button>Criar</button>
                </FinalButton>
              </InputContainer>
            </InputScroll>
          </form>
        </Content>
       
      </Dialog.Portal>

      <Notification description="Criado com sucesso" title="Usuário criado" openNotification={open} openNotificationMethod={openNotificantionMethod}/>
    </>
  );
}

// 25/10/2022 - Adicionar focus ao dar erro nos inputs...
