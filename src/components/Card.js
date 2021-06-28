import React from "react";
import styled from "styled-components";
import Konoha from "../public/Konoha.svg";

const CardSide = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  transition: 0.5s transform ease;
  backface-visibility: hidden;
  top: 0;
  left: 0;
`;
const CardBack = styled(CardSide)`
  background: #84abf3;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: ${(props) => {
    return props.flipped ? "rotateY(180deg)" : null;
  }};
`;
const CardFront = styled(CardSide)`
  transform: rotateY(-180deg);
  background: red;
  transform: ${(props) => {
    return props.flipped ? "rotateY(0deg)" : null;
  }};
`;
const CardContainer = styled.div`
  border-radius: 3px;
  overflow: hidden;
  width: 100%;
  max-height: 50vh;
  position: relative;
  cursor: pointer;
  visibility: ${(props) => props.loadingProp && "hidden"};
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.19), 3px 3px 6px rgba(0, 0, 0, 0.23);
`;
const StyledImage = styled.img.attrs((props) => ({
  src: props.srcProp,
  alt: props.altProp,
}))`
  margin: auto;
  display: block;
  width: 30%;
`;
const StyledFrontImage = styled.img.attrs((props) => ({
  src: props.srcProp,
  alt: props.altProp,
}))`
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: 50% 20%;
`;

const Card = ({
  imageSrc,
  flipped,
  index,
  onCardClickFunction,
  setImageLoaded,
  loading,
}) => {
  const onLoadFunction = () => {
    setImageLoaded((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  };

  return (
    <CardContainer
      loadingProp={loading}
      onClick={() => onCardClickFunction(index)}
    >
      <CardBack flipped={flipped}>
        <StyledImage srcProp={Konoha} altProp={"Konoha"} />
      </CardBack>
      <CardFront flipped={flipped}>
        <StyledFrontImage
          onLoad={onLoadFunction}
          srcProp={imageSrc}
        ></StyledFrontImage>
      </CardFront>
    </CardContainer>
  );
};

export default Card;
