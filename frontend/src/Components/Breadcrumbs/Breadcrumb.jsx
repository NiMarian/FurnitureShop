import React from 'react';
import './Breadcrumb.css';
import { useNavigate } from 'react-router-dom';
import arrow_icon from '../Assets/breadcrumb_arrow.png';

const Breadcrumb = (props) => {
    const { product } = props;
    const navigate = useNavigate();

    const navigateToHome = () => {
        navigate('/');
    };

    const navigateToCategory = () => {
        navigate(`/${product.category}`);
    };

    const navigateToProduct = () => {
        navigate(`/produse/${product.id}`);
    };

    return (
        <div className='breadcrumb'>
            <span onClick={navigateToHome}>Acasă</span> 
            <img src={arrow_icon} alt="" /> 
            <span onClick={navigateToCategory}>{product.category}</span> 
            <img src={arrow_icon} alt="" /> 
            <span onClick={navigateToProduct}>{product.name}</span>
        </div>
    );
};

export default Breadcrumb;
