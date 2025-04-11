// src/components/AvatarVisualizacao.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { supabase } from '../services/supabaseClient';
import userImages from '../assets/users/userImages';
import Confetti from 'react-confetti';
import { useWindowSize } from '@uidotdev/usehooks';

const ELEMENTOS = [
  { key: 'fogo', label: 'Fogo', fundo: require('../assets/users/fogo.png') },
  { key: 'agua', label: 'Água', fundo: require('../assets/users/agua.png') },
  { key: 'terra', label: 'Terra', fundo: require('../assets/users/terra.png') },
  { key: 'ar', label: 'Ar', fundo: require('../assets/users/ar.png') }
];

export default function AvatarVisualizacao() {
  const [registro, setRegistro] = useState(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('dinamica_avatar')
        .select('*')
        .order('data_win', { ascending: false })
        .limit(1);

      if (data && data.length > 0) setRegistro(data[0]);
    };

    fetchData();
  }, []);

  const avatarNome = registro?.avatar;
  const dataFormatada = registro?.data_win ? new Date(registro.data_win).toLocaleDateString() : '';

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', position: 'relative' }}>
      {avatarNome && <Confetti width={width} height={height} numberOfPieces={300} />}

      {/* Avatar no centro (se houver) */}
      {avatarNome && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.1)',
            p: 2,
            borderRadius: 4,
            boxShadow: '0 0 30px 10px rgba(154,31,255,0.6)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <img
            src={require('../assets/avatar.png')}
            alt="Avatar"
            style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#fff' }}>
            Avatar da Semana: {avatarNome}
          </Typography>
        </Box>
      )}

      {/* Colunas dos elementos */}
      {ELEMENTOS.map(({ key, label, fundo }, index) => {
        const nome = registro?.[key] || 'Nenhum';
        const imagem = userImages[nome] || userImages['Nenhum'];

        return (
          <Box
            key={key}
            sx={{
              flex: 1,
              backgroundImage: `url(${fundo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 4,
              position: 'relative',
              color: '#fff',
              textShadow: '2px 2px 4px #000',
              borderLeft: index !== 0 ? '2px solid rgba(255, 255, 255, 0.3)' : 'none'
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
              {label}
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src={imagem}
                alt={nome}
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  border: '6px solid white',
                  objectFit: 'cover',
                  mb: 1
                }}
              />
              <Typography variant="h6" fontWeight="bold">{nome}</Typography>
            </Box>
          </Box>
        );
      })}

      {/* Rodapé opcional */}
      <Box
        position="absolute"
        bottom={10}
        left={10}
        sx={{ color: '#fff', opacity: 0.6 }}
      >
        <Typography variant="caption">Dinâmica realizada em: {dataFormatada}</Typography>
      </Box>
    </Box>
  );
}
