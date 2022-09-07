import React from "react";
import styled from "@emotion/styled";

//mui
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const SFormControl = styled(FormControl)`
  margin-bottom: 16px;
  margin-top: 24px;
  label {
    font-size: 17px;
  }
  .MuiOutlinedInput-root {
    font-size: 17px;
  }
`

function Section(props) {
    return (
        <SFormControl size="small" >
            <InputLabel id="select-small">RPC</InputLabel>
            <Select
                labelId="select-small"
                id="select-small"
                value={props.value}
                onChange={props.onChange}
                label="RPC"
            >
                {
                    props.chains.map(chain =>
                        <MenuItem value={chain.value}>{chain.name}</MenuItem>
                    )
                }
            </Select>
        </SFormControl>
    );
}

export default Section;
