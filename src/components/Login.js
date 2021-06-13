import React from "react";
import styled, { keyframes, css } from "styled-components";

const LoginContainerAnimation = keyframes`
    from {
        transform:translate(-50%,-30%);
    }
    to{
        transform:translate(-50%,-50%);
    }
`;
const LoginContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  height: 300px;
  width: 300px;
  min-width: 20vw;
  min-height: 20vh;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  animation: 0.5s ${LoginContainerAnimation} forwards ease-out;
`;
const GoogleFacebookAnimation = keyframes`
    from {transform:translateY(30%) scale(1); opacity:0.5;}
    to {transform:translateY(0%) scale(1); opacity:1;}
`;
const GoogleFacebook = styled.div`
  height: 50px;
  width: 250px;
  min-width: 80%;
  min-height: 20%;
  max-width: 100%;
  max-height: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  animation: 1s ${GoogleFacebookAnimation} ease-out;
  cursor: pointer;
  transition: 0.2s transform;
  :active {
    transform: scale(1.02);
    opacity: 0.7;
  }
`;
const Google = styled(GoogleFacebook)`
  background: #f75858;

  color: white;
`;
const Facebook = styled(GoogleFacebook)`
  background: #6eaffa;
  color: white;
`;

const SignIn = styled.div`
  color: #69df69;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10%;
  margin-top: 10%;
`;
const errorAnimation = keyframes`
    0% {opacity:0}
    10%, 90% {opacity:1}
    100% {opacity:0}
`;
const Error = styled.div`
  color: #f35555;
  background: white;
  font-weight: 600;
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0;
  text-align: center;
  z-index: 10;
  animation: ${(props) =>
    props.error ? css`5s ${errorAnimation} forwards ease-in-out` : null};
`;
const Login = ({ facebookLogin, googleLogin, error }) => {
  return (
    <LoginContainer>
      <Error error={error.length > 0}>{error}</Error>
      <SignIn>Sign In</SignIn>
      <Google onClick={googleLogin}>Google</Google>
      <Facebook onClick={facebookLogin}>Facebook</Facebook>
    </LoginContainer>
  );
};

export default Login;
