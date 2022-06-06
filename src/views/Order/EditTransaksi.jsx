import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { API } from '../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { alertState } from '../../Recoil/Alert';
import { dataOrder, dataTransaksi } from '../../Recoil/Order'
import { useRecoilState } from 'recoil'

const selects = ['pending', 'paid_off', 'expired', 'process']
const EditTransaksi = () => {
    const id = window.location.pathname.split('/')[2]
    console.log(id);
    const navigate = useNavigate()
    const [form, setForm] = useState({
        status: null
    })
    const [loading, setLoading] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    

    //recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const [order, setOrder] = useRecoilState(dataOrder)
    const [transaksi, setTransaksi] = useRecoilState(dataTransaksi)

    const setStatusOrder = async () => {
        setIsComplete(false)
        try {
            const res = await axios.get(`${API}transaction/payment/show/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            // console.log(res)
            setForm({
                status: res.data.data.status
            })
            setIsComplete(true)
            
        } catch (err) {
            err.response && console.log(err.response)
        }
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            setStatusOrder()
        }

        return () => mounted = false
    }, [id])

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        axios.patch(`${API}transaction/payment/update_status/${id}?status=${form.status}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            console.log(res)
            setLoading(false)
            setAlert({
                display: true,
                message: 'Berhasil Edit Status Pembayaran'
            })
            setTimeout(() => {
                setAlert({
                    display: false,
                    message: ''
                })
            }, 6000)
            setOrder({
                ...order,
                data: []
            })
            setTransaksi([])
            navigate('/transaksi')
        })
        .catch(err => {
            err.response && console.log(err.response)
            setLoading(false)
        })
    }

    return (
        <Box component="div" sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography>
                Form Edit Status Pembayaran
            </Typography>
            {isComplete &&
            <Box component='form' onSubmit={onSubmit} sx={{
                mt: 2
            }}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel id={`id-status`}>
                        Status Pembayaran
                    </InputLabel>
                    <Select
                        size='small'
                        value={form.status}
                        name={'status'} 
                        labelId={`id-status`}
                        onChange={onChange}
                        >
                        {selects.map((select, i) => (
                            <MenuItem key={i} value={select}>
                                {select === 'pending' && 'Pending'}
                                {select === 'paid_off' && 'Paid Off'}
                                {select === 'expired' && 'Expired'}
                                {select === 'process' && 'Process'}
                                {select === 'canceled' && 'Canceled'}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <LoadingButton
                        type="submit"
                        variant="contained"
                        sx={{mt: 2, px: 4, borderRadius: 25, width: '100%' }}
                        loading={loading}
                >
                    Simpan
                </LoadingButton>
            </Box>
            }
            {!isComplete &&
            <CircularProgress sx={{ width: 50, display: 'block', mt: 2}} />
            }
        </Box>
    );
};

export default EditTransaksi;