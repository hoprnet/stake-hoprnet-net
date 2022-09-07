import React from 'react';
import styled from "@emotion/styled";
import Image from 'next/image'
import Logo from './logo.svg'

const SNavBar = styled.div`
  height: 68px;
  position: fixed;
  top: 0;
  width: 100vw;
  background: white;
  z-index: 10;
`

const Container = styled.div`
  height: 100%;
  max-width: 1096px;
  margin: auto;
  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;
`

const LogoImage = styled.img`
  height: 50px;
  width: auto;
`

const RightButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`


const NavBar = (props) => {
  return (
    <SNavBar>
      <Container>
        <LogoImage
          alt="Hopr logo"
          src={'/hopr_logo.svg'}
        />
        <RightButtons>
          {props.rightButtons}
        </RightButtons>
      </Container>
    </SNavBar>
  );
};

export default NavBar;
