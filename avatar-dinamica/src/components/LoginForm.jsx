import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Quacks from '../assets/users/Quacks.png';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // impede reload da página
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true'); // Salva no localStorage
      navigate('/admin'); // Redireciona para a tela de admin
    } else {
      setError('Usuário ou senha inválidos'); // Exibe erro
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      position="relative"
      sx={{ backgroundColor: '#f3f3f3' }}
    >
      <Paper elevation={4} sx={{ padding: 4, maxWidth: 500 }}>
        <form onSubmit={handleLogin}>
          <Typography variant="h5" align="center" mb={3} sx={{ color: '#9A1FFF' }}>
            Login do Líder
          </Typography>
          <TextField
            label="Usuário"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              '& label.Mui-focused': {
                color: '#9A1FFF',
              },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#9A1FFF',
                },
              },
            }}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& label.Mui-focused': {
                color: '#9A1FFF',
              },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#9A1FFF',
                },
              },
            }}
          />
          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 2, backgroundColor: '#9A1FFF' }}
          >
            Entrar
          </Button>
        </form>
      </Paper>

      {/* Balãozinho do mestre Quacks */}
      <Box
        position="absolute"
        bottom={480}
        right={40}
        bgcolor="white"
        px={2}
        py={1}
        borderRadius={2}
        boxShadow={3}
        sx={{
          maxWidth: 260,
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            right: 160,
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid white',
          },
        }}
      >
        <Typography variant="body2" fontStyle="italic">
          “Com grandes poderes vem grandes responsabilidades.”
        </Typography>
      </Box>

      {/* Imagem do pato */}
      <Box position="absolute" bottom={10} right={10}>
        <img src={Quacks} alt="Quacks, o Líder" width={320} />
      </Box>

      {/* GitHub Link */}
      <Box
        position="absolute"
        bottom={10}
        left={10}
        sx={{ textAlign: 'left', color: '#555' }}
      >
        <Typography variant="body2">
          Desenvolvido por <strong>José Gabriel</strong>
        </Typography>
        <Link
          href="https://github.com/imgabrielcastro"
          target="_blank"
          rel="noopener"
          underline="none"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#000',
            fontWeight: 'bold',
            mt: 0.5,
            '&:hover': {
              color: '#9A1FFF',
            },
          }}
        >
          <GitHubIcon fontSize="small" sx={{ mr: 0.5 }} />
          GitHub
        </Link>
      </Box>
    </Box>
  );
}
