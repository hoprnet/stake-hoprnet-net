import React, { useState, useEffect } from 'react';
import styled from "@emotion/styled";

import { Table } from '../Table/columed-data'
import Button from '../Button'

const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-content: space-evenly;
    border: 1px solid rgb(204, 204, 204);
    padding: 4px;
    border-radius: 8px;
    img {
        width: 240px;
        margin: auto;
        max-width: 100%;
        height: auto;
        @media (max-width: 820px) {
            width: 200px;
        }
    }
    .btn-hopr--v2{
        width: calc( 100% - 16px);
        margin: 4px 8px;
    }
    table {
        border-bottom: unset;
    }
    .count{
        top: -6px;
        right: -6px;
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 30px;
        background: red;
        box-shadow: 0px 4px 6px rgb(0 0 0 / 50%);
        text-align: center;
        color: white;
        font-size: 13px;
        font-weight: 700;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`

export default function Nft(props) {
    const [disableButton, set_disableButton] = useState(false);

    async function handleLockNFT(){
        set_disableButton(true);
        await props.handleLockNFT(props.id);
        set_disableButton(false);
    }

    return (
        <Container>
            <img src={props.image} className="nft-image" />
            <div className="css-ndd2wf">
                <div className="css-1gdwl90">
                    <Table width1stColumn="90">
                        <tbody>
                            <tr>
                                <th>Type</th>
                                <td>{props.type}</td>
                            </tr>
                            <tr>
                                <th>Rank</th>
                                <td>{props.rank}</td>
                            </tr>
                            <tr>
                                <th>Boost</th>
                                {
                                    props.ignored ? 
                                    <td>Ignored</td>
                                    :
                                    <td>{(props.boost*100).toFixed(2)}%</td>
                                }
                            </tr>
                        </tbody>
                    </Table>
                    {
                        !props.locked &&
                        <Button
                            onClick={handleLockNFT}
                            disabled={disableButton}
                        >
                            Lock NFT
                        </Button>
                    }

                </div>
            </div>
            {
                props.count > 1 &&
                <div className="count">
                    {props.count}
                </div>
            }
        </Container>
    )
}