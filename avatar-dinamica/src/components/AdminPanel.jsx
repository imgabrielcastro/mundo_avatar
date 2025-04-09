// src/components/AdminPanel.jsx
import React, { useState } from 'react';
import { Box, Button, Typography, MenuItem, Select, InputLabel, FormControl, TextField } from '@mui/material';
import { supabase } from '../services/supabaseClient';

const nomes = [
  'Arthur Rabello',
  'Eduardo Santana',
  'Filipe Vosnievski',
  'José Gabriel',
  'Pedro Henrique',
  'Raffael Michels',
  'Raul Lummertz',
  'Saymon Espindola',
  'Vinicius Bauermann',
  'Vinicius de Moraes',
  'Yago Casagrande'
];

export default function AdminPanel() {
  const [fogo, setFogo] = useState('');
  const [agua, setAgua] = useState('');
  const [terra, setTerra] = useState('');
  const [ar, setAr] = useState('');
  const [avatar, setAvatar] = useState('');
  const [dataWin, setDataWin] = useState('');

  const handleSubmit = async () => {
    const { error } = await supabase.from('dinamica_avatar').insert([{
      fogo,
      agua,
      terra,
      ar,
      avatar: avatar || null,
      data_win: dataWin
    }]);

    if (error) {
      alert('Erro ao salvar: ' + error.message);
    } else {
      alert('Registro salvo com sucesso!');
      setFogo(''); setAgua(''); setTerra(''); setAr(''); setAvatar(''); setDataWin('');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={2}>Registrar Vencedores da Dinâmica</Typography>

      {['fogo', 'agua', 'terra', 'ar', 'avatar'].map((elemento) => (
        <FormControl key={elemento} fullWidth sx={{ mb: 2 }}>
          <InputLabel>{elemento.toUpperCase()}</InputLabel>
          <Select
            value={{ fogo, agua, terra, ar, avatar }[elemento]}
            label={elemento.toUpperCase()}
            onChange={(e) => {
              if (elemento === 'fogo') setFogo(e.target.value);
              if (elemento === 'agua') setAgua(e.target.value);
              if (elemento === 'terra') setTerra(e.target.value);
              if (elemento === 'ar') setAr(e.target.value);
              if (elemento === 'avatar') setAvatar(e.target.value);
            }}
          >
            <MenuItem value="">Nenhum</MenuItem>
            {nomes.map((nome) => (
              <MenuItem key={nome} value={nome}>{nome}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      <TextField
        label="Data da Dinâmica"
        type="date"
        fullWidth
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
        value={dataWin}
        onChange={(e) => setDataWin(e.target.value)}
      />

      <Button variant="contained" onClick={handleSubmit}>Salvar Dinâmica</Button>
    </Box>
  );
}
