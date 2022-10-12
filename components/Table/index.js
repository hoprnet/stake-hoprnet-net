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

//Icons
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';



const STableContainer = styled(TableContainer)`
  .MuiTableCell-mobileRow {
    display: none;
  }
  @media only screen and (max-width: 820px) {
    thead {
      display: none;
    }
    .MuiTableCell-root:not(.MuiTableCell-mobileRow){
      display: none;
    }
    .MuiTableCell-mobileRow {
      display: table-cell;
    }
  }
`

const STableCell = styled(TableCell)`
  font-family: 'Source Code Pro', monospace;
  padding: 8px 16px;
  white-space: nowrap;
  &.MuiTableCell-head {
    font-weight: 600;
  }
  .peerId-text {
    display: inline-flex;
    .overflow-text {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .full-text {
      display: inline-block;
    }
  }
`

const SearchPeerId = styled(TextField)`
  font-family: 'Source Code Pro', monospace;
  width: 100%;
  margin-bottom: 8px;
  background: white;
  * {
    font-family: 'Source Code Pro', monospace;!important
  }
`

const STablePagination= styled(TablePagination)`
  * {
    font-family: 'Source Code Pro', monospace!important;
  }
  .MuiToolbar-root {
    justify-content: flex-end;
  }
  @media only screen and (max-width: 470px) {
    .MuiToolbar-root > * {
      display: none;
    }
    .MuiToolbar-root > div:last-child{
      display: block;
      margin-left: 0;
    }
  }
`

const SMobileTable= styled.table`
  font-size: 13px;
  td:first-of-type {
    font-weight: 600;
    padding-right: 8px;
  }
`

const SearchRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  @media only screen and (max-width: 820px) {
    flex-direction: column;
    margin-bottom: 16px;
  }
`

const SFormControl = styled(FormControl)`
  width: 260px;
  .MuiInputBase-root {
    background: white;
  }
  @media only screen and (max-width: 820px) {
    width: 100%;
  }
`

const LastRun = styled.div`
  font-size: 12px;
  margin-top: -13px;
  margin-left: 1px;
`

const SCheckCircleRoundedIcon = styled(CheckCircleRoundedIcon)`
  color: darkgreen;
`

const SCancelRoundedIcon = styled(CancelRoundedIcon)`
  color: rgb(244,64,6);
`

const SFormControlLabel = styled(FormControlLabel)`
  margin-left: 0px;
  z-index: 2;
  .MuiTypography-root {
    font-size: 0.875rem;
  }
  @media only screen and (min-width: 821px) {
    position: absolute;
    margin-top: 6px;
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

function descendingComparator(a, b, orderBy) {
  let a2 = a[orderBy];
  let b2 = b[orderBy];

  switch(orderBy){
    case 'latencyAverage':
      if (a2 === null) a2 = Number.MAX_SAFE_INTEGER;
      if (b2 === null) b2 = Number.MAX_SAFE_INTEGER;
      break;
  }

  if (b2 < a2) {
    return -1;
  }
  if (b2 > a2) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'peerId',
    numeric: false,
    disablePadding: true,
    label: 'Peer Id',
  },
  {
    id: 'registered',
    numeric: true,
    disablePadding: false,
    label: 'Registered',
    width: 144,
  },
  {
    id: 'lastSeen',
    numeric: true,
    disablePadding: false,
    label: 'Last Seen',
    width: 160,
    tooltip: "When the pingbot last saw this node (UTC)"
  },
  {
    id: 'count',
    numeric: true,
    disablePadding: false,
    label: 'Ping Count',
    width: 160,
    tooltip: "The number of pings received by this node"
  },
  {
    id: 'latencyAverage',
    numeric: true,
    disablePadding: false,
    label: 'Latency avg.',
    width: 190,
    tooltip: "The average latency of the pings received"
  },
  {
    id: 'availability24h',
    numeric: true,
    disablePadding: false,
    label: '24h Avail.',
    width: 190,
    tooltip: "The percentage of pings received by this node in the last 24 hours"
  },
  {
    id: 'availability',
    numeric: true,
    disablePadding: false,
    label: 'Avail.',
    width: 190,
    tooltip: "The percentage of pings received by this node"
  },
];


function EnvironmentSelect(props) {

  return (
    <SFormControl>
      <InputLabel id="environment-select-label">Environment</InputLabel>
      <Select
        labelId="environment-select-label"
        id="environment-select"
        value={props.value}
        label="Environment"
        MenuProps={{
          className: "source-font"
        }}
        onChange={props.onChange}
      >
        {props?.items?.map(item => 
          <MenuItem 
            value={item.id}
            key={`environment-item-${item.id}`}
            disabled={item.environment === 'paleochora'}
          > 
            {item.environment}
          </MenuItem>
        )}
      </Select>
    </SFormControl>
  )
}

function EnhancedTableHead(props) {
  const { order, orderBy, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <STableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            width={headCell.width}
          > {
            headCell.tooltip ? 
            <Tooltip 
              title={headCell.tooltip}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </Tooltip>
          :
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          }
          </STableCell>
        ))}
        <STableCell
          className='MuiTableCell-mobileRow'
        />
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, set_search] = useState('');
  const [filteredData, set_filteredData] = useState([]);
  const [leaderboard, set_leaderboard] = useState(true);

  useEffect(() => {
    filterData(search);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  useEffect(() => {
    console.log('leaderboard', leaderboard)
    set_search('')
    filterData('');
    if(!leaderboard) return;
    setOrderBy('count');
    setOrder('desc');
  }, [leaderboard]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const formatDate = (epoch, twoRows = true) => {
    if(!epoch) return <>-<br/>&nbsp;</>
    var differenceMs = Date.now() - new Date(epoch).getTime();
    if (differenceMs < 0) return <TimeAgo date={new Date(epoch).getTime()-(2*60*60*1000)} />
    if (differenceMs < 24*60*60*1000) {
      return <TimeAgo date={epoch} />
    } else {
      const d = new Date(epoch);
      const year = d.getFullYear();
      const month = d.getMonth()+1 < 10 ? `0${d.getMonth()+1}` : d.getMonth()+1;
      const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
      const hours = d.getUTCHours() < 10 ? `0${d.getUTCHours()}` : d.getUTCHours();
      const minutes = d.getUTCMinutes() < 10 ? `0${d.getUTCMinutes()}` : d.getUTCMinutes();
      const formatted = <>{`${year}-${month}-${day}`}{twoRows ? <br/> : ' '}{`${hours}:${minutes}`}</>
      return formatted;
    }
  }

  function handleSearchChange (event) {
      set_search(event.target.value);
      debounceFn(event.target.value);
  };

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(
    _debounce(filterData, 150), 
    [props.data, leaderboard]);

  function filterData(searchPhrase) {
    setPage(0);

    // Leaderboard filter
    var data = props.data;
    if(leaderboard) data = data.filter(elem => elem.communityId === 1);

    // SearchPhrase filter
    if (!searchPhrase | searchPhrase === '' ) {
      set_filteredData(data);
      return;
    }
    const filtered = data.filter(elem => elem.peerId.toLowerCase().includes(searchPhrase.toLowerCase()));
    set_filteredData(filtered);
    return;
  }

  useEffect(() => {
    console.log(filteredData)
    
  }, [filteredData]);

  return (
    <Box sx={{ width: '100%' }}>
      <SearchRow>
        <SearchPeerId 
          label="Search Peer Id" 
          variant="outlined" 
          value={search}
          onChange={handleSearchChange}
        />
        <EnvironmentSelect
          items={props.environments}
          onChange={(event)=> {props.setEnvironment(event.target.value)}}
          value={props.environment}
        />
      </SearchRow>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <STableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredData.length}
            />
            <TableBody>
              {stableSort(filteredData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.peerId}
                      style={{
                        height: (dense ? 33 : 58)
                      }}
                    >
                      <STableCell
                        component="th"
                        id={labelId}
                        scope="row"
                      >
                        <Tooltip 
                          title={row.peerId}
                        >
                          {/* <div className="peerId-text">
                            <span className="overflow-text">
                              {row.peerId.substr(0,row.peerId.length-6)}
                            </span>
                            <span className="full-text">
                              {row.peerId.substr(-6)}
                            </span>
                          </div> */}
                          <span>
                           {shorten0xAddress(row.peerId, -8)}
                          </span>
                        </Tooltip>
                      </STableCell>
                      <STableCell align="right">
                        {
                          row.registered === 1 ?
                            <SCheckCircleRoundedIcon/>
                            :
                            <SCancelRoundedIcon/>
                        }
                        </STableCell>
                      <STableCell align="right">{formatDate(row.lastSeen)}</STableCell>
                      <STableCell align="right">{row.count}</STableCell>
                      <STableCell align="right">{row.latencyAverage ? row.latencyAverage.toFixed(2) : '-'} ms</STableCell>
                      <STableCell align="right">
                        <ProgressBar
                          value={row.availability24h}
                        />
                      </STableCell>
                      <STableCell align="right">
                        <ProgressBar
                          value={row.availability}
                        />
                      </STableCell>
                      <STableCell 
                        className='MuiTableCell-mobileRow'
                      >
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
                      </STableCell>
                    </TableRow>
                  );
                })}
              {
                props.data.length > 0 && filteredData.length=== 0 && (
                  <TableRow
                  >
                    <STableCell colSpan={7}>
                      <div style={{textAlign: 'center'}}>No results</div>
                    </STableCell>
                  </TableRow>
                )
              }
              {
                props.data.length === 0 && (
                  <TableRow
                  >
                    <STableCell colSpan={7}>
                      <div style={{textAlign: 'center'}}>Loading...</div>
                    </STableCell>
                  </TableRow>
                )
              }
              {emptyRows > 0 && (
                <TableRow
                  className="emptyRow"
                  style={{
                    height: (dense ? 33 : 58) * emptyRows,
                  }}
                >
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </STableContainer>
        <Tooltip 
          title="Turn this on to view the leaderboard for just community members"
        >
          <SFormControlLabel 
            control={
              <Switch 
                onChange={event=>{set_leaderboard(event.target.checked)}}
                checked={leaderboard}
              />
            } 
            label="Community Leaderboard" 
          />
        </Tooltip>
        <STablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          className="sTablePagination"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <LastRun>
        <strong>Last run:</strong> {formatDate(props.lastRun, false)}
      </LastRun>
    </Box>
  );
}
