import React, { useState, useEffect } from 'react';
import './DescriptionBox.css';

const DescriptionBox = ({ productId, userId, userName }) => {
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        console.log('Product ID in DescriptionBox:', productId);
        if (!productId) {
            console.error('ProductId este undefined');
            return;
        }
    
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:4000/reviews/${productId}`);
                const data = await response.json();
                if (data.success) {
                    setReviews(data.reviews);
                } else {
                    console.error('Eroare la preluarea recenziilor:', data.message);
                }
            } catch (error) {
                console.error('Eroare la preluarea recenziilor:', error);
            }
        };
    
        fetchReviews();
    }, [productId]);
    

    const handleReviewSubmit = async (event) => {
        event.preventDefault();
        if (reviewText.trim() === '') {
            alert('Te rog să scrii o recenzie validă.');
            return;
        }
    
        const newReview = {
            productId,
            userId,
            userName,
            text: reviewText
        };
    
        console.log(newReview);
    
        try {
            const response = await fetch('http://localhost:4000/addreview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReview)
            });
            const data = await response.json();
            if (data.success) {
                setReviews([...reviews, newReview]);
                setReviewText('');
            } else {
                alert('Eroare la adăugarea recenziei');
            }
        } catch (error) {
            console.error('Eroare la adăugarea recenziei:', error);
        }
    };
    

    return (
        <div className='descriptionbox'>
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box fade">Recenzii ({reviews.length})</div>
            </div>
            <div className="descriptionbox-description">
                {reviews.map((review, index) => (
                    <p key={index}><strong>{review.userName}:</strong> {review.text}</p>
                ))}
            </div>
            <form onSubmit={handleReviewSubmit} className="descriptionbox-review-form">
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Adaugă o recenzie..."
                    required
                />
                <button type="submit">Adaugă recenzie</button>
            </form>
        </div>
    );
};

export default DescriptionBox;
