import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";

import { Table } from '../Table/columed-data'

// * {
//     margin:0;
//     padding:0;
//     outline:none;
//     list-style:none;
//     text-decoration:none;
//     box-sizing:border-box;
//     color:#000;
//     background: transparent;
//     border:none;
// }

// html, body {
//     height: 100%;
//     width: 100%;  
// }

// body {
//     background: #202020;
//     font-family: 'Roboto', sans-serif;
// }

const Container = styled.div`

    .transition(@transition) {
        transition:         @transition;
        -webkit-transition: @transition;
        -moz-transition:    @transition;
        -ms-transition:     @transition;
        -o-transition:      @transition;
    }

    width: 230px;
    height: 325px;
    max-width:1280px;
    margin:0 auto;
    text-align:center;
    position: relative;

    .perspective {
        width: 100%;
        height: 100%;
        perspective: 1000px;
        transform-style: preserve-3d;
        overflow: hidden;
    }

    .nft-front {
        height: 100%;
        width: 100%;
        transform-style:preserve-3d;
        .transition(all ease-out 0.6s);
        &.rotate {
            transform:rotateY(20deg) scale(0.97);
        }
        &.flip {
            transform:rotateY(180deg);
        }
    }

    .nft {
        width: 230px;
        height: 325px;
        background: no-repeat center center;
        background-size: contain;
        position: absolute;
        top: 0;left: 0;right: 0;bottom: 0;
        margin: auto;
        cursor:pointer;
    }

    .title {
        content: "";
        width: 230px;
        width: 30px;
        position: absolute;
        right: 0;
        left: -401px;
        top: 0;
        bottom: 0;
        margin: auto;
        background: #AB4747;
        transform: rotateY(-80deg) translateX(-14px);
    }

    .nft-back {
        width: 230px;
        height: 325px;
        background-color: #e3e5e7;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        cursor:pointer;
        transform:rotate(180deg) translateZ(-30px) translateX(5px);
        .text {
            transform: rotateX(180deg);
            position: absolute;
            bottom: 30px;
            padding: 20px;
            text-align:left;
            h3 {
            margin-bottom: 20px;
            color:#fff;
        }
        span {
            display: block;
            margin-bottom:20px;
            color:#fff;
            &:last-of-type {
                margin-top:30px;
            }
        }
    }
`


export default function NftImageInteractive(props) {
    const [fliped, set_fliped] = useState(false);
    const [rotated, set_rotated] = useState(false);

    return (
        <Container className="wrap">
            <div 
                className="perspective"
                onMouseEnter={()=>{set_rotated(true)}}
                onMouseLeave={()=>{set_rotated(false)}}
            >
                <div 
                    className={[
                        "nft-front",
                        fliped ? 'flip' : '',
                        rotated ? 'rotate' : '',
                    ].join(' ')}
                >
                    <div 
                        className="nft"
                        style={{backgroundImage: `url("${props.image}")`}}
                        onClick={()=>{set_fliped(true)}}
                    />
                    <div className="title"></div>
                    <div 
                        className="nft-back"
                        onClick={()=>{set_fliped(false)}}
                    >
                        <Table 
                            width1stColumn="65"
                            className="text"
                        >
                            <tbody>
                                <tr>
                                    <th>ID</th>
                                    <td>{props.nft.id}</td>
                                </tr>
                                <tr>
                                    <th>Boost</th>
                                    {
                                        props.nft.ignored ? 
                                        <td>Ignored</td>
                                        :
                                        <td>{(props.nft.boost*100).toFixed(2)}%</td>
                                    }
                                </tr>
                                <tr>
                                    <th>Boost Rate</th>
                                    {
                                        props.nft.ignored ? 
                                        <td>Ignored</td>
                                        :
                                        <td>{(props.nft.boostRate).toFixed(2)}</td>
                                    }
                                </tr>

                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </Container>
    )
}