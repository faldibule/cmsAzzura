import React, { useState, useEffect, useRef } from 'react';
import { Box, FormGroup, FormControlLabel, Switch, Paper, Chip, Button, FormHelperText, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack } from '@mui/material'
import {  blue } from '@mui/material/colors';
import { useRecoilState, useRecoilValue } from 'recoil'
import { kategoriParent } from '../../Recoil/Kategori';
import { API } from '../../Variable/API'
import axios from 'axios'
import { LoadingButton } from '@mui/lab';
import { allAttr, initStateParent, parentAttr } from '../../Recoil/Attr';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useNavigate } from 'react-router-dom'
import { alertState } from '../../Recoil/Alert';
import { allProduct } from '../../Recoil/Product';
import { dataSizepack } from '../../Recoil/Size';
import CurrencyFormat from 'react-currency-format';


const banyak_foto = [1, 2, 3, 4, 5]
const EditProduct = () => {
    //ref
    const number = useRef()
    number.current = 0
  
    //product id
    const id = window.location.href.split('/')[5]

    //product recoil
    const [product, setProduct] = useRecoilState(allProduct)

    //alert recoil
    const [alert, setAlert] = useRecoilState(alertState)

    //navigate
    const navigate = useNavigate()

    // state
    //isComplete
    const [isComplete, setIsComplete] = useState(false)
    const [clear, setClear] = useState(false)

    // berat
    const [beratUkuran, setBeratUkuran] = useState({
        berat: null,
        ukuran: null
    })

    // size
    const [image, setImage] = useState({
        image_file: '',
        image_preview: '',
    })

    // foto product
    const [fotoProduk, setFotoProduk] = useState({})

    //loading button
    const [loading, setLoading] = useState(false)

    //form
    const [form, setForm] = useState({
        sku: '',
        video_url: null,
        nama: null,
        harga: null,
        status: 'active',
        stok: '',
        minimal_order: null,
        sizePack: '',
        ckEditor: null,
        panjang: '',
        tinggi: '',
        berat: null,
        preorder: null,
        category_parent: '1',
        category_child: null,
        diskon: '',
        discount_type: '',
    })

    //error
    const [errors, setErrors] = useState({})

    //child untuk attr dan kategori
    const [child, setChild] = useState({
        category: [],
        variant: []
    })

    // Size Pack
    const [size, setSize] = useRecoilState(dataSizepack)

    // attribute atau variant
    const parentVariant = useRecoilValue(parentAttr)
    const parentInit = useRecoilValue(initStateParent)
    const [select, setSelect] = useState(parentInit)
    const [allAttribute, setAllAttribute] = useRecoilState(allAttr)
    const [variantCount, setVariantCount] = useState([])
    const [variantParent, setVariantParent] = useState({})
    const [variantSub, setVariantSub] = useState({})
    const [variantForm, setVariantForm] = useState({})
    const [variantForm2, setVariantForm2] = useState({})
    
    // Kategori
    const parentKategori = useRecoilValue(kategoriParent)

    // pre order
    const [check, setCheck] = useState(false)
    const [satuanPreorder, setSatuanPreorder] = useState('day')

    //variant main
    const [main, setMain] = useState(0)
    const [main2, setMain2] = useState('00')
    
    //variant combination
    const [variantOption, setVariantOption] = useState([])
    const [variantOption2, setVariantOption2] = useState([])

    //combination value
    const [combination, setCombination] = useState([])
    const [combination2, setCombination2] = useState([])

    // Diskon
    const [discountCheck, setDiscountCheck] = useState(false)


    const discountChange = (event) => {
        setDiscountCheck(event.target.checked)
    };

    const setDataCombination = () => {
        let variantTemp = {}
        let main = ''
        combination.map((val, i) => {
            variantTemp = {
                ...variantTemp,
                [`form-${i}`]: {
                    sku: val.sku === null ? '' : val.sku,
                    stok: val.stock,
                    harga: val.price,
                    status: val.status,
                    image_file: '',
                    image_preview: val.image_url === null ? '' : val.image_url,
                    main: val.main
                }
            }
            if(val.main !== 0){
                main = i
            }
        })
        setVariantForm(variantTemp)
        setMain(main)
        console.log(variantTemp)
    }

    const getData1Variant = (res) => {
        if(res.data.data.product_variant_option.length === 1){
            setVariantCount(['i'])
            setVariantParent({
                'variantParent-0': res.data.data.product_variant_option[0].variant_name,
            })
            setVariantOption([...res.data.data.product_variant_option])
            setCombination([...res.data.data.product_combination])
            let temp = []
            res.data.data.product_variant_option.map((val, i) => {
                let variantOptionTemp = []
                val.product_variant_option_value.map(p => {
                    variantOptionTemp.push(p.variant_option_name)
                })
                temp.push(variantOptionTemp)
            })
            setVariantSub({
                'variantSub-0': typeof temp[0] === 'string' ? temp[0].split(',') : temp[0],
            })
            setIsComplete(true)
        }
    }

    const setDataCombination2 = () => {
        let nomorUrut = 0
        let variantTemp = {}
        let main = ''
        for(let i = 0; i < variantOption2[0].length; i++){
            for(let j = 0; j <  variantOption2[1].length; j++){
                variantTemp = {
                    ...variantTemp,
                    [`form-${i}${j}`]: {
                        sku: combination2[nomorUrut].sku === null || combination2[nomorUrut].sku === "undefined" ? '' : combination2[nomorUrut].sku,
                        stok: combination2[nomorUrut].stock,
                        harga: combination2[nomorUrut].price,
                        status: combination2[nomorUrut].status,
                        image_file: '',
                        image_preview: combination2[nomorUrut].image_url === null ? '' : combination2[nomorUrut].image_url,
                        main: combination2[nomorUrut].main
                    }
                }
                if(combination2[nomorUrut].main !== 0){
                    main = `${i}${j}`
                }
                nomorUrut++
            }
        }
        setVariantForm2(variantTemp)
        setMain2(main)
        console.log(variantTemp)
    }

    const getData2Variant = (res) => {
        if(res.data.data.product_variant_option.length === 2){
            setVariantOption2([[...res.data.data.product_variant_option[0].product_variant_option_value], [...res.data.data.product_variant_option[1].product_variant_option_value]])
            setCombination2([...res.data.data.product_combination])
            let temp = []
            res.data.data.product_variant_option.map((val, i) => {
                //variant option
                let variantOptionTemp = []
                val.product_variant_option_value.map(p => {
                    variantOptionTemp.push(p.variant_option_name)
                })
                temp.push(variantOptionTemp)
            })
            setVariantSub({
                'variantSub-0': typeof temp[0] === 'string' ? temp[0].split(',') : temp[0],
                'variantSub-1': typeof temp[1] === 'string' ? temp[1].split(',') : temp[1],
            })
            setVariantCount(['i', 'i'])
            setVariantParent({
                'variantParent-0': res.data.data.product_variant_option[0].variant_name,
                'variantParent-1': res.data.data.product_variant_option[1].variant_name
            })
            setIsComplete(true)
        }
    }

    const setProductData = () => {
        axios.get(`${API}product/show/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            console.log(res.data)
            // image produk
            let tempImage = {}
            res.data.data.product_image.map((val, i) => {
                tempImage = {
                    ...tempImage,
                    [`image-${i+1}`]: {
                        image_file: '',
                        image_preview: val.product_image_url
                    }
                }
            })
            
            // Form
            let temp = {
                sizePack: res.data.data.size_guide === null ? "" : res.data.data.size_guide,
                ckEditor: res.data.data.description,
                minimal_order: res.data.data.minimum_order,
                nama: res.data.data.product_name,
                status: res.data.data.status,
                video_url: res.data.data.video_url === null ? '' : res.data.data.video_url,
                berat: res.data.data.product_weight,
                panjang: res.data.data.length,
                tinggi: res.data.data.height,
                category_parent: res.data.data.category.id,
                category_child: res.data.data.sub_category.id,
            }
            if(res.data.data.product_variant_option.length === 0){
                temp.sku = res.data.data.product_combination[0].sku === null ? '' : temp.sku = res.data.data.product_combination[0].sku
                temp.harga = res.data.data.product_combination[0].price
                temp.stok = res.data.data.product_combination[0].stock
            }else{
                temp.sku = ''
                temp.harga = ''
                temp.stok = ''
            }

            
            //variant
            getData1Variant(res)
            getData2Variant(res)
            
            // foto produk
            setFotoProduk(tempImage)

            // berat
            setBeratUkuran({
                ...beratUkuran,
                berat: res.data.data.weight_unit,
                ukuran: res.data.data.size_unit
            })

            //diskon
            if(res.data.data.active_discount === 1){
                setDiscountCheck(true)
                temp.discount_type = res.data.data.discount_type
                temp.diskon = res.data.data.discount
            }else{
                setDiscountCheck(false)
                temp.discount_type = res.data.data.discount_type === null ? '' : res.data.data.discount_type
                temp.diskon = res.data.data.discount === null ? '' : res.data.data.discount
            }

            // preorder
            if(res.data.data.preorder === 1){
                setCheck(true)
                setSatuanPreorder(res.data.data.duration_unit)
                temp.preorder = res.data.data.duration
            }else{
                setCheck(false)
                temp.preorder = ''
            }

            // form
            setForm({
                ...form,
                ...temp
            })
            
            //complete
            if(res.data.data.product_variant_option.length === 0){
                setIsComplete(true)
            }

            //clear
            setClear(true)

            

        })
        .catch(err => {
            err.response && console.log(err.response)
        })
        
    }

    useEffect(() => {
        let mounted = true
        if(mounted && child.category.length !== 0 && allAttribute.length !== 0 && !clear ){
            setProductData()
        }

        return () => mounted = false
    }, [id, child.category.length, allAttribute.length])

    useEffect(() => {
        let mounted = true

        if(variantOption.length !== 0 && combination.length !== 0){
            setDataCombination()
        }

        return () => mounted = false
    }, [variantOption.length, combination.length])

    useEffect(() => {
        let mounted = true

        if(variantOption2.length !== 0 && combination2.length !== 0){
            setDataCombination2()
        }

        return () => mounted = false
    }, [variantOption2.length, combination2.length])

    const satuanPreorderChange = (e) => {
        setSatuanPreorder(e.target.value)
    }

    const checkChange = (event) => {
        setCheck(event.target.checked)
    };

    const setAttr = () => {
        let x = []
            parentVariant.map((p, i) => {
                axios.get(`${API}variant_option/fetch?variant_id=${p.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                })
                .then(child => {
                    x.push({
                        ...p,
                        child: [...child.data.data]
                    })
                    if(i === parentVariant.length - 1){
                        setAllAttribute([...x])
                    }
                })
                .catch(err => {
                    if(err.response) console.log(err.response)
                })
            })
    }
    
    useEffect(() => {
        let mounted = true;

        if(mounted && allAttribute.length === 0){
            setAttr()
        }
        return () => mounted = false
    }, [])

    const setSizePack = () => {
        axios.get(`${API}size_pack/fetch`, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })
        .then(res => {
              setSize([...res.data.data])
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }
    
    useEffect(() => {
        let mounted = true
        if(mounted && size.length === 0){
            setSizePack()
        }

        return () => mounted = false
    }, [size.length])

    const onChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value
        })
    }

    const imageHandle = (e) => {
        let image_preview = URL.createObjectURL(e.target.files[0])
        let image_file = e.target.files[0];
        setImage({
            image_file,
            image_preview
        })
    }

    const fotoProdukChange = (e) => {
        let image_preview = URL.createObjectURL(e.target.files[0])
        let image_file = e.target.files[0];
        setFotoProduk({
        ...fotoProduk,
        [e.target.name]: {
                image_file,
                image_preview
            }
        })
    }

    const ckEditorChange = (e, editor) => {
        const data = editor.getData()
        setForm({
        ...form,
        ckEditor: data
        })
    }

    const setKategoriChild = (id) => {
        axios.get(`${API}sub_category/fetch?category_id=${id}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('authToken')
        }
        })
        .then(res => {
            if(res.data.data.length === 0){
                setChild({
                  ...child,
                  category: [{
                    id: '1',
                    sub_category_name: 'kosong'
                  }]
                })
                setForm({
                    ...form,
                    category_child: ''
                })
            }else{
                setChild({
                  ...child,
                  category: [...res.data.data]
                })
            }
            
        })
        .catch(err => {
            if(err.response) console.log(err.response)
        })
        
    }

    const variantParentChange = (e) => {
        setVariantParent({
        ...variantParent,
        [e.target.name]: e.target.value
        })
    }

    const variantSubChange = (e) => {
        setVariantSub({
            ...variantSub,
            [e.target.name]: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
        })
    }

    const variantDelete = (index) => {
        confirmAlert({
            title: 'Data Variant Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
            {
                label: 'Ya',
                onClick: () => {
                let x = [...variantCount]
                delete x[index]
                console.log(x)
                setVariantCount([...x])

                }
            },
            {
                label: 'Tidak',
                onClick: () => console.log('Click No')
            }
            ]
        });
    }

    const beratUkuranChange = (e) => {
        setBeratUkuran({
        ...beratUkuran,
        [e.target.name]: e.target.value
        })
    }

    const variantFormChange = (e, index) => {
        setVariantForm({
        ...variantForm,
        [`form-${index}`]: {
            ...variantForm[`form-${index}`],
            [e.target.name]: e.target.value
        }
        })
    }

    const variantCheckChange = (e, index) => {
        setVariantForm({
        ...variantForm,
        [`form-${index}`]: {
            ...variantForm[`form-${index}`],
            [e.target.name]: e.target.checked ? 'active' : 'not_active'
        }
        })

    };

    const variantImageChange = (e, index) =>{
        let image_preview = URL.createObjectURL(e.target.files[0])
        let image_file = e.target.files[0];
        setVariantForm({
        ...variantForm,
        [`form-${index}`]: {
            ...variantForm[`form-${index}`],
            image_preview,
            image_file
        }
        })
    }

    const variantMainChange = (e, index) => {
        setMain(index)
    }

    const variantFormChange2 = (e, index) => {
        setVariantForm2({
            ...variantForm2,
            [`form-${index}`]: {
                ...variantForm2[`form-${index}`],
                [e.target.name]: e.target.value
            }
        })
    }

    const variantCheckChange2 = (e, index) => {
        setVariantForm2({
        ...variantForm2,
        [`form-${index}`]: {
            ...variantForm2[`form-${index}`],
            [e.target.name]: e.target.checked ? 'active' : 'not_active'
        }
        })
    };

    const variantImageChange2 = (e, index) =>{
        let image_preview = URL.createObjectURL(e.target.files[0])
        let image_file = e.target.files[0];
        setVariantForm2({
        ...variantForm2,
        [`form-${index}`]: {
            ...variantForm2[`form-${index}`],
            image_preview,
            image_file
        }
        })
    }

    
    const variantMainChange2 = (e, index) => {
        setMain2(index)
    }

    const formStatusChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.checked ? 'active' : 'not_active'
        })
    }

    // Mass Edit
  const [massEdit, setMassEdit] = useState({
    sku: '',
    harga: '',
    stock: '',
    image: {
      image_file: '',
      image_preview: '',
    }
  })

  const massEditChange = (e) => {
    setMassEdit({
      ...massEdit,
      [e.target.name]: e.target.value
    })
  }

  const massImageChange = (e) => {
    let image_preview = URL.createObjectURL(e.target.files[0])
    let image_file = e.target.files[0];
    setMassEdit({
      ...massEdit,
      image: {
        image_file,
        image_preview
      }
    })
  }

  const [massCheck, setMassCheck] = useState(false)

  const massCheckChange = (event) => {
    setMassCheck(event.target.checked)
  };

  const massEditClicked = () => {
    if(variantCount.filter(filter => filter === 'i').length > 1){
      let temp = {}
      if(typeof variantSub[`variantSub-${variantCount.indexOf('i')}`] !== 'undefined'){
        if(typeof variantSub[`variantSub-${variantCount.indexOf('i', variantCount.indexOf('i') + 1)}`] !== 'undefined'){

          variantSub[`variantSub-${variantCount.indexOf('i')}`].map((val1, index3) => {
            return variantSub[`variantSub-${variantCount.indexOf('i', variantCount.indexOf('i') + 1)}`].map((val2, index4) => {
              temp = {
                ...temp,
                [`form-${index3}${index4}`]:{
                  ...variantForm2[`form-${index3}${index4}`],
                    sku: massEdit.sku,
                    harga: massEdit.harga,
                    stok: massEdit.stock,
                    image_file: massEdit.image.image_file,
                    image_preview: massEdit.image.image_preview
                }
              }

            })

          })

        }
      }
        setVariantForm2({
          ...temp
        })
    }

    if(variantCount.filter(filter => filter === 'i').length === 1){
      let temp = {}
      variantCount.map((count, i) => {
        if(count === 'i' && typeof variantSub[`variantSub-${i}`] !== 'undefined'){

          if(variantCount.filter(filter => filter === 'i').length === 1 && typeof variantSub[`variantSub-${i}`] !== 'undefined'){

            return variantSub[`variantSub-${i}`].map((x, index2) => {
              temp = {
                ...temp,
                [`form-${index2}`]:{
                  ...variantForm[`form-${index2}`],
                    sku: massEdit.sku,
                    harga: massEdit.harga,
                    stok: massEdit.stock,
                    image_file: massEdit.image.image_file,
                    image_preview: massEdit.image.image_preview
                }
              }


            })
          }
        }
      })
      setVariantForm({
        ...temp,
      })
    }
  }



    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        let variant = []
        let combination = []
        let product_image = []

        if(variantCount.filter(x => x === 'i').length === 2){

            let index1 = variantCount.indexOf('i')
            let index2 = variantCount.indexOf('i', variantCount.indexOf('i') + 1)
            variant.push({
            variant_name: variantParent[`variantParent-${index1}`],
            variant_option: variantSub[`variantSub-${index1}`]
            })
            variant.push({
            variant_name:variantParent[`variantParent-${index2}`],
            variant_option: variantSub[`variantSub-${index2}`]
            })

            variantSub[`variantSub-${variantCount.indexOf('i')}`].map((val1, i) => {
            variantSub[`variantSub-${variantCount.indexOf('i', variantCount.indexOf('i') + 1)}`].map((val2, j) => {
                
                combination.push({
                combination_string : `${val1}-${val2}`,
                sku: variantForm2[`form-${i}${j}`]['sku'],
                price: variantForm2[`form-${i}${j}`]['harga'],
                stock: variantForm2[`form-${i}${j}`]['stok'],
                image: variantForm2[`form-${i}${j}`]['image_file'],
                status: variantForm2[`form-${i}${j}`]['status'],
                main: main2 === `${i}${j}` ? 1 : 0
                })
            
            })
            })
        }

        if(variantCount.filter(x => x === 'i').length === 1){
        let index = variantCount.indexOf('i')
        variant.push({
            variant_name: variantParent[`variantParent-${index}`],
            variant_option: variantSub[`variantSub-${index}`]
        })
        variantSub[`variantSub-${index}`].map((val, i) => {

            combination.push({
            combination_string : val,
            sku: variantForm[`form-${i}`]['sku'],
            price: variantForm[`form-${i}`]['harga'],
            stock: variantForm[`form-${i}`]['stok'],
            image: variantForm[`form-${i}`]['image_file'],
            status: variantForm[`form-${i}`]['status'],
            main: i === main ? 1 : 0
            }) 

        })
        }

        if(JSON.stringify(fotoProduk) !== '{}'){
        banyak_foto.map((val, i) => {
            if(typeof fotoProduk[`image-${val}`] !== 'undefined'){
            product_image.push({
                product_image: fotoProduk[`image-${val}`].image_file,
                order: val,
            }) 
            }
        })
        }
        
        const formData = new FormData()
        //overriding method
        formData.append('_method', 'put')

        // kategori
        formData.append('category_id', form.category_parent)
        formData.append('sub_category_id', form.category_child)

        // deskripsi, nama, sizeguide, min order
        formData.append('description', form.ckEditor)
        formData.append('product_name', form.nama)
        formData.append('size_guide', form.sizePack)
        formData.append('minimum_order', form.minimal_order)

        // berat
        formData.append('product_weight', form.berat)
        formData.append('weight_unit', beratUkuran.berat)
        // ukuran
        formData.append('size_unit', beratUkuran.ukuran === null ? '' : beratUkuran.ukuran)
        if(beratUkuran.ukuran !== null){
            formData.append('length', form.panjang)
            formData.append('height', form.tinggi)
        }

        formData.append('status', form.status)

        formData.append('active_discount', discountCheck ? 1 : 0)
        if(discountCheck){
            formData.append('discount_type', form.discount_type)
            formData.append('discount', form.diskon)
        }

        //pre order
        formData.append('preorder', check ? 1 : 0)
        if(check){
            formData.append('duration', form.preorder)
            formData.append('duration_unit', satuanPreorder)
        }
        
        //jika variant kosong
        if(variantCount.filter(x => x === 'i').length === 0){
            formData.append('sku', form.sku)
            formData.append('stock', form.stok)
            formData.append('price', form.harga)
        }

        //product Image
        if(product_image.length !== 0){
            product_image.map((val, i) => {
                if(val.product_image !== ''){
                    formData.append(`product_image[${i}][product_image]`, val.product_image)
                }
                formData.append(`product_image[${i}][order]`, val.order)
            })
        }

        //video Url
        if(form.video_url !== ""){
            formData.append('video_url', form.video_url)
        }

        //variant dan combination
        if(variantCount.filter(x => x === 'i').length !== 0){
            variant.map((val, i) => {
                formData.append(`variant[${i}][variant_name]`, val.variant_name)
                val.variant_option.map((val2, j) => {
                formData.append(`variant[${i}][variant_option][${j}]`, val2)
                })
            })
            combination.map((val, i) => {
                formData.append(`combination[${i}][sku]`, val.sku)
                formData.append(`combination[${i}][combination_string]`, val.combination_string)
                formData.append(`combination[${i}][price]`, val.price)
                formData.append(`combination[${i}][stock]`, val.stock)
                formData.append(`combination[${i}][status]`, val.status)
                formData.append(`combination[${i}][main]`, val.main)
                if(val.image !== ''){
                    formData.append(`combination[${i}][image]`, val.image)
                }
            })
        }
        


        console.log(Object.fromEntries(formData))
        // setLoading(false)
        // setAlert({
        //   message: 'Produk Berhasil Ditambah',
        //   display: true
        // })
        // navigate(`/product`)
        
        axios.post(`${API}product/update/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })
        .then(res => {
          console.log(res.data)
          setLoading(false)
          setProduct({
            ...product,
            data: []
          })
          setAlert({
            message: 'Produk Berhasil Diubah',
            display: true
          })
          setTimeout(() => {
            setAlert({
                message: '',
                display: false
            })
          }, 6000)
          navigate(`/product`)
        })
        .catch(err => {
          if(err.response){
            setErrors(err.response.data.errors)
            console.log(err.response)
          }
          window.scrollTo({
            top: 0, 
            behavior: 'smooth'
            /* you can also use 'auto' behaviour
               in place of 'smooth' */
          });  
          setLoading(false)
        })

        
    }

    useEffect(() => {
        let mounted = true;
        if(mounted){
            setKategoriChild(form.category_parent)
        }
        return () => {
            mounted = false
            setChild({
                ...child,
                category: []
            })
        }
    }, [form.category_parent])

    return (
        <div>
        {form.nama !== null &&
        <Box
            onSubmit={onSubmit}
            component='form'
            sx={{ 
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
        }}>

            {/* Image dan video URL Produk */}
            <Box component="div" sx={{ my: 2, boxShadow: 2, p: 2, minWidth:600 }}>
                <Typography variant="h6" color="initial">
                Image dan Video Produk
                </Typography>
                <Box sx={{ display: 'flex' }}>
                {banyak_foto.map((val, i) => (
                    <Box key={i} sx={{ ml: 2 }}>
                    <label htmlFor={`image-input-${val}`} style={{ cursor: 'pointer' }} >
                        {typeof fotoProduk[`image-${val}`] !== 'undefined' ?
                        <img src={fotoProduk[`image-${val}`].image_preview} style={{ display: 'block', height: 50, objectFit: 'cover', objectPosition: 'center', marginTop: '20px' }} />
                        :
                        <AddPhotoAlternateIcon sx={{ fontSize: '5rem' }}/>
                        }
                    </label>
                    <input 
                        name={`image-${val}`}
                        id={`image-input-${val}`} 
                        type="file" 
                        onChange={fotoProdukChange} 
                        style={{ display: 'none' }}
                    />
                    </Box>
                ))}
                </Box>
                
                <Box sx={{
                mt: 2,
                minWidth: 400,
                }}>
                <TextField
                    sx={{ mt: 2, width: '100%' }}
                    size='small' 
                    name="video_url" 
                    value={form.video_url} 
                    onChange={onChange} 
                    label="Link Video Produk" 
                    variant="outlined" 
                    helperText={typeof errors?.video_url !== 'undefined' ? <span style={{color: 'red'}}>{errors.video_url[0]}</span> : ''}
                    error={typeof errors?.video_url !== 'undefined' ? true : false}
                />
                </Box>

                

                
            </Box>

            {/* Informasi */}
            <Box component="div" sx={{ boxShadow: 2, p:2, minWidth: 600,  }}>
                <Typography variant="h6" color="initial">
                Informasi Produk
                </Typography>
                <Box sx={{ display: 'flex', my: 2, flexDirection: 'column', minWidth: 400 }}>
                    {variantCount.filter(x => x === 'i').length === 0 && 
                    <TextField
                        sx={{ mt: 2 }}
                        size='small' name="sku" value={form.sku} onChange={onChange} label="SKU Product" variant="outlined"
                    />
                    }
                    <TextField sx={{mt: 2}}
                    required 
                    size='small' name="nama" value={form.nama} onChange={onChange} label="Nama Product" variant="outlined" 
                    />
                </Box>
            </Box>

            {/* Kategori Produk */}
            <Box component="div" sx={{ mt:2, boxShadow: 2, p:2, minWidth: 600 }}>
                <Typography variant="h6" color="initial">
                Kategori Produk
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {/* Kategori */}
                <FormControl sx={{
                        mt: 2
                    }}  
                    variant="standard"
                    
                    >
                        <InputLabel id={`id-kategori`}>
                        Kategori
                        </InputLabel>
                        <Select
                            value={form.category_parent}
                            name='category_parent'
                            size='small'
                            labelId={`id-kategori`}
                            onChange={onChange}
                            >
                            {parentKategori.map(parent => (
                            <MenuItem key={parent.id} value={parent.id}>
                                {parent.category_name}
                            </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText sx={{ml: 2}}></FormHelperText>
                    </FormControl>
                {/*Sub Kategori */}
                {child.category.length !== 0 &&
                    <FormControl variant="standard" sx={{
                    mt:2,
                    minWidth: 400
                    }} >
                        <InputLabel id={`id-sub-kategori`}>
                        Sub Kategori
                        </InputLabel>
                        <Select
                            value={form.category_child}
                            name='category_child'
                            size='small'
                            labelId={`id-sub-kategori`}
                            onChange={onChange}
                            >
                            {child.category.map(child => {
                                if(child.sub_category_name === 'kosong'){
                                    return (
                                        <MenuItem disabled={true} key={child.id} value={child.id}>
                                        {child.sub_category_name}
                                        </MenuItem>
                                    )
                                }else{
                                    return (
                                        <MenuItem key={child.id} value={child.id}>
                                        {child.sub_category_name}
                                        </MenuItem>
                                    )
                                }
                            
                            })}
                        </Select>
                        <FormHelperText sx={{ml: 2}}></FormHelperText>
                    </FormControl>
                    }
                    {child.category.length === 0 &&
                    <Box component='div' sx={{width: '50%', mt:2 }} >
                        <CircularProgress size={30}/>
                    </Box>
                    }
                </Box>
            </Box>
            
            {/* Attribut Produk */}
            <Box component="div" sx={{ mt:2, boxShadow: 2, p:2, minWidth: 600 }}>
                <Typography variant="h6" color="initial">
                Atribut Produk (Maximum 2 Variant)
                </Typography>
                {allAttribute.length !== 0 &&
                <Button disabled={variantCount.filter(x => x === 'i').length === 2} sx={{ borderRadius: 25, p: 1, minWidth: 50 }} variant="contained" onClick={() => setVariantCount([...variantCount, 'i'])}>
                    <AddBoxIcon /> Tambah Variant
                </Button>
                }

                {/* Form */}
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {isComplete &&
                variantCount.map((val, i) => {
                    if(val === 'i'){
                    return (
                        <Box key={`section-${i}`} component="div" sx={{
                        display: 'flex',
                        alignItems: 'center'
                        }}>

                            {/* Parent Variant */}
                            <FormControl 
                            sx={{
                                mt: 2,
                                minWidth: 400
                            }}
                            variant="standard"
                            
                            >
                            <InputLabel id={`id-${i}`}>
                                Type Variant
                            </InputLabel>
                            <Select
                                value={typeof variantParent[`variantParent-${i}`] === 'undefined' ? '' : variantParent[`variantParent-${i}`]}
                                name={`variantParent-${i}`}
                                size='small'
                                labelId={`id-${i}`}
                                onChange={variantParentChange}
                                
                                >
                                {parentVariant.map((val) => (
                                    <MenuItem key={`section-${val.id}`} value={val.variant_name} >
                                    {val.variant_name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText sx={{ml: 2}}></FormHelperText>
                            </FormControl>
                            
                            {/* Sub Variant */}
                            {typeof variantParent[`variantParent-${i}`] !== 'undefined' &&
                            <FormControl 
                            sx={{
                                ml: 2,
                                mt: 2,
                                minWidth: 400
                            }}
                            variant="standard"
                            
                            >
                            
                            <Select
                                value={typeof variantSub[`variantSub-${i}`] === 'undefined' ? [] : variantSub[`variantSub-${i}`]}
                                name={`variantSub-${i}`}
                                labelId={`idsub-${i}`}
                                onChange={variantSubChange}
                                multiple
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mr: 1 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                    </Box>
                                )}
                                >
                                {allAttribute.filter(p => p.variant_name === variantParent[`variantParent-${i}`])[0].child.map(item => (
                                    <MenuItem key={item.id} value={item.variant_option_name}>
                                        {item.variant_option_name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText sx={{ml: 2}}></FormHelperText>
                            </FormControl>
                            }

                            {/* Delete Variant */}
                            <Button>
                            <DeleteForeverIcon onClick={() => variantDelete(i)} sx={{ fontSize: '1.5rem', color: 'red' }}/>
                            </Button>
                            
                        </Box>
                    )
                    }
                })
                }
                </Box>
                {!isComplete &&
                    <Box component='div' sx={{width: '50%', mt:2 }} >
                        <CircularProgress size={30}/>
                    </Box>
                }

                {/* Mass Edit */}
            {variantCount.length !== 0 && variantCount.some(s => s === 'i') && JSON.stringify(variantSub) !== '{}' &&
              <Stack direction="row" mt={3}  gap={5}>
                {/* Switch */}
                <FormGroup 
                    sx={{ ml: 2 }}>
                      <FormControlLabel 
                        control={
                          <Switch
                              name='massCheck'
                              checked={massCheck}
                              onChange={massCheckChange}
                              inputProps={{ 'aria-label': 'controlled' }}
                          />
                        } 
                        label="Isi Massal" 
                      />
                  </FormGroup>

                {/* SKU */}
                <TextField
                    value={massEdit.sku}
                    name={`sku`} 
                    onChange={massEditChange} 
                    size='small' 
                    variant="outlined"
                    label="SKU"
                    disabled={!massCheck}
                />

                {/* Harga */}
                <TextField
                    value={massEdit.harga}
                    name={`harga`} 
                    onChange={massEditChange} 
                    size='small' 
                    variant="outlined"
                    label="Harga"
                    disabled={!massCheck}
                />

                {/* Stock */}
                <TextField
                    required 
                    value={massEdit.stock}
                    name={`stock`} 
                    onChange={massEditChange} 
                    size='small' 
                    variant="outlined"
                    label="Stock"
                    disabled={!massCheck}
                />

                {/* Image */}
                <Box>
                <label htmlFor={`image-mass`} style={{ cursor: 'pointer' }} >     
                    {massEdit.image.image_preview !== '' ?
                      <img style={{ display: 'block', height: '50px', objectFit: 'cover', objectPosition: 'center' }} src={massEdit.image.image_preview} alt={`image-mass`} />

                      :

                      <AddPhotoAlternateIcon />
                    }
                  </label>
                  <input 
                    id={`image-mass`} 
                    type="file" 
                    onChange={massImageChange} 
                    style={{ display: 'none' }}
                  />
                </Box>

                {/* Button */}
                <Button disabled={!massCheck} variant="contained" onClick={massEditClicked}>Terapkan</Button>
              </Stack>
            }

                {/* Table */}
                {variantCount.length !== 0 && variantCount.some(s => s === 'i') && JSON.stringify(variantSub) !== '{}' &&
                <TableContainer sx={{ mt: 1 }} component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableHead sx={{ backgroundColor: blue[500]}}>
                        <TableRow>
                            <TableCell sx={{ color: 'white'  }} align="center">Variant 1</TableCell>
                            {variantCount.filter(filter => filter === 'i').length > 1 && 
                            <TableCell sx={{ color: 'white'  }} align="center">Variant 2</TableCell>
                            }
                            <TableCell sx={{ color: 'white'  }} align="center">SKU</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Harga</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Stok</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Gambar</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Status</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Utama</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                    {/* 1 variant */}
                    {variantCount.map((count, i) => {
                        
                        
                        if(count === 'i' && typeof variantSub[`variantSub-${i}`] !== 'undefined'){
                        if(variantCount.filter(filter => filter === 'i').length === 1 && typeof variantSub[`variantSub-${i}`] !== 'undefined'){
                            return variantSub[`variantSub-${i}`].map((x, index2) => {
                            if(typeof variantForm[`form-${index2}`] === 'undefined'){
                                setVariantForm({
                                ...variantForm,
                                [`form-${index2}`]: {
                                    sku: '',
                                    harga: '',
                                    stok: '',
                                    image_file: '',
                                    image_preview: '',
                                    status: 'active',
                                }
                                })
                            }
                            return (
                                <TableRow key={index2}>
                                <TableCell align="center">{x}</TableCell>
                                <TableCell sx={{ maxWidth: 200 }} align="center">
                                    <TextField sx={{mt: 2}}
                                        value={typeof variantForm[`form-${index2}`] === 'undefined' ? '' : variantForm[`form-${index2}`]['sku'] }
                                        name={`sku`} 
                                        onChange={(e) => variantFormChange(e, index2)} 
                                        size='small' 
                                        variant="outlined"
                                        helperText={typeof errors[`combination.${index2}.sku`] !== 'undefined' ? errors[`combination.${index2}.sku`][0] : ''}
                                        error={typeof errors[`combination.${index2}.sku`]!== 'undefined' ? true : false} 
                                    />
                                </TableCell>
                                <TableCell sx={{ maxWidth: 200 }} align="center">
                                    <TextField sx={{mt: 2}}
                                        required
                                        value={typeof variantForm[`form-${index2}`] === 'undefined' ? '' : variantForm[`form-${index2}`]['harga'] }
                                        name={`harga`} 
                                        onChange={(e) => variantFormChange(e, index2)} 
                                        size='small' 
                                        variant="outlined"
                                        helperText={typeof errors[`combination.${index2}.price`] !== 'undefined' ? errors[`combination.${index2}.price`][0] : ''}
                                        error={typeof errors[`combination.${index2}.price`]!== 'undefined' ? true : false} 
                                    />
                                </TableCell>
                                <TableCell sx={{ maxWidth: 200 }} align="center">
                                    <TextField sx={{mt: 2}}
                                        required 
                                        value={typeof variantForm[`form-${index2}`] === 'undefined' ? '' : variantForm[`form-${index2}`]['stok'] }
                                        name={`stok`} 
                                        onChange={(e) => variantFormChange(e, index2)} 
                                        size='small' 
                                        variant="outlined"
                                        helperText={typeof errors[`combination.${index2}.stock`] !== 'undefined' ? errors[`combination.${index2}.stock`][0] : ''}
                                        error={typeof errors[`combination.${index2}.stock`]!== 'undefined' ? true : false} 
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <label htmlFor={`image-variant-${index2}`} style={{ cursor: 'pointer' }} >
                                    
                                    {typeof variantForm[`form-${index2}`] === 'undefined' ? 
                                        ''
                                    :
                                    variantForm[`form-${index2}`]['image_preview'] !== '' ?
                                        <img style={{ display: 'block', height: '50px', objectFit: 'cover', objectPosition: 'center' }} src={variantForm[`form-${index2}`]['image_preview']} />

                                        :

                                        <AddPhotoAlternateIcon />
                                    }
                                    </label>
                                    <input 
                                    id={`image-variant-${index2}`} 
                                    type="file" 
                                    onChange={(e) => variantImageChange(e, index2) } 
                                    style={{ display: 'none' }}
                                    />
                                    
                                </TableCell>
                                <TableCell align="center">
                                    <FormGroup sx={{ ml: 2 }}>
                                        <FormControlLabel 
                                        control={typeof variantForm[`form-${index2}`] === 'undefined' ? 
                                            <Switch
                                                name='status'
                                                checked={true}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                            :
                                            <Switch
                                                name='status'
                                                checked={variantForm[`form-${index2}`]['status'] === 'not_active' ? false : true}
                                                onChange={(e) => variantCheckChange(e, index2)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        } 
                                        label="" />
                                    </FormGroup>
                                </TableCell>
                                <TableCell align="center">
                                    <FormGroup sx={{ ml: 2 }}>
                                        <FormControlLabel 
                                        control={
                                            <Switch
                                                name='main'
                                                checked={main === index2 ? true : false}
                                                onChange={(e) => variantMainChange(e, index2)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        } 
                                        label="" />
                                    </FormGroup>
                                </TableCell>
                                
                                </TableRow>
                            )
                            })
                        }
                        }
                    })
                    }
                    
                    {/* 2 variant */}
                    {variantCount.filter(filter => filter === 'i').length > 1 && 
                        typeof variantSub[`variantSub-${variantCount.indexOf('i')}`] !== 'undefined' && 
                        typeof variantSub[`variantSub-${variantCount.indexOf('i', variantCount.indexOf('i') + 1)}`] !== 'undefined' && 
                        
                        variantSub[`variantSub-${variantCount.indexOf('i')}`].map((val1, index3) => {
                            return variantSub[`variantSub-${variantCount.indexOf('i', variantCount.indexOf('i') + 1)}`].map((val2, index4) => {

                            if(typeof variantForm2[`form-${index3}${index4}`] === 'undefined'){
                                
                                setVariantForm2({
                                ...variantForm2,
                                [`form-${index3}${index4}`]: {
                                    harga: '',
                                    stok: '',
                                    image_file: '',
                                    image_preview: '',
                                    status: 'active'
                                }
                                })
                            }

                            return (

                                <TableRow key={`${index3}${index4}}`}>
                                    <TableCell align="center">{val1}</TableCell>
                                    <TableCell align="center">{val2}</TableCell>
                                    <TableCell sx={{ maxWidth: 200 }} align="center">
                                    <TextField sx={{mt: 2}}
                                        value={typeof variantForm2[`form-${index3}${index4}`] === 'undefined' ? '' : variantForm2[`form-${index3}${index4}`]['sku'] }
                                        name={`sku`} 
                                        onChange={(e) => variantFormChange2(e, `${index3}${index4}`)}
                                        size='small' 
                                        variant="outlined"
                                        helperText={typeof errors[`combination.${number.current}.sku`] !== 'undefined' ? errors[`combination.${number.current}.sku`][0] : ''}
                                        error={typeof errors[`combination.${number.current}.sku`]!== 'undefined' ? true : false} 
                                    />
                                    </TableCell>
                                    <TableCell align="center">
                                    <TextField sx={{mt: 2, maxWidth: 200}}
                                        required 
                                        value={typeof variantForm2[`form-${index3}${index4}`] === 'undefined' ? '' : variantForm2[`form-${index3}${index4}`]['harga'] }
                                        name={`harga`} 
                                        onChange={(e) => variantFormChange2(e, `${index3}${index4}`)} 
                                        size='small' 
                                        variant="outlined"
                                        helperText={typeof errors[`combination.${number.current}.price`] !== 'undefined' ? errors[`combination.${number.current}.price`][0] : ''}
                                        error={typeof errors[`combination.${number.current}.price`]!== 'undefined' ? true : false} 
                                    />
                                    </TableCell>
                                    <TableCell align="center">
                                    <TextField sx={{mt: 2, maxWidth: 200}}
                                        required 
                                        value={typeof variantForm2[`form-${index3}${index4}`] === 'undefined' ? '' : variantForm2[`form-${index3}${index4}`]['stok'] }
                                        name={`stok`} 
                                        onChange={(e) => variantFormChange2(e, `${index3}${index4}`)} 
                                        size='small'  
                                        variant="outlined"
                                        helperText={typeof errors[`combination.${number.current}.stock`] !== 'undefined' ? errors[`combination.${number.current}.stock`][0] : ''}
                                        error={typeof errors[`combination.${number.current}.stock`]!== 'undefined' ? true : false} 
                                    />
                                    </TableCell>
                                    <TableCell align="center">
                                    <label htmlFor={`image-variant-${index3}${index4}`} style={{ cursor: 'pointer' }} >
                                        
                                        {typeof variantForm2[`form-${index3}${index4}`] === 'undefined' ? 
                                        ''
                                        :
                                        variantForm2[`form-${index3}${index4}`]['image_preview'] !== '' ?
                                            <img style={{ display: 'block', height: '50px', objectFit: 'cover', objectPosition: 'center' }} src={variantForm2[`form-${index3}${index4}`]['image_preview']} />

                                        :

                                        <AddPhotoAlternateIcon />
                                        }
                                    </label>
                                    <input 
                                        id={`image-variant-${index3}${index4}`} 
                                        type="file" 
                                        onChange={(e) => variantImageChange2(e, `${index3}${index4}`) } 
                                        style={{ display: 'none' }}
                                    />
                                    
                                    </TableCell>
                                    <TableCell align="center">
                                    <FormGroup sx={{ ml: 2 }}>
                                        <FormControlLabel 
                                            control={typeof variantForm2[`form-${index3}${index4}`] === 'undefined' ?
                                                <Switch
                                                    name='status'
                                                    checked={true}
                                                />
                                                :
                                                <Switch
                                                    name='status'
                                                    checked={variantForm2[`form-${index3}${index4}`]['status'] === 'not_active' ? false : true}
                                                    onChange={(e) => variantCheckChange2(e, `${index3}${index4}`)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />

                                            } 
                                            label="" 
                                        />
                                    </FormGroup>
                                    </TableCell>
                                    <TableCell align="center">
                                        <FormGroup sx={{ ml: 2 }}>
                                            <FormControlLabel 
                                            control={
                                                <Switch
                                                    name='main'
                                                    checked={main2 === `${index3}${index4}` ? true : false}
                                                    onChange={(e) => variantMainChange2(e, `${index3}${index4}`)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            } 
                                            label="" />
                                        </FormGroup>
                                    </TableCell>
                                    <TableCell sx={{ display: 'none' }}>
                                        {number.current = number.current + 1}
                                    </TableCell>
                                    
                                </TableRow>
                            )
                            })
                        })  

                    }
                    </TableBody>
                </Table>
                </TableContainer>
                
                }
            </Box>

            {/* Stok, status, minimal, harga */}
            <Box sx={{ mt: 2, boxShadow: 2, p:2, midWidth: 600 }}>
                <Typography variant="h6" color="initial">
                    Informasi Tambahan
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                {variantCount.filter(x => x === 'i').length === 0 &&
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <TextField
                        sx={{ mt: 2 }}
                        required
                        size='small' name="stok" value={form.stok} onChange={onChange} label="Stock Product" variant="outlined"
                        helperText={typeof errors?.stock !== 'undefined' ? <span style={{color: 'red'}}>{errors.stock[0]}</span> : ''}
                        error={typeof errors?.stock !== 'undefined' ? true : false} 
                    />
                    <TextField
                        sx={{ mt: 2 }}
                        required
                        size='small' name="harga" value={form.harga} onChange={onChange} label="Harga Product" variant="outlined"
                        helperText={typeof errors?.price !== 'undefined' ? <span style={{color: 'red'}}>{errors.price[0]}</span> : ''}
                        error={typeof errors?.price !== 'undefined' ? true : false}  
                    />
                    <FormGroup sx={{ ml: 2 }}>
                    <FormControlLabel 
                        control={
                            <Switch
                                name='status'
                                checked={form.status === 'not_active' ? false : true}
                                onChange={formStatusChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        } 
                        label="Status Produk" />
                    </FormGroup> 
                </Box>
                }
                <TextField
                    sx={{ mt: 2 }}
                    required
                    size='small' name="minimal_order" value={form.minimal_order} onChange={onChange} label="Minimal Order" variant="outlined"
                    helperText={typeof errors?.minimum_order !== 'undefined' ? <span style={{color: 'red'}}>{errors.minimum_order[0]}</span> : ''}
                    error={typeof errors?.minimum_order !== 'undefined' ? true : false}  
                />
                
                </Box>  
                    
            </Box>
            
            {/* Ukuran dan Berat */}
            <Box component="div" sx={{ mt: 2, boxShadow: 2, p:2, minWidth:600 }}>
                <Typography variant="h6" color="initial">
                Ukuran Dan Berat Product
                </Typography>

                {/* Berat */}
                <Box sx={{ display: 'flex' }}>
                <FormControl sx={{
                    mt: 1,
                    width: '50%'
                    }}  
                    variant="standard"
                    
                >
                    <InputLabel id={`id-kategori`}>
                        Berat
                    </InputLabel>
                    <Select
                        value={beratUkuran.berat === null ? '' : beratUkuran.berat}
                        name='berat'
                        size='small'
                        labelId={`id-kategori`}
                        onChange={beratUkuranChange}
                        >
                        <MenuItem value={'gram'}>
                            gram (g)
                        </MenuItem>
                        <MenuItem value={'kg'}>
                            kilogram (kg)
                        </MenuItem>
                    </Select>
                    <FormHelperText sx={{ml: 2}}></FormHelperText>
                </FormControl>
                {beratUkuran.berat !== null && 
                    <TextField sx={{ml: 3, mt: 2, width: '45.5%'}}
                        required 
                        size='small' 
                        name="berat" 
                        value={form.berat} 
                        onChange={onChange} 
                        label="Berat" variant="outlined" 
                        helperText={typeof errors?.product_weight !== 'undefined' ? <span style={{color: 'red'}}>{errors.product_weight[0]}</span> : ''}
                        error={typeof errors?.product_weight !== 'undefined' ? true : false}
                    
                    />
                }
                </Box>
                
                {/* Ukuran */}
                <Box sx={{ display: 'flex' }}>
                <FormControl sx={{
                    mt: 1,
                    width: `50%`
                }}  
                    variant="standard"
                    
                >
                    <InputLabel id={`id-kategori`}>
                        Ukuran
                    </InputLabel>
                    <Select
                        value={beratUkuran.ukuran === null ? '' : beratUkuran.ukuran}
                        name='ukuran'
                        size='small'
                        labelId={`id-kategori`}
                        onChange={beratUkuranChange}
                        >
                        <MenuItem value={'cm'}>
                            centimeter (cm)
                        </MenuItem>
                        <MenuItem value={'m'}>
                            meter (m)
                        </MenuItem>
                    </Select>
                    <FormHelperText sx={{ml: 2}}></FormHelperText>
                </FormControl>
                {beratUkuran.ukuran !== null && 
                    <Box sx={{ width: '50%' }}>
                    <TextField sx={{ml: 3, mt: 2}}
                        required 
                        size='small' 
                        name="panjang" 
                        value={form.panjang} 
                        onChange={onChange} 
                        label="Panjang" variant="outlined"
                        helperText={typeof errors?.length !== 'undefined' ? <span style={{color: 'red'}}>{errors.length[0]}</span> : ''}
                        error={typeof errors?.length !== 'undefined' ? true : false}
                    />
                    <TextField sx={{ml: 3, mt: 2}}
                        required 
                        size='small' 
                        name="tinggi" 
                        value={form.tinggi} 
                        onChange={onChange} 
                        label="Tinggi" variant="outlined"
                        helperText={typeof errors?.height !== 'undefined' ? <span style={{color: 'red'}}>{errors.height[0]}</span> : ''}
                        error={typeof errors?.height !== 'undefined' ? true : false}
                    />
                    </Box>
                }
                </Box>


            </Box>

            {/* SizePack */}
            {size.length !== 0 &&
            <Box component="div" sx={{ mt: 2, boxShadow: 2, p: 2, minWidth:600 }}>
                <Typography variant="h6" color="initial">
                    Size Pack
                </Typography>
                <FormControl sx={{
                    mt: 1,
                    width: `100%`
                }}  
                    variant="standard"
                    
                >
                    <InputLabel id={`id-sizePack`}>
                        Size Pack
                    </InputLabel>
                    <Select
                        value={form.sizePack}
                        name='sizePack'
                        size='small'
                        labelId={`id-sizePack`}
                        onChange={onChange}
                        >
                    {size.map(val => {
                        return (
                            <MenuItem key={val.id} value={val.name}>
                                {val.name}
                            </MenuItem>
                        )
                    })}    
                    </Select>
                    <FormHelperText sx={{ml: 2}}></FormHelperText>
                </FormControl>
            </Box>
            }

            {/* Deskripsi */}
            <Box component="div" sx={{ mt:2, boxShadow: 2, p:2, minWidth: 600 }}>
                <Typography variant="h6" color="initial">
                Deskripsi Produk
                </Typography>
                <CKEditor
                    editor={ ClassicEditor }
                    data={form.ckEditor}
                    onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    // console.log("Editor is ready to use!", editor);
                    editor.editing.view.change((writer) => {
                    writer.setStyle(
                        "height",
                        "350px",
                        editor.editing.view.document.getRoot()
                    );
                    });
                }}
                    onChange={ckEditorChange}
                />
            </Box>

            {/* Discount */}
          <Box component="div" sx={{ mt: 2, boxShadow: 2, p:2, minWidth: 600 }}>
              <Typography variant="h6">
                Discount
              </Typography>
              <Box sx={{ display: 'flex' }} >
                <FormGroup 
                  sx={{ ml: 2 }}>
                    <FormControlLabel 
                      control={
                        <Switch
                            name='status'
                            checked={discountCheck}
                            onChange={discountChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                      } 
                      label="Aktifkan Pre-Order Jika Diperlukan" 
                    />
                </FormGroup>
              </Box>

              {discountCheck && 
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                minWidth: 600
               }}>
                <FormControl 
                      variant="standard" 
                      fullWidth 
                      sx={{ my: 2 }}
                      error={typeof errors?.discount_type !== 'undefined' ? true : false}
                  >
                      <InputLabel id={`id-type`}>
                          Type
                      </InputLabel>
                      <Select
                          size='small'
                          value={form.discount_type}
                          name={'discount_type'} 
                          labelId={`id-type`}
                          onChange={onChange}
                      >
                          <MenuItem value="">
                              None
                          </MenuItem>
                          <MenuItem value="rp">
                              Rupiah
                          </MenuItem>
                          <MenuItem value="percent">
                              Percent
                          </MenuItem>
                      </Select>
                      <FormHelperText sx={{ ml: 2 }}>{typeof errors?.discount_type !== 'undefined' ? errors.discount_type[0] : ``}</FormHelperText>
                  </FormControl>

                  {form.discount_type === 'rp' &&
                      <CurrencyFormat 
                          customInput={
                              TextField
                          }
                          label={`Nilai Diskon`}
                          size="small"
                          required
                          value={form.diskon} 
                          thousandSeparator={"."} 
                          decimalSeparator={","}
                          prefix={'Rp'}
                          onValueChange={(val => {
                              setForm({
                                  ...form,
                                  diskon: val.value
                              })
                          })}
                      /> 
                  }
                  {form.discount_type === 'percent' &&
                  <TextField
                      sx={{ my: 2 }}
                      variant="outlined"
                      size='small'
                      fullWidth
                      label={`Nilai Diskon`}
                      name='diskon'
                      onChange={onChange}
                      value={form.diskon}
                      required 
                      helperText={typeof errors?.discount !== 'undefined' ? <span style={{color: 'red'}}>{errors.discount[0]}</span> : ''}
                      error={typeof errors?.discount !== 'undefined' ? true : false}
                  />
                  }

              </Box>
              
              }
          </Box>   

            {/* Pre-Order */}
            <Box component="div" sx={{ mt: 2, boxShadow: 2, p:2, minWidth: 600 }}>
                <Typography variant="h6">
                    Pre-Order
                </Typography>
                <Box sx={{ display: 'flex' }} >
                    <FormGroup 
                    sx={{ ml: 2 }}>
                        <FormControlLabel 
                        control={
                            <Switch
                                name='status'
                                checked={check}
                                onChange={checkChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        } 
                        label="Aktifkan Pre-Order Jika Diperlukan" 
                        />
                    </FormGroup>
                </Box>

                {check && 
                <Box sx={{ 
                    display: 'flex',
                    minWidth: 600
                }}>
                    <TextField
                        required
                        sx={{ mr: 2, mt: 2, minWidth: 400 }} 
                        size='small' 
                        name="preorder" value={form.preorder} onChange={onChange} label="Pre-Order" variant="outlined"
                        helperText={typeof errors?.duration !== 'undefined' ? <span style={{color: 'red'}}>{errors.duration[0]}</span> : ''}
                        error={typeof errors?.duration !== 'undefined' ? true : false}
                    />

                    <FormControl sx={{
                        mt: 2
                    }}  
                    variant="standard"
                    
                    >
                        <InputLabel id={`id-kategori`}>
                        Satuan
                        </InputLabel>
                        <Select
                            value={satuanPreorder}
                            name='ukuran'
                            size='small'
                            labelId={`id-kategori`}
                            onChange={satuanPreorderChange}
                            >
                            <MenuItem value={'day'}>
                            day
                            </MenuItem>
                            <MenuItem value={'week'}>
                            week
                            </MenuItem>
                        </Select>
                        <FormHelperText sx={{ml: 2}}></FormHelperText>
                    </FormControl>

                </Box>
                
                }
            </Box>
            
            {/* Button */}
            <LoadingButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{mt: 2,borderRadius: 25, minWidth: 100 }}
                    loading={loading}
                >
                    Simpan
            </LoadingButton>
        </Box>
        }
        {form.nama === null &&
        <Box component='div' sx={{ mt: 2 }} >
            <CircularProgress size={30}/>
        </Box>
        }
        </div>
    )

};

export default EditProduct;