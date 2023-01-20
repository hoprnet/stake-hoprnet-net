import React from 'react';
import styled from "@emotion/styled";

export const Tables = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 16px;
    .mobile-only {
        display: none;
    }
    @media only screen and (max-width: 820px) {
        flex-direction: column;
        gap: 0px;
        .not-on-mobile {
            display: none;
        }
        .mobile-only {
            display: table;
        }
    }
`;

export const Table = styled.table`
    font-family: "Source Code Pro";
    width: 100%;
    font-size: 14px;
 //   font-weight: 400;
    border-bottom: 0.1rem solid darkgray;
    border-collapse: collapse; 
    th {
        text-align: left;
    }
    tr {
        border-top: 0.1rem solid darkgray;
    }
    th,
    td {
        padding: 8px;
    }
    th:first-of-type {
  //      font-weight: 600;
        width: 160px;
    }

`;


// elemet should accept only <tbody>
export default function TableDataColumed(props) {
    return (
        <Tables>
            {props.children.length > 0 ? props.children?.map(elem => {
                return (
                    <Table className="not-on-mobile">
                        {elem}
                    </Table>
                )
            }) :
                <Table>
                    {props.children}
                </Table>
            }
            <Table className="mobile-only">
                {props.children.length > 0 && props.children?.map(elem => elem)}
            </Table>
        </Tables>
    )
}