import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { redirect } from "react-router-dom";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MovieCard from '../../components/MovieCard';

const defaultTheme = createTheme();
const postOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  }

export default function UpcomingMovies() {
  

  const postSignUp = async (details) => {
    try{
      postOptions.data = details;

      console.log("sending data 1...");

      let res = await axios(postOptions);
      // Acho que devia ter aqui tratamento com uma mensagem de sucesso
      
      //return res;
    }
    catch(err){
      console.log(err);
    }
  }

  const handleSubmit = async (event) => {
    //event.preventDefault();

    //const navigate = useNavigate();
    const data = new FormData(event.currentTarget);
    let details = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
    };
    
    console.log(details);  
    
    //await postSignUp(details);

    console.log("result received. redirectiong...");
    
    if (true) {
        console.log("result received. redirectiong...");

        redirect('index.html')

      } else {
        window.alert('Wrong email or password')
      }
    
    console.log("Success");
  };

  const getUpcomingMovies = async() => {
      postOptions.method = "POST",
      //postOptions.url = `${import.meta.env.VITE_BE_ADDRESS}/movies`;

      console.log("sending request...");

      let res = await axios(`${import.meta.env.VITE_BE_ADDRESS}/movies`, "",postOptions);

      console.log(res);

      return res.data ;
  }

  //let upcomingMovies = getUpcomingMovies(); // []; 
  let upcomingMovies = [{
    title: "Title 1",
    description: "Description 1",
    date : "Date 1",
    image: "https://img.freepik.com/free-photo/view-3d-young-children-watching-movie_23-2151066971.jpg",
  },
  {
    title: "Title 2",
    description: "Description 2",
    date : "Date 2",
    image: "https://img.freepik.com/free-photo/view-3d-cinema-theatre-room_23-2151067006.jpg",
  },
  {
    title: "Title 3",
    description: "Description 3",
    date : "Date 3",
    image: "https://img.freepik.com/free-photo/view-3d-tiger-cinema-watching-movie_23-2151067058.jpg",
  },
  {
    title: "Title 4",
    description: "Description 4",
    date : "Date 4",
    image: "https://img.freepik.com/free-photo/view-3d-cows-cinema-watching-movie_23-2151067066.jpg",
  },]; 
  let sections = [];

  // TODO remove, this demo shouldn't need to reset the theme.
  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Upcoming Movies" sections={sections} />
        <main>
          {/*<MainFeaturedPost post={mainFeaturedPost} />*/}
          <Grid container spacing={4}>
            {upcomingMovies.map((movie) => (
              <MovieCard key={movie.title} post={movie} />
            ))}
          </Grid>
        </main>
      </Container>
      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </ThemeProvider>
  );
}
