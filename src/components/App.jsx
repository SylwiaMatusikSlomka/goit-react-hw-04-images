import SearchBar from './Searchbar';
import Button from './Button';
import { fetchPhotos, PER_PAGE } from '../ImagesAPI/pixabayApi';
import { useEffect, useState } from 'react';
import Loader from './Leader';
import ImagesGallery from './Imagegallery';

export const App = () => {
  const [images, setImages] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const getData = event => {
    event.preventDefault();
    const searchWord = event.target.search.value;
    if (searchWord !== searchValue) {
      setSearchValue(searchWord);
      setCurrentPage(1);
      setImages([]);
    }
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchData();
    }
  }, [searchValue, currentPage, isMounted]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const object = await fetchPhotos(searchValue, currentPage);
      const newImages = object.hits;
      const imagesTotal = Math.ceil(object.totalHits / PER_PAGE);

      setImages([...images, ...newImages]);
      setTotalPages(imagesTotal);
      setIsLoading(false);
    } catch (error) {
      setErrors(errors);
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <SearchBar getData={getData} />
      {images.length !== 0 && <ImagesGallery images={images} />}
      {isLoading ? <Loader /> : true}
      {images.length !== 0 && currentPage !== totalPages && (
        <Button nextPage={nextPage} />
      )}
    </div>
  );
};

export default App;

