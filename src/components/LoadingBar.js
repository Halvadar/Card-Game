import React from "react";
import styled from "styled-components";

const BarContainer = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  width: 100px;
  transform: translate(-50%, -50%);
  min-width: 10%;
  max-width: 30%;
  padding: 2px;
  height: 10px;
  border-radius: 3px;
  background: gray;
  z-index: 40;
`;
const Progress = styled.div.attrs((props) => ({
  style: {
    width: props.widthProp + "%",
  },
}))`
  height: 100%;
  background: #6ac3ff;
`;

const LoadingBar = ({ currentProgress, progressLength }) => {
  return (
    <BarContainer>
      <Progress widthProp={(currentProgress / progressLength) * 100} />
    </BarContainer>
  );
};

export default LoadingBar;
