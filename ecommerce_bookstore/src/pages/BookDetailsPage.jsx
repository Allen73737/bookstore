import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!book) return <p>Loading book details...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{book.title}</h2>
      <img
        src={book.imageUrl}
        alt={book.title}
        style={{ width: "200px", height: "auto" }}
      />
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Category:</strong> {book.category}</p>
      <p><strong>Description:</strong> {book.description}</p>
      <p><strong>Price:</strong> ${book.price}</p>
      <button>Add to Cart</button>
    </div>
  );
};

export default BookDetailsPage;
