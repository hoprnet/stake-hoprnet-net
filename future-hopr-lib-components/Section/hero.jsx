import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";

import Section from './index.jsx'
import Typography from '../Typography/index.jsx'
import Button from '../Button/index.jsx'

import derpAnimation from '../../assets/derp-animation.json'
import lottie from "lottie-web";

const SSection = styled(Section)`
  padding-bottom: 80px;
  padding-top: 0;
`

const ImageContainer = styled.div`
  max-width: 780px;
  width: 100%;
  position: relative;
`

const Animation = styled.div`
  max-width: 400px;
  max-height: 400px;
  width: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
`

const Subtext = styled(Typography)`
  max-width: 640px;
`

const HoprBall = styled.div`
  background-color: #FFFFA0;
  width: 100%;
  max-height: 390px;
  height: 100%;
`

function Section1(props) {

    const animationLoaded = useRef(false);
    useEffect(() => {
        // check to prevent double animation load on page remount
        if (!animationLoaded.current) {
            lottie.loadAnimation({
                container: document.querySelector(`#derp-animation`),
                animationData: derpAnimation,
            });
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
        animationLoaded.current = true;
    }, []);

    return (
        <SSection
            id={'Section1'}
            gradient
            center
        >
            <ImageContainer >
                <svg 
                version="1.1" 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 50"
                >
                    <circle cx="50" cy="-8" r="50" fill="#FFFFA0"/>
                </svg>

                <Animation id='derp-animation' />
            </ImageContainer>

            <Typography type="h2">
                Node Registry
            </Typography>
{/* 
            <Subtext center>
                Add the DERP RPC endpoint to your crypto wallet to see exactly what information is being leaked about you every time you connect to a crypto service.
            </Subtext>

            <Button
                hopr
                onClick={props.setShowSetup}
            >
                SETUP
            </Button> */}


        </SSection>
    );
}

export default Section1;
