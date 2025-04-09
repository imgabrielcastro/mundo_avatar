// src/components/AvatarDisplay.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { supabase } from '../services/supabaseClient';
import userImages from '../assets/users/userImages';
import Confetti from 'react-confetti';
import { useWindowSize } from '@uidotdev/usehooks';

const ELEMENTOS = [
  { key: 'fogo', label: '🔥 Fogo', cor: '#ff6b6b', anim: 'fire' },
  { key: 'agua', label: '🌊 Água', cor: '#00bcd4', anim: 'water' },
  { key: 'terra', label: '🪨 Terra', cor: '#795548', anim: 'earth' },
  { key: 'ar', label: '💨 Ar', cor: '#9e9e9e', anim: 'air' }
];

export default function AvatarDisplay() {
  const [registro, setRegistro] = useState(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('dinamica_avatar')
        .select('*')
        .order('data_win', { ascending: false })
        .limit(1);
      if (!error && data.length > 0) {
        setRegistro(data[0]);
      }
    };

    fetchData();
  }, []);

  const avatarNome = registro?.avatar;
  const avatarImage = userImages[avatarNome] || null;
  const dataFormatada = registro?.data_win
    ? new Date(registro.data_win).toLocaleDateString()
    : '';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        p: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {avatarNome && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />
      )}

      <Typography variant="h4" align="center" mb={3} sx={{ fontWeight: 'bold', color: '#9A1FFF' }}>
        Vencedores da Dinâmica - {dataFormatada}
      </Typography>

      {avatarNome && (
        <Box textAlign="center" mb={5}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            🌀 Avatar da Semana
          </Typography>
          <img
            src={avatarImage}
            alt={avatarNome}
            style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover' }}
          />
          <Typography variant="h6" mt={1} sx={{ color: '#9A1FFF', fontWeight: 'bold' }}>
            {avatarNome}
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 4 }} />

      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
        gap={4}
      >
        {ELEMENTOS.map(({ key, label, cor, anim }) => {
          const nome = registro?.[key] || 'Nenhum';
          const imagem = userImages[nome] || userImages['Nenhum'];

          return (
            <Paper
              key={key}
              elevation={3}
              className={`element-card ${anim}`}
              sx={{
                padding: 3,
                textAlign: 'center',
                borderTop: `6px solid ${cor}`,
                borderRadius: 3,
                backgroundColor: '#fff',
                position: 'relative',
              }}
            >
              <Typography variant="h6" sx={{ color: cor, mb: 2 }}>
                {label}
              </Typography>
              <Box
                component="img"
                src={imagem}
                alt={nome}
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  mb: 2
                }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {nome}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Animações básicas via CSS */}
      <style>{`
        .fire { animation: flicker 0.7s infinite alternate; }
        .water { animation: wave 2s infinite ease-in-out; }
        .earth { animation: pulse 2s infinite ease-in-out; }
        .air { animation: float 3s infinite ease-in-out; }

        @keyframes flicker {
          from { transform: scale(1); }
          to { transform: scale(1.03) rotate(0.5deg); }
        }

        @keyframes wave {
          0% { transform: translateY(0); }
          50% { transform: translateY(5px); }
          100% { transform: translateY(0); }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}
