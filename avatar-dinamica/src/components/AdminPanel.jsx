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
  Divider,
  CircularProgress
} from '@mui/material';
import { supabase } from '../services/supabaseClient';

export default function AdminPanel() {
  const [tab, setTab] = useState(1); // Alterado para "Gerenciar" ser a aba aberta por padrão
  const [fogo, setFogo] = useState('');
  const [agua, setAgua] = useState('');
  const [terra, setTerra] = useState('');
  const [ar, setAr] = useState('');
  const [avatar, setAvatar] = useState('');
  const [dataInit, setDataInit] = useState('');
  const [dataWin, setDataWin] = useState('');
  const [editId, setEditId] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [fotoFuncionario, setFotoFuncionario] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null); // Para a pré-visualização da imagem
  const [loading, setLoading] = useState(false); // Para controlar o estado de loading durante o upload

  useEffect(() => {
    fetchRegistros();
    fetchFuncionarios();
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

  const fetchFuncionarios = async () => {
    const { data, error } = await supabase
      .from('funcionarios') // Supondo que a tabela de funcionários seja 'funcionarios'
      .select('id, nome, imagem_url');
    if (!error) setFuncionarios(data);
  };

  const handleCadastrarFuncionario = async () => {
    if (!nomeFuncionario || !fotoFuncionario) {
      alert('Nome e Foto são obrigatórios!');
      return;
    }

    setLoading(true);

    // Fazer upload da foto do funcionário para o Supabase Storage no bucket 'funcionarios'
    const { data, error } = await supabase.storage
      .from('funcionarios') // Nome do bucket
      .upload(`public/${fotoFuncionario.name}`, fotoFuncionario); // Upload na pasta 'public/'

    if (error) {
      alert('Erro ao fazer upload da foto: ' + error.message);
      setLoading(false);
      return;
    }

    // Pegar a URL pública da foto após o upload
    const urlFoto = data?.path
      ? `https://ndrdaembejcfyfjaifze.supabase.co/storage/v1/object/public/funcionarios/${data.path}` // URL pública da imagem
      : '';

    const { error: insertError } = await supabase
      .from('funcionarios')
      .insert([{
        nome: nomeFuncionario,
        imagem_url: urlFoto,
      }]);

    setLoading(false);

    if (insertError) {
      alert('Erro ao salvar funcionário: ' + insertError.message);
    } else {
      alert('Funcionário cadastrado com sucesso!');
      setNomeFuncionario('');
      setFotoFuncionario(null);
      setFotoPreview(null); // Limpa o preview da foto
      fetchFuncionarios(); // Atualiza a lista de funcionários
    }
  };

  const handleSubmit = async () => {
    const payload = {
      fogo: fogo || null,
      agua: agua || null,
      terra: terra || null,
      ar: ar || null,
      avatar: avatar || null,
      data_init: dataInit || null,
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
    setDataInit(registro.data_init || '');
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
    setDataInit('');
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
            {funcionarios.map(({ nome }) => (
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
          {funcionarios.filter(n => n.nome !== 'Nenhum').map(({ nome }) => (
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
        label="📅 Data de Início"
        type="date"
        fullWidth
        sx={{ mb: 3 }}
        InputLabelProps={{ shrink: true }}
        value={dataInit}
        onChange={(e) => setDataInit(e.target.value)}
      />

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
          <Tab label="Cadastrar Funcionário" />
          <Tab label="Gerenciar Dinâmica" />
        </Tabs>

        <Divider sx={{ mb: 3 }} />

        {tab === 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Cadastrar Novo Funcionário
            </Typography>
            <TextField
              label="Nome do Funcionário"
              fullWidth
              value={nomeFuncionario}
              onChange={(e) => setNomeFuncionario(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              component="label"
              sx={{
                backgroundColor: '#9A1FFF',
                color: '#fff',
                '&:hover': { backgroundColor: '#8014d8' }
              }}
            >
              Selecionar Foto
              <input
                type="file"
                hidden
                onChange={e => {
                  const file = e.target.files[0];
                  setFotoFuncionario(file);
                  if (file) {
                    setFotoPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </Button>
            {fotoPreview && (
              <Box mt={2} sx={{ textAlign: 'center' }}>
                <img src={fotoPreview} alt="Foto pré-visualizada" width={120} height={120} style={{ borderRadius: '50%' }} />
              </Box>
            )}
            <Box display="flex" gap={2} mt={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleCadastrarFuncionario}
                sx={{
                  backgroundColor: '#9A1FFF',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#8014d8' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Cadastrar'}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>{Formulario()}</Box>
        )}
      </Paper>
    </Box>
  );
}
