import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from "@emotion/styled";

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import { visuallyHidden } from '@mui/utils';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ProgressBar from './progressbar'

import { shorten0xAddress } from '../../utils/functions'
import _debounce from 'lodash/debounce';
import TimeAgo from 'react-timeago'

const SMobileTable= styled.table`
  font-size: 13px;
  td:first-of-type {
    font-weight: 600;
    padding-right: 8px;
  }
`

const MobileTable = (props) => {
  return (
    <SMobileTable>
      <tbody>
        {props.children}
      </tbody>
    </SMobileTable>
  )
}

const SMobileTable2= styled.table`
  font-size: 13px;
  td:first-of-type {
    font-weight: 600;
    padding-right: 8px;
  }
`

export default function EnhancedTable(props) {
  return (
      <Paper sx={{ width: '100%', mb: 2 }}>
        <MobileTable>
            <tr>
            <td>Address:</td>
            <td>
                <Tooltip 
                title={row.peerId}
                >
                <span>
                    {shorten0xAddress(row.peerId, -6)}
                </span>
                </Tooltip>
            </td>
            </tr>
            <tr>
            <td>Registered:</td>
            <td>
                {
                row.registered === 1 ?
                    'Yes'
                    :
                    'No'
                }
            </td>
            </tr>
            <tr>
            <td>Last Seen:</td>
            <td>{formatDate(row.lastSeen, false)}</td>
            </tr>
            <tr>
            <td>Ping count:</td>
            <td>{row.count}</td>
            </tr>
            <tr>
            <td>Latency average:</td>
            <td>{row.latencyAverage ? row.latencyAverage.toFixed(2) : '-'} ms</td>
            </tr>
            <tr>
            <td>Availability 24h:</td>
            <td>{Math.round(row.availability24h*1000)/10}%</td>
            </tr>
            <tr>
            <td>Availability:</td>
            <td>{Math.round(row.availability*1000)/10}%</td>
            </tr>
        </MobileTable>
      </Paper>
  );
}
