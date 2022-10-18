import AccountCircle from '@mui/icons-material/AccountCircle';
import Numbers from "@mui/icons-material/Numbers";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, Container, FormControl, Input, InputAdornment, InputLabel, Paper, Typography } from "@mui/material";
import { Stack } from '@mui/system';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RamImage from '../assets/RAM.png';

export const Home = () => {
    const [name, setName] = useState('');
    const [von, setVon] = useState('');
    const navigate = useNavigate();

    const lookupOrder = () => {
        navigate(name + '/' + von);
    }

    return (
      <Container sx={{ width: "600px", marginTop: "200px" }}>
        <Paper>
          <Stack spacing="10">
            <img src={RamImage} alt="RAM"/>
            <Typography variant="h4">RAM Order Tracker (unofficial)</Typography>
            <Box sx={{ "& > :not(style)": { m: 1 } }}>
              <FormControl variant="standard">
                <InputLabel htmlFor="input-name">Name or Company</InputLabel>
                <Input
                  id="input-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl variant="standard">
                <InputLabel htmlFor="input-von">Order Number</InputLabel>
                <Input
                  id="input-von"
                  value={von}
                  onChange={(e) => setVon(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Numbers />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Button
                variant="contained"
                endIcon={<SearchIcon />}
                onClick={lookupOrder}
              >
                Lookup
              </Button>
            </Box>
            <br/>
            <Typography variant="body2">No data will be stored on the server.
            The order lookup occurs within your browser.  Your name and order number will be sent to ramtrucks.com to look up your order data.
            No information is sent to this server.</Typography>
          </Stack>
        </Paper>
      </Container>
    );
}