// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Paper,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { supabase } from '../services/supabaseClient';

const nomes = [
  'Nenhum',
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
  const [tab, setTab] = useState(0);
  const [fogo, setFogo] = useState('');
  const [agua, setAgua] = useState('');
  const [terra, setTerra] = useState('');
  const [ar, setAr] = useState('');
  const [avatar, setAvatar] = useState('');
  const [dataWin, setDataWin] = useState('');
  const [editId, setEditId] = useState(null);
  const [registros, setRegistros] = useState([]);

  useEffect(() => {
    fetchRegistros();
  }, []);

  useEffect(() => {
    if (
      fogo && agua && terra && ar &&
      fogo === agua &&
      agua === terra &&
      terra === ar &&
      fogo !== 'Nenhum'
    ) {
      setAvatar(fogo);
    } else {
      setAvatar('');
    }
  }, [fogo, agua, terra, ar]);

  const fetchRegistros = async () => {
    const { data, error } = await supabase
      .from('dinamica_avatar')
      .select('*')
      .order('data_win', { ascending: false });
    if (!error) setRegistros(data);
  };

  const handleSubmit = async () => {
    const payload = {
      fogo: fogo || null,
      agua: agua || null,
      terra: terra || null,
      ar: ar || null,
      avatar: avatar || null,
      data_win: dataWin || null
    };

    let response;
    if (editId) {
      response = await supabase
        .from('dinamica_avatar')
        .update(payload)
        .eq('id', editId);
    } else {
      response = await supabase.from('dinamica_avatar').insert([payload]);
    }

    if (response.error) {
      alert('Erro ao salvar: ' + response.error.message);
    } else {
      alert(editId ? 'Registro atualizado!' : 'Registro salvo com sucesso!');
      limparFormulario();
      fetchRegistros();
    }
  };

  const handleEdit = (registro) => {
    setEditId(registro.id);
    setFogo(registro.fogo || '');
    setAgua(registro.agua || '');
    setTerra(registro.terra || '');
    setAr(registro.ar || '');
    setAvatar(registro.avatar || '');
    setDataWin(registro.data_win || '');
    setTab(0);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja excluir este registro?");
    if (!confirm) return;

    const { error } = await supabase
      .from('dinamica_avatar')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Erro ao deletar: ' + error.message);
    } else {
      alert('Registro deletado com sucesso!');
      fetchRegistros();
    }
  };

  const limparFormulario = () => {
    setFogo('');
    setAgua('');
    setTerra('');
    setAr('');
    setAvatar('');
    setDataWin('');
    setEditId(null);
  };

  const Formulario = () => (
    <>
      {[
        { label: '🔥 Fogo', state: fogo, setState: setFogo },
        { label: '🌊 Água', state: agua, setState: setAgua },
        { label: '🪨 Terra', state: terra, setState: setTerra },
        { label: '💨 Ar', state: ar, setState: setAr },
      ].map(({ label, state, setState }) => (
        <FormControl fullWidth sx={{ mb: 2 }} key={label}>
          <InputLabel>{label}</InputLabel>
          <Select
            value={state}
            label={label}
            onChange={(e) => setState(e.target.value)}
          >
            {nomes.map((nome) => (
              <MenuItem key={nome} value={nome}>
                {nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      {/* Avatar com brilho */}
      <FormControl fullWidth sx={{ mb: avatar ? 1 : 3 }}>
        <InputLabel
          sx={{
            color: avatar ? '#9A1FFF' : undefined,
          }}
        >
          🌀 Avatar
        </InputLabel>
        <Select
          value={avatar}
          label="🌀 Avatar"
          disabled
          sx={{
            backgroundColor: avatar ? '#f7edff' : undefined,
            boxShadow: avatar
              ? '0 0 12px 4px rgba(154, 31, 255, 0.4)'
              : 'none',
            transition: 'all 0.3s ease-in-out',
            '& .MuiSelect-select': {
              fontWeight: avatar ? 'bold' : 'normal',
              color: avatar ? '#9A1FFF' : 'inherit',
            },
          }}
        >
          <MenuItem value="">Nenhum</MenuItem>
          {nomes.filter(n => n !== 'Nenhum').map((nome) => (
            <MenuItem key={nome} value={nome}>{nome}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Aviso Avatar */}
      {avatar && (
        <Typography
          align="center"
          sx={{ mb: 2, color: '#9A1FFF', fontWeight: 600 }}
        >
          🎉 {avatar} é o Avatar desta semana!
        </Typography>
      )}

      {/* Data */}
      <TextField
        label="📅 Data da Dinâmica"
        type="date"
        fullWidth
        sx={{ mb: 3 }}
        InputLabelProps={{ shrink: true }}
        value={dataWin}
        onChange={(e) => setDataWin(e.target.value)}
      />

      <Box display="flex" gap={2}>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: avatar ? '#9A1FFF' : '#9A1FFF',
            fontWeight: 'bold',
            animation: avatar ? 'pulse 1.5s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(154,31,255, 0.6)' },
              '70%': { boxShadow: '0 0 0 10px rgba(154,31,255, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(154,31,255, 0)' },
            },
            '&:hover': {
              backgroundColor: avatar ? '#8014d8' : '#a099b5'
            }
          }}
        >
          {editId ? 'Atualizar Registro' : 'Salvar Dinâmica'}
        </Button>

        <Button
  fullWidth
  variant="outlined"
  onClick={limparFormulario}
  sx={{
    borderColor: '#9A1FFF',
    color: '#9A1FFF',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#f0e5ff',
      borderColor: '#8014d8',
      color: '#8014d8'
    }
  }}
>
  Limpar
</Button>
      </Box>
    </>
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      minHeight="100vh"
      sx={{
        backgroundColor: avatar ? '#f8f3ff' : '#f3f3f3',
        pt: 4,
        transition: 'background-color 0.4s ease-in-out'
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: '90%', maxWidth: 700 }}>
        <Tabs value={tab} onChange={(e, val) => setTab(val)} centered sx={{ mb: 3 }}>
          <Tab label="Registrar" />
          <Tab label="Gerenciar" />
        </Tabs>

        <Divider sx={{ mb: 3 }} />

        {tab === 0 ? (
          <Box>{Formulario()}</Box>
        ) : (
          <Box>
            {registros.map((r) => (
              <Box key={r.id} sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  📅 {r.data_win}
                </Typography>
                <Typography variant="body2">🔥 {r.fogo || 'Nenhum'}</Typography>
                <Typography variant="body2">🌊 {r.agua || 'Nenhum'}</Typography>
                <Typography variant="body2">🪨 {r.terra || 'Nenhum'}</Typography>
                <Typography variant="body2">💨 {r.ar || 'Nenhum'}</Typography>
                <Typography variant="body2">🌀 Avatar: {r.avatar || 'Nenhum'}</Typography>
                <Box mt={2} display="flex" gap={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleEdit(r)}
                    sx={{ color: '#9A1FFF', borderColor: '#9A1FFF' }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(r.id)}
                  >
                    Excluir
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
