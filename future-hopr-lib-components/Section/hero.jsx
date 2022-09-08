import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";

import Section from './index.jsx'
import Typography from '../Typography/index.jsx'
import Button from '../Button/index.jsx'

import animation from '../../assets/network-registry-animation.json';
import lottie from "lottie-web";

const SSection = styled(Section)`
  padding-bottom: 80px;
  padding-top: 0;
`

const ImageContainer = styled.div`
  max-width: 780px;
  width: 100%;
  min-height: 100px;
  position: relative;
  display: flex;
  justify-content: center;
`

const Animation = styled.div`
    width: 100%;
    max-width: 760px;
    position: absolute;
    top: -21px;
`

const Subtext = styled(Typography)`
  max-width: 640px;
`

function Section1(props) {

    const animationLoaded = useRef(false);
    useEffect(() => {
        // check to prevent double animation load on page remount
        if (!animationLoaded.current) {
            lottie.loadAnimation({
                container: document.querySelector(`#derp-animation`),
                animationData: animation,
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
                Network Registry
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
