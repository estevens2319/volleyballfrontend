import React, { useState } from "react";
import YouTube from "react-youtube";
import { Typography, Button, TextField, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';
import clefairyImg from './clefairy.png'
import pikachuImg from './pikachu.png'
import piplupImg from './piplup.png'
import turtwigImg from './turtwig.png'
import chimcharImg from './chimchar.png'

import brawlImg from './aibrawl.png';

const imageMap = {
  "Clefairy": clefairyImg,
  "Pikachu": pikachuImg,
  "Piplup": piplupImg,
  "Turtwig": turtwigImg,
  "Chimchar": chimcharImg
}



const sample_sheet_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTet6UPHdfdsaKkFN_VB5ggHacxEDxakmZH6syhroLB7oJ3aHr5clmSbEipnQTTfLy6nfdYe6M6ZAHs/pub?output=csv"

const BackgroundMusicPlayer = () => {
  const [play, setPlay] = useState(false);
  const lambda_url = "https://ghwlzghpgj.execute-api.us-east-2.amazonaws.com/default/generateteams"
  const [teams, setTeams] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sheetsLink, setSheetsLink] = useState("");
  const [numTeams, setNumTeams] = useState("Default");


  const callLambda = async () => {
    setTeams(null);
    let currSheetsLink = ""
    if (sheetsLink === "") {
      currSheetsLink = sample_sheet_url;
      setSheetsLink(sample_sheet_url);
    }
    else {
      currSheetsLink = sheetsLink
    }
    let currNumTeams = -1
    if (numTeams === "Default") {
      currNumTeams = -1;
    }
    else {
      currNumTeams = parseInt(numTeams, 10);
    }
    setLoading(true);
    const response = await fetch(lambda_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sheet_url: currSheetsLink,
        num_teams: currNumTeams
      })
    });

    const data = await response.json();
    setTeams(JSON.parse(data.body));
    setLoading(false);
  };


  const handlePlay = async () => {
    callLambda();
    setPlay(true);
  };

  const handleNumTeams = (event) => {
    setNumTeams(event.target.value);

  };




  const onReady = (event) => {
    event.target.mute(); // Start muted
    event.target.playVideo();
    // Then unmute immediately or after a short delay:
    setTimeout(() => {
      event.target.unMute();
    }, 500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem' }}>
        <img src={brawlImg} alt="Brawl" style={{ width: '50%', height: 'auto' }} />
      </div>
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}>
          <CircularProgress />
          <Typography style={{ marginTop: '1rem' }}>
            Please wait. Generating teams...
          </Typography>
        </div>
      )}

      {teams && (
        <div>
          <Typography style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '2rem',
          }}>
            {"Balance Value: " + teams["balance_val"]}
          </Typography>



          <Grid sx={{ flexGrow: 1 }} container spacing={2} justifyContent="center">
            <Grid item xs={8}>
              <Grid container justifyContent="center" spacing={8}>
                {Object.keys(teams["teams"]).map((value) => (
                  <Grid key={value} item>

                    <Paper
                      sx={{
                        width: 200,
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(0, 0, 0, 0.5)',
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'top',
                          height: '100%',
                          textAlign: 'center',
                        }}
                      >
                        <img
                          src={imageMap[value]}
                          alt={value}
                          style={{
                            width: '40%',          // or any fixed width
                            objectFit: 'contain',   // or 'cover' depending on desired effect
                            marginBottom: 10,
                          }}
                        />

                        <Typography variant="h6" component="div">
                          {("Team " + value)}
                        </Typography>


                        <Typography variant="body2" component="div" style={{ fontWeight: 'bold' }}>
                          {"Players:"}
                        </Typography>

                        {teams["teams"][value]["players"].map((name) => (
                          <Typography variant="body2" component="div">
                            {name}
                          </Typography>

                        ))}

                        <Typography variant="body2" component="div" style={{ fontWeight: 'bold' }}>
                          {"Stats:"}
                        </Typography>
                        <Typography variant="body2" component="div">
                          {"Stat Average: " + teams["teams"][value]["team_stat_average"]}
                        </Typography>
                        <Typography variant="body2" component="div">

                          {Object.entries(teams["teams"][value]["team_stats"]).map(([key, value]) => (
                            <div key={key}>
                              {key}: {value}
                            </div>
                          ))}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>









        </div>
      )}

      {
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '2rem',
          }}
        >
          <Stack spacing={2} direction="column" width="300px">
            <FormControl fullWidth style={{ maxWidth: 300 }}>
              <InputLabel id="team-select-label">Number of Teams</InputLabel>
              <Select
                labelId="team-select-label"
                id="team-select"
                value={numTeams}
                label="Number of Teams"
                onChange={handleNumTeams}
              >
                {["Default", "2", "3", "4", "5"].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Google Sheet Link"
              variant="outlined"
              value={sheetsLink}
              onChange={(e) => setSheetsLink(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handlePlay}>
              Generate Teams
            </Button>
          </Stack>
        </div>


      }
      {play && (
        <div
          style={{
            width: 10,
            height: 10,
            overflow: "hidden",
          }}
        >
          <YouTube
            videoId="1SvzJ2V6lfU" // Replace with actual video ID
            opts={{
              height: "1",
              width: "1",
              playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                loop: 1,
                playlist: "1SvzJ2V6lfU", // Required for looping
              },
            }}
            onReady={onReady}
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundMusicPlayer;
