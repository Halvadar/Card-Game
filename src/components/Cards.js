import React from "react";
import styled from "styled-components";
import Loading from "../public/Loading.svg";
import LoadingBar from "./LoadingBar";
const CardsContainer = styled.div`
  padding: 4px;
  margin-top: 20px;
  flex-grow: 1;
  display: grid;

  @media (min-width: 500px) {
    grid-template-columns: repeat(4, minmax(100px, 1fr));
    grid-template-rows: repeat(3, 1fr);
  }
  @media (min-width: 1000px) {
    grid-template-columns: repeat(4, 150px);
    grid-template-rows: repeat(3, minmax(1fr, 250px));
  }
  @media (min-width: 1500px) {
    grid-template-columns: repeat(6, 150px);
    grid-template-rows: repeat(2, minmax(1fr, 250px));
  }
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  align-items: stretch;
  justify-content: center;
  grid-gap: 4px;
`;
export const LoadingImg = styled.object.attrs((props) => ({
  data: props.srcProp,
  type: "image/svg+xml",
}))`
  position: fixed;
  left: 50%;
  top: 50%;
  width: 5%;
  transform: translate(-50%, -50%);
`;
const Start = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10%;
  border: 1px solid black;
  border-radius: 3px;
  padding: 15px;
  color: #006eff;
  font-size: 1.5rem;
  font-weight: 600;
  background: #b0ffb0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  cursor: pointer;
  :active {
    background: #d5ffd5;
  }
`;
const Cards = (props) => {
  return (
    <>
      {props.loading ? (
        props.imageLoadingProgress !== props.progressLength ? (
          <LoadingBar
            currentProgress={props.imageLoadingProgress}
            progressLength={props.progressLength}
          ></LoadingBar>
        ) : (
          <LoadingImg srcProp={Loading} />
        )
      ) : (
        !props.started && (
          <Start onClick={() => props.start()}>
            {props.shouldContinue ? "Continue" : "Start"}
          </Start>
        )
      )}

      <CardsContainer loadingProp={props.loading}>
        {props.children}
      </CardsContainer>
    </>
  );
};

export default Cards;
