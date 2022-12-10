import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import { red } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import DenseTable from "./components/Table";
import ResponsiveAppBar from "./components/Header";



import useWeb3 from "./hooks/useWeb3";
import { ethers } from 'ethers';

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});


function createData(nickname, bet, score, address) {
  return { nickname, bet, score, address };
}

async function getBets(betPoolContract) {
  console.log('bet pool contract',betPoolContract)
  try {
    const bets = await betPoolContract.getBets();
    console.log(bets)
    return bets;
  } catch(error) {
   console.log('error getting number of bets', error)
  }
} 

async function addBet(account, usdcContract, betPoolContract, betPoolAddress, nickname, scoreA, scoreB) {
 try {
   console.log('bet pool contract when addbet', betPoolContract)
   const allowance = await usdcContract.allowance(account, betPoolAddress)
   if(ethers.utils.formatEther(allowance) === '0.0') {
     await usdcContract.approve(betPoolAddress, ethers.utils.parseEther('1000'))
   }
   const transaction = await betPoolContract.bet(nickname, scoreA, scoreB);
   console.log(transaction)

 } catch(error) {
  console.log(error)
 }
} 


const App = () => {
  const [bets, setBets] = useState([]);
  const [isWallet, setIsWallet] = useState(false);
  const [rows, setRows] = useState([]);

  const { active, account, connect, disconnect, isMetamaskInstalled, signer, provider, usdcContract, betPoolContract, betPoolAddress } =
    useWeb3();
  const wallet = { active, account, connect, disconnect, isMetamaskInstalled };
  const { handleSubmit, reset, control } = useForm();
  
  const onSubmit = (data) => {
    if(!active) {
      alert('Please Connect your wallet');
      return;
    }
    addBet(account, usdcContract, betPoolContract, betPoolAddress, data.nickname, data.ScoreA, data.ScoreB);
    setRows([...rows, createData(data.nickname, 1, [data.ScoreA, data.ScoreB], account)]);
  };

  useEffect(() => {
    // check if metamask is installed
    if (window.ethereum) {
      setIsWallet(true);
      console.log("MetaMask is installed");
    } else {
      console.log("MetaMask is not installed");
    }
  }, []);

  // use effect to get bets
  useEffect(() => {
    if(active && betPoolContract) {
      getBets(betPoolContract).then((bets) => {
        console.log(bets)
        setBets(bets);
      })
    }
  }, [active])

  return (
    <ThemeProvider theme={theme}>
      <ResponsiveAppBar wallet={wallet} />
      {!isWallet ? (
        <Container component="main" maxWidth="xs">
          <h1>
            No wallet found 😅 ! Need help ? Join us on{" "}
            <a href="https://discord.gg/fXP5juJqQa">Discord</a> to get support
          </h1>
        </Container>
      ) : (
        <Container>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Game Date 📆 : Sunday 27th of NOV 2022
              <h1> 🇩🇪 GERMANY 0 vs 🇪🇸 SPAIN 0 </h1>
            </Typography>
          </Box>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              ⚽️ Bet on the game ⚽️
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <form>
                <Controller
                  name={"nickname"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value}
                      margin="normal"
                      required
                      fullWidth
                      id="nickname"
                      label="Nickname"
                      name="text"
                      autoFocus
                    />
                  )}
                />
                <Controller
                  name={"ScoreA"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value}
                      margin="normal"
                      required
                      name="ScoreA"
                      label="Score Team A"
                      type="text"
                      id="password"
                    />
                  )}
                />
                <Controller
                  name={"ScoreB"}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextField
                      onChange={onChange}
                      value={value}
                      margin="normal"
                      required
                      name="ScoreB"
                      label="Score Team B"
                      type="text"
                      id="password"
                      default={0}
                    />
                  )}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, background: "black" }}
                  onClick={handleSubmit(onSubmit)}
                >
                  ADD BET
                </Button>
              </form>
            </Box>
          </Box>
          <DenseTable rows={rows} sx={{ mb: 20 }}/>
        </Container>
      )}
    </ThemeProvider>
  );
};

export default App;
