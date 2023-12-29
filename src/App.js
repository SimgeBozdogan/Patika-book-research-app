import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import './App.css';

const BookDescription = ({ htmlContent }) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlContent);

  return <>Açıklama: <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} /></> ;
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // API'den gelen kitapları ayarladığım yer
    setBooks(data.items || []);
  };

  const handleDetails = async (bookId) => {
    // Seçilen kitabın detaylarını aldığım yer
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Detayları modal içinde gösterdiğim yer
    setSelectedBook(data);
  };

  return (
    <div className="App">
      <h1>Book Research Using React</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Book Title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img
              src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192'}
              alt={book.volumeInfo.title}
            />
            <div>
              <h3>{book.volumeInfo.title}</h3>
              <p>{book.volumeInfo.authors?.join(', ')}</p>
              <button onClick={() => handleDetails(book.id)}>Details</button>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedBook.volumeInfo.title}</h2>
            <p>Sayfa Sayısı: {selectedBook.volumeInfo.pageCount}</p>
            <p>Yayın Tarihi: {selectedBook.volumeInfo.publishedDate}</p>
            {/* Kitap açıklamasını BookDescription bileşeni üzerinden gönder */}
            <BookDescription htmlContent={selectedBook.volumeInfo.description} />
            <button onClick={() => setSelectedBook(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
