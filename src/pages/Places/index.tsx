import { Place } from "./components/PlacesItem";
import * as Dialog from "@radix-ui/react-dialog";
import {
  PlacesButtonContainer,
  PlacesContainer,
  PlacesContent,
  PlacesList,
  PlacesTitleContainer,
  Toggle,
} from "./style";
import { AvaliableModal } from "./components/AvaliableModal";
import { NewPlaceModal, NewPlaceType } from "./components/NewPlaceModal";
import { useContext, useEffect, useState } from "react";
import { ObjectsContext } from "../../contexts/ObjectsContext";
import { API } from "../../lib/axios";

export function Places() {
  const { placesList } = useContext(ObjectsContext);
  const [placeMatchs, setPlaceMatchs] = useState<NewPlaceType[]>([]);
  const [open, setOpen] = useState(false);
  const [animation, setAnimation] = useState(true);
  const [on, setOn] = useState<Boolean>(false);

  /* let animationDelay = 1;

  if (!animation) {
    animationDelay = 0;
  } */

  function closeModal() {
    setOpen(false);
  }

  useEffect(() => {
    handleGetPlaces();
  }, [placesList]);

  async function handleGetPlaces() {
    const resp = await API.get("/ambiente");
    if (resp.status == 200) {
      setPlaceMatchs(resp.data);
    }
  }

  async function handleChangeList(value: Boolean) {
    setOn(value);
    if (value) {
      setPlaceMatchs(placesList.filter((e) => e.ativo == false));
    } else {
      setPlaceMatchs(placesList.filter((e) => e.ativo == true));
    }
  }

  async function searchPlace(value: String) {
    setAnimation(false);
    if (!value) {
      setPlaceMatchs(placesList);
    } else {
      const res = await API.get(`/ambiente/buscapalavra/${value}`);
      setPlaceMatchs(res.data);
    }
  }

  return (
    <PlacesContainer>
      <PlacesContent>
        <PlacesTitleContainer>
          <h1>Ambientes</h1>
          <p>Selecione um Ambiente ou crie um novo!</p>
          <PlacesButtonContainer>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button>Novo ambiente</button>
              </Dialog.Trigger>
              <NewPlaceModal closeModal={closeModal} />
            </Dialog.Root>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button>Disponibilidade</button>
              </Dialog.Trigger>
              <AvaliableModal />
            </Dialog.Root>
          </PlacesButtonContainer>
        </PlacesTitleContainer>
        <input
          type="text"
          placeholder="Busque um ou vários ambientes..."
          onChange={(e) => searchPlace(e.target.value)}
        />
        <Toggle>
          <label>Desativados</label>
          <input
            onChange={(e) => handleChangeList(e.target.checked)}
            type="checkbox"
          />
        </Toggle>
        <PlacesList>
          {placeMatchs.map((place, index) => {
            if (place.ativo && on == false) {
              return (
                <Place
                  key={place.id}
                  placeItem={
                    place
                  } /* placeAnimationDelay={animationDelay+=0.2} */
                />
              );
            } else if (place.ativo == false && on == true) {
              return (
                <Place
                  key={place.id}
                  placeItem={
                    place
                  } /* placeAnimationDelay={animationDelay+=0.2} */
                />
              );
            }
          })}
        </PlacesList>
      </PlacesContent>
    </PlacesContainer>
  );
}
