import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import Menu from "../public/Menu.svg";
import { Person, SignOut } from "./Info";

const BurgerNavContainer = styled.div`
  position: fixed;
  transition: height 1s ease, width 1s ease, border-radius 1s ease;
  background: #c4ffff;
  width: ${(props) => {
    return props.menuActivated ? "400px" : "100px";
  }};
  height: ${(props) => {
    return props.menuActivated ? "400px" : "100px";
  }};

  transform: translate(-50%, -50%);
  left: 0;
  top: 0;
  border-radius: ${(props) => (props.menuActivated ? "0%" : "50%")} !important;
  z-index: 30;
  cursor: pointer;
`;
const Icon = styled.img.attrs((props) => ({
  src: props.src,
}))`
  position: fixed;
  left: 3px;
  top: 3px;
  width: 1.5rem;
  z-index: 40;
  cursor: pointer;
`;
const InfoDiv = styled.div`
  opacity: ${(props) => (props.menuActivated ? 1 : 0)};
  transform: ${(props) =>
    props.menuActivated ? "translate(0%,0%)" : "translate(-150%,-200%)"};
  transition: opacity 1s, transform 1s;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 2rem;
  left: 3rem;
  z-index: 50;
  border: 0px !important;
  gap: 10px;
`;

const BurgerNav = ({ currentUser, signOut }) => {
  const [menuActivated, setMenuActivated] = useState(false);
  return (
    <>
      <BurgerNavContainer
        menuActivated={menuActivated}
        onClick={() => setMenuActivated(!menuActivated)}
      ></BurgerNavContainer>
      <Icon onClick={() => setMenuActivated(!menuActivated)} src={Menu}></Icon>
      <InfoDiv menuActivated={menuActivated}>
        <Person>{currentUser}</Person>
        <SignOut onClick={() => signOut()}> Sign out</SignOut>
      </InfoDiv>
    </>
  );
};

export default BurgerNav;
