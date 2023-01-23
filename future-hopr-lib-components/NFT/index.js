import * as React from 'react';
import styled from "@emotion/styled";

import { Table } from '../Table/columed-data'
import Button from '../Button'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-content: space-evenly;
    border: 1px solid rgb(204, 204, 204);
    img {
        width: 240px;
        margin: auto;
        max-width: 100%;
        height: auto;
    }
    .btn-hopr--v2{
        width: calc( 100% - 16px);
        margin: 4px 8px;
    }
`

export default function Nft(props) {
    return (
        <Container>
            <img src={props.image} className="nft-image" />
            <div className="css-ndd2wf">
                <div className="css-1gdwl90">
                    <Table width1stColumn="90">
                        <tbody>
                            <tr>
                                <th>Token Id</th>
                                <td>{props.id}</td>
                            </tr>
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
                                <td>{(props.boost*100).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <th>Expired</th>
                                <td>{ }- xHOPR</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button>
                        Lock NFT
                    </Button>
                </div>
            </div>
        </Container>
    )
}