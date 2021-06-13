import React from "react";
import styled from "styled-components";

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  grid-column: 1/-1;
  padding: 10px;
  align-items: center;
  border: 1px solid #03d9ff;
  border-radius: 3px;
`;
export const Person = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #575757;
`;
export const SignOut = styled.div`
  width: max-content;
  background: #ff6464;
  color: white;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  border-radius: 3px;
`;

const Info = ({ currentUser, signOut }) => {
  return (
    <InfoContainer>
      <Person>{currentUser}</Person>
      <SignOut onClick={() => signOut()}>Sign Out</SignOut>
    </InfoContainer>
  );
};
export default Info;
