import * as Dialog from "@radix-ui/react-dialog";
import { CalendarX, DotsThree, Trash } from "phosphor-react";
import { AbsenseProps } from "../..";
import { AbsenseInfoType } from "../../components/AbsenseItem/style";
import { EditAbsenceTeacherModal } from "../EditAbsenceTeacherModal";

import {
  AbsenseItemButton,
  AbsenseItemButtonContainer,
  AbsenseItemContainer,
  AbsenseItemIcon,
  AbsenseItemInfoContainer,
  AbsenseItemInfoContent,
} from "./style";

interface AbsenseItemProps {
 absenceList: AbsenseProps
}

export function AbsenseItem({absenceList} : AbsenseItemProps) {

  return (
    <AbsenseItemContainer>
      <AbsenseItemInfoContainer>
        <AbsenseItemIcon>
          <CalendarX size={32} />
        </AbsenseItemIcon>

        <AbsenseItemInfoContent>
          <AbsenseInfoType>{absenceList.tipo}</AbsenseInfoType>
          <p> Data: <span>07/09/2022 - 09/09/2022</span></p>
        </AbsenseItemInfoContent>
      </AbsenseItemInfoContainer>

      <AbsenseItemButtonContainer>
        <Dialog.Root>
          <Dialog.Trigger
            style={{
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
            }}
          >
            <AbsenseItemButton buttonColor="edit">
              <DotsThree color="#fff" size={32} />
            </AbsenseItemButton>
          </Dialog.Trigger>

          <EditAbsenceTeacherModal />
        </Dialog.Root>
        <AbsenseItemButton buttonColor="delete">
          <Trash color="white" size={26} />
        </AbsenseItemButton>
      </AbsenseItemButtonContainer>
    </AbsenseItemContainer>
  );
}
