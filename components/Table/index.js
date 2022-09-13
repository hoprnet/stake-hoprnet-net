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

import { shorten0xAddress } from '../../utils/functions'
import _debounce from 'lodash/debounce';



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
  &.MuiTableCell-head {
    font-weight: 600;
  }
`

const SearchPeerId = styled(TextField)`
  font-family: 'Source Code Pro', monospace;
  width: 100%;
  margin-bottom: 8px;
  background: white;
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
  td:first-child {
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
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
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
    id: 'lastSeen',
    numeric: true,
    disablePadding: false,
    label: 'Last Seen',
  },
  {
    id: 'pings',
    numeric: true,
    disablePadding: false,
    label: 'Ping Count',
  },
  {
    id: 'latencyAverage',
    numeric: true,
    disablePadding: false,
    label: 'Latency average',
  },
  {
    id: 'availability',
    numeric: true,
    disablePadding: false,
    label: 'Availability',
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
        onChange={props.handleChange}
      >
        {props?.items?.map(item => 
          <MenuItem 
            value={item.id}
            key={`environment-item-${item.id}`}
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
  const [orderBy, setOrderBy] = React.useState('calories');
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, set_search] = useState('');
  const [filteredData, set_filteredData] = useState([]);

  useEffect(() => {
    filterData(search);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

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
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const formatDate = (epoch, twoRows = true) => {
    const d = new Date(epoch);
    const year = d.getFullYear();
    const month = d.getMonth() < 10 ? `0${d.getMonth()}` : d.getMonth();
    const day = d.getDay() < 10 ? `0${d.getDay()}` : d.getDay();
    const hours = d.getUTCHours() < 10 ? `0${d.getUTCHours()}` : d.getUTCHours();
    const minutes = d.getUTCMinutes() < 10 ? `0${d.getUTCMinutes()}` : d.getUTCMinutes();
    const formatted = <>{`${year}-${month}-${day}`}{twoRows ? <br/> : ' '}{`${hours}:${minutes}`}</>
    return formatted;
  }

  function handleSearchChange (event) {
      set_search(event.target.value);
      debounceFn(event.target.value);
  };

  //eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(
    _debounce(filterData, 150), 
    [props.data]);

  function filterData(searchPhrase) {
    if (!searchPhrase | searchPhrase === '' ) {
      set_filteredData(props.data);
      return;
    }
    const filtered = props.data.filter(elem => elem.peerId.toLowerCase().includes(searchPhrase.toLowerCase()));
    set_filteredData(filtered);
    return;
  }

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
                    >
                      <STableCell
                        component="th"
                        id={labelId}
                        scope="row"
                      >
                        <Tooltip 
                          title={row.peerId}
                        >
                          <span>
                            {shorten0xAddress(row.peerId, -6)}
                          </span>
                        </Tooltip>
                      </STableCell>
                      <STableCell align="right">{formatDate(row.lastSeen)}</STableCell>
                      <STableCell align="right">{row.count}</STableCell>
                      <STableCell align="right">{row.latencyAverage ? row.latencyAverage.toFixed(2) : '-'} ms</STableCell>
                      <STableCell align="right">{row.availability*100}%</STableCell>
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
                            <td>Availability:</td>
                            <td>{row.availability*100}%</td>
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
                    <STableCell colSpan={5}>
                      <div style={{textAlign: 'center'}}>No results</div>
                    </STableCell>
                  </TableRow>
                )
              }
              {
                props.data.length === 0 && (
                  <TableRow
                  >
                    <STableCell colSpan={5}>
                      <div style={{textAlign: 'center'}}>Loading...</div>
                    </STableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </STableContainer>
        <STablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
