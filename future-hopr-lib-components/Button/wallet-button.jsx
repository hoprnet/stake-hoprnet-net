import React from 'react';
import styled from "@emotion/styled";
import MuiButton from "@mui/material/Button";

const SButton = styled(MuiButton)`
    width: 100%;
    background-color: rgb(241,241,241);
    img{
        height: 48px;
    }

`


export default function Button(props) {

    function src () {
        console.log(props.wallet);
        switch(props.wallet){
            case 'metamask': return './assets/wallets/MetaMask-Emblem.svg'
            default: return ''
        }
    }

    return (
        <SButton
            className={props.className}
            {...props}
        >
          <img
            src={props.src ? props.src : src()}
          />
        </SButton>
    )
}