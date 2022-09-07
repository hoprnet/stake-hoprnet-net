import React from 'react';
import styled from "@emotion/styled";
import GrayButton from '../Button/gray.jsx'

const SBanner = styled.section`
  background: linear-gradient(#000050,#0000b4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding-right: 8px;
  padding-left: 8px;
  padding: 10px;
  @media (max-width: 600px) {
    button {
      font-size: 14px;
    }
  }
  @media (max-width: 440px) {
    flex-direction: column;
    gap: 5px;
  }
`

const Text = styled.div`
    font-family: 'Source Code Pro';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 38px;
    letter-spacing: 0.25px;
    color: #FFFFFF;
      @media (max-width: 600px) {
        font-size: 14px;
        button {
          font-size: 14px;
        }
      }
`

const Banner = (props) =>
    <SBanner>
        <Text>Add the DERP RPC endpoint to your crypto wallet</Text>
        <GrayButton
            variant="contained"
            onClick={props.onButtonClick}
        >SETUP</GrayButton>
    </SBanner>

export default Banner;
