import styled from "styled-components";

export const DashContainer = styled.main`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const DashContent = styled.div`
  max-width: 1120px;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;

  input {
    height: 3.75rem;
    margin-top: 4.313rem;
    padding-left: 1.813rem;

    border: none;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 0px 4px 10px 3px rgba(0, 0, 0, 0.1);

    color: ${(props) => props.theme["black"]};
    font-weight: 700;
    font-size: 1rem;

    &:placeholder {
      font-weight: 500;
      color: ${(props) => props.theme["sub-title"]};
    }
  }
`;

export const DashButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;

  button {
    width: 12.75rem;
    height: 3.75rem;

    border-radius: 8px;
    border: none;
    background-color: ${(props) => props.theme["blue-500"]};

    color: ${(props) => props.theme["white"]};
    font-size: 1.125rem;
    font-weight: bold;
  }
`;
export const DashTitleContainer = styled.div`
  margin-top: 2rem;

  justify-content: center;
  text-align: center;
  align-items: center;
  flex-direction: column;

  h1 {
    margin: 0.5rem;

    font-size: 2.813rem;
    font-weight: 800;
    color: ${(props) => props.theme["blue-500"]};
  }

  p {
    font-size: 1.125rem;

    font-weight: 800;
    color: ${(props) => props.theme["sub-title"]};
  }
`;

export const DashList = styled.section`
  margin-top: 2rem;
  margin-bottom: 3rem;
`;

export const DashboardContent = styled.div`
  display: grid;
  flex-direction: column;
  grid-template-columns: 70% 30%;

  margin-top: 50px;
`;

export const DashLeftBoard = styled.div``;

export const DashRightBoard = styled.div``;

export const FirstBlock = styled.div`
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 9px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  padding: 30px;
`;

export const FirtTextBlock = styled.div`
  h3 {
    font-weight: 700;
    font-size: 25px;
    line-height: 29px;
    color: ${(props) => props.theme["blue-500"]};
  }
  p {
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    margin-top: 20px;
  }
`;

export const FirstSelectBlock = styled.div`
  margin-left: auto;
  select {
    border-radius: 8px;
    padding: 10px;

    margin-left: 20px;
    font-weight: bold;
    border: none;
    box-shadow: 0px 4px 10px 3px rgba(0, 0, 0, 0.1);
  }
`;

export const BlockText = styled.div`
  display: flex;
`;

export const BlockBoard = styled.div`
  height: 300px;
`;

export const BlockDescription = styled.div``;

export const HoursWorkedDescription = styled.div<SubtitleProps>`
  justify-content: space-between;
  display: flex;

  h5 {
    color: ${(props) => props.theme[SUBTITLE[props.subTitleColor]]};
  }

  span {
    display: block;
    height: 20px;
    width: 20px;
    background-color: ${(props) => props.theme[SUBTITLE[props.subTitleColor]]};
  }
`;

const SUBTITLE = {
  1: "blue-400",
  2: "gray-700",
} as const;

interface SubtitleProps {
  subTitleColor: keyof typeof SUBTITLE;
}
