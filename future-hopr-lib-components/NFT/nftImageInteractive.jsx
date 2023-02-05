import React, { useState } from 'react';
import styled from "@emotion/styled";
import { onNotSelectingClick } from '../../utils/functions-react'
import { Table } from '../Table/columed-data'

const Container = styled.div`

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
        transition: all ease-out 0.4s;
        &.rotate {
            transform:rotateY(20deg) scale(0.965) translateX(10px);
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

    .spine {
        content: "";
        height: 325px;
        width: 25px;
        position: absolute;
        right: 0;
        left: -230px;
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
        transform:rotate(180deg) translateZ(-30px) translateX(3px);
        &.fliped{
            transform:rotate(180deg);
        }
        .text {
            transform: rotateX(180deg);
            position: absolute;
            bottom: 10px;
            padding: 20px;
            text-align:left;
        }
        .multipleIds {
            max-height: 186px;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }
`


export default function NftImageInteractive(props) {
    const [fliped, set_fliped] = useState(false);
    const [rotated, set_rotated] = useState(false);


    const spineColor = (rank) => {
        switch(rank){
            case 'bronze':
                return '#e9a950';
            case 'silver':
                return '#828282';
            case 'gold':
                return '#eceb8a';
            case 'diamond':
                return '#ffffff';
            default:
                return '#00009c';
        }
    }

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
                    <div 
                        className="spine"
                        style={{background: spineColor(props.nft.rank)}}
                    />
                    <div 
                        className={[
                            "nft-back",
                            fliped ? 'fliped' : '',
                        ].join(' ')}
                        {...onNotSelectingClick(()=>{set_fliped(false)})}
                    >
                        <Table 
                            width1stColumn="65"
                            className="text"
                        >
                            <tbody>
                                <tr>
                                    <th>Type</th>
                                    <td>{props.nft.type}</td>
                                </tr>
                                <tr>
                                    <th>Rank</th>
                                    <td>{props.nft.rank}</td>
                                </tr>
                                {
                                    props.nft.ids.length > 1 ?
                                    <tr>
                                        <th>IDs</th>
                                        <td>
                                            <div 
                                                className='multipleIds'
                                            >
                                                <div>
                                                    {props.nft.ids.join(', ')}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    :
                                    <tr>
                                        <th>ID</th>
                                        <td>{props.nft.id}</td>
                                    </tr>
                                }
                                <tr>
                                    <th>Boost</th>
                                    {
                                        props.nft.ignored ? 
                                        <td>Ignored</td>
                                        :
                                        <td>{(props.nft.boost*100).toFixed(2)}%</td>
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