import * as Dialog from "@radix-ui/react-dialog";
import { NotePencil, Plus, Trash, X } from "phosphor-react";
import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CourseProps,
  ObjectsContext,
} from "../../../../contexts/ObjectsContext";
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
import { coursesInputs } from "../NewCourseModal";

interface EditCourseModalProps {
  course: CourseProps;
  closeModal: () => void;
}

export type CourseType = z.infer<typeof coursesInputs>;

export function EditCourseModal({ course, closeModal }: EditCourseModalProps) {
  const [editable, setEditable] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CourseType>({
    resolver: zodResolver(coursesInputs),
    defaultValues: {
      unidadeCurricular: course.unidadeCurricular,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "unidadeCurricular",
    control,
    rules: {
      required: "O curso deve ter pelo menos uma unidade curricular",
    },
  });

  const { updateCourses } = useContext(ObjectsContext);

  function firstLetterUppercase(value: string) {
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    return value;
  }

  async function handleUpdateCourse(data: CourseType) {
    data.ativo = true;
    updateCourses(data);
    closeModal();
  }

  return (
    <Dialog.Portal>
      <Overlay />
      <Content onCloseAutoFocus={() => setEditable(false)}>
        <ModalHeader>
          <Dialog.Title>{!editable ? "Curso" : "Editar curso"}</Dialog.Title>
          <HeaderButtons>
            {!editable && (
              <button onClick={() => setEditable(true)}>
                <NotePencil size={50} weight="light" />
              </button>
            )}
            <Dialog.Close>
              <X size={50} weight="light" onClick={() => reset()} />
            </Dialog.Close>
          </HeaderButtons>
        </ModalHeader>

        <form onSubmit={handleSubmit(handleUpdateCourse)}>
          <input
            type="hidden"
            value={course.id}
            {...register("id", { valueAsNumber: true })}
          />
          <InputScroll>
            <InputContainer>
              <InputContent disabled={"on"}>
                <label>Nome</label>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  required
                  defaultValue={course.nome}
                  {...register("nome", {
                    required: true,
                    setValueAs: (v) => firstLetterUppercase(v),
                  })}
                  readOnly={!editable}
                />
                {errors.nome && <p>{errors.nome.message}</p>}
              </InputContent>
              <InputContent disabled={!editable ? "disabled" : "on"}>
                <label>Tipo</label>
                <select
                  defaultValue={course.tipo}
                  {...register("tipo", { required: true })}
                >
                  <option value="FIC">FIC</option>
                  <option value="REGULAR">Regular</option>
                </select>
                {errors.tipo && <p>* Selecione um valor válido...</p>}
              </InputContent>
              {fields.map((field, index) => {
                return (
                  <InputContent key={field.id} disabled={"on"}>
                    <InputIndividual>
                      <label>Unidade Curricular</label>
                      <input
                        type="text"
                        placeholder="Digite a unidade curricular"
                        required
                        defaultValue={course.unidadeCurricular[index]?.nome}
                        {...register(`unidadeCurricular.${index}.nome`, {
                          required: true,
                          setValueAs: (v) => firstLetterUppercase(v),
                        })}
                        readOnly={!editable}
                      />
                      {errors.unidadeCurricular && (
                        <p>{errors.unidadeCurricular[index]?.nome?.message}</p>
                      )}
                    </InputIndividual>
                    <InputIndividual>
                      <label>Horas</label>
                      <input
                        type="number"
                        placeholder="Digite as horas"
                        required
                        {...register(`unidadeCurricular.${index}.horas`, {
                          valueAsNumber: true,
                          required: true,
                        })}
                        readOnly={!editable}
                      />
                      {errors.unidadeCurricular && (
                        <p>{errors.unidadeCurricular[index]?.horas?.message}</p>
                      )}
                    </InputIndividual>
                    {index >= course.unidadeCurricular.length && editable && (
                      <Trash
                        size={40}
                        weight="light"
                        onClick={() => remove(index)}
                      />
                    )}
                    <input
                      type="hidden"
                      {...register(`unidadeCurricular.${index}.id`, {
                        value:
                          course.unidadeCurricular[index]?.id == undefined
                            ? null
                            : course.unidadeCurricular[index].id,
                      })}
                    />
                  </InputContent>
                );
              })}
              {editable && (
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
              )}

              {editable && (
                <FinalButton>
                  <button>Editar</button>
                </FinalButton>
              )}
            </InputContainer>
          </InputScroll>
        </form>
      </Content>
    </Dialog.Portal>
  );
}
