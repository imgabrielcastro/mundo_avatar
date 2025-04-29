import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { supabase } from '../services/supabaseClient';
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
  const [funcionarios, setFuncionarios] = useState([]);
  const [relatorio, setRelatorio] = useState([]);
  const [showRelatorio, setShowRelatorio] = useState(false);
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

    const fetchFuncionarios = async () => {
      const { data } = await supabase.from('funcionarios').select('nome, img, avatar');
      if (data) setFuncionarios(data);
    };

    fetchData();
    fetchFuncionarios();
  }, []);

  const avatarNome = registro?.avatar;

  const gerarRelatorio = async () => {
    const { data, error } = await supabase
      .from('dinamica_avatar')
      .select('fogo, agua, terra, ar');

    if (error) {
      console.error('Erro ao gerar relatório:', error);
    } else {
      const contagemVencedores = {};

      data.forEach((item) => {
        ['fogo', 'agua', 'terra', 'ar'].forEach((elemento) => {
          const vencedor = item[elemento];
          if (vencedor) {
            if (!contagemVencedores[vencedor]) {
              contagemVencedores[vencedor] = { fogo: 0, agua: 0, terra: 0, ar: 0 };
            }
            contagemVencedores[vencedor][elemento]++;
          }
        });
      });

      const vencedoresArray = Object.keys(contagemVencedores).map((nome) => ({
        nome,
        ...contagemVencedores[nome],
        total: Object.values(contagemVencedores[nome]).reduce((sum, count) => sum + count, 0),
      }));

      vencedoresArray.sort((a, b) => b.total - a.total);

      vencedoresArray.forEach((vencedor) => {
        const funcionario = funcionarios.find(f => f.nome === vencedor.nome);
        vencedor.avatar = funcionario?.avatar || ''; // Adicionando o avatar
        vencedor.img = funcionario?.img || ''; // Foto do funcionário
      });

      setRelatorio(vencedoresArray);
      setShowRelatorio(true);
    }
  };

  const renderMedalhas = (index) => {
    switch (index) {
      case 0:
        return (
          <Box sx={{ display: 'inline-block', backgroundColor: 'gold', padding: '5px 15px', borderRadius: '50px', color: '#fff', fontWeight: 'bold' }}>
            Top 1 (Ouro)
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: 'inline-block', backgroundColor: 'silver', padding: '5px 15px', borderRadius: '50px', color: '#fff', fontWeight: 'bold' }}>
            Top 2 (Prata)
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: 'inline-block', backgroundColor: '#cd7f32', padding: '5px 15px', borderRadius: '50px', color: '#fff', fontWeight: 'bold' }}>
            Top 3 (Bronze)
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', position: 'relative' }}>
      {avatarNome && <Confetti width={width} height={height} numberOfPieces={300} />}

      {avatarNome && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            textAlign: 'center',
            backgroundColor: 'rgba(86, 47, 160, 0.85)',
            p: 2,
            borderRadius: 4,
            boxShadow: '0 0 30px 10px rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <img
            src={registro?.img || require('../assets/users/avatar.png')}
            alt="Avatar"
            style={{ width: 380, height: 380, borderRadius: '10%', objectFit: 'cover', marginBottom: 8 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f1f1f1' }}>
            Avatar da Semana: {avatarNome}
          </Typography>
        </Box>
      )}

      {ELEMENTOS.map(({ key, label, fundo }, index) => {
        const nome = registro?.[key] || 'Nenhum';
        const funcionario = funcionarios.find(f => f.nome === nome) || { img: require('../assets/users/nenhum.png') };

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
              borderLeft: index !== 0 ? '2px solid rgba(255, 255, 255, 0.3)' : 'none',
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
              {label}
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src={funcionario.img}
                alt={nome}
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  border: '6px solid white',
                  objectFit: 'cover',
                  mb: 1,
                }}
              />
              <Typography variant="h6" fontWeight="bold">{nome}</Typography>
            </Box>
          </Box>
        );
      })}

      {/* Botão para gerar o relatório */}
      <Box sx={{ position: 'absolute', bottom: '5%', right: '43%' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={gerarRelatorio}
          sx={{
            padding: '10px 20px',
            backgroundColor: '#9A1FFF',
            color: '#fff',
            '&:hover': { backgroundColor: '#8014d8' },
          }}
        >
          Gerar Relatório de Campeões
        </Button>
      </Box>

      {/* Exibir o relatório */}
      {showRelatorio && (
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: 1200,
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.23)',
            padding: '16px',
            zIndex: 20,
          }}
        >
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 3, color: '#8014d8', fontWeight: 'bold' }}>
            Relatório de Campeões
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
            {relatorio.map((champion, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 5,
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid #9A1FFF',
                  backgroundColor: '#f7f0ff',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography variant="h6" sx={{ flex: 1, color: '#9A1FFF' }}>
                  {champion.nome}
                </Typography>
                <Typography variant="h6" sx={{ flex: 1, color: '#9A1FFF' }}>
                  {champion.fogo}x FOGO
                </Typography>
                <Typography variant="h6" sx={{ flex: 1, color: '#9A1FFF' }}>
                  {champion.agua}x ÁGUA
                </Typography>
                <Typography variant="h6" sx={{ flex: 1, color: '#9A1FFF' }}>
                  {champion.terra}x TERRA
                </Typography>
                <Typography variant="h6" sx={{ flex: 1, color: '#9A1FFF' }}>
                  {champion.ar}x AR
                </Typography>
                {renderMedalhas(index)} {/* Aplica a medalha ao vencedor */}
              </Box>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowRelatorio(false)}
              sx={{
                backgroundColor: '#8014d8',
                color: '#fff',
                '&:hover': { backgroundColor: '#9A1FFF' },
              }}
            >
              Fechar Relatório
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
