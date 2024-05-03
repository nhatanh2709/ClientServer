import React, { useCallback, useEffect, useState } from 'react'

import './movie-gird.scss'
import MovieCard from '../movie-card/MovieCard'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Input from '../input/Input'
import Button from '../button/Button'
import axios from 'axios'


const MovieGird = props => {
    const options = [
        { label: "Genre", value: "" },
        { label: "Adventure", value: "Adventure" },
        { label: "Comedy", value: "Comedy" },
    ]
    // const data = props.movies
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [genre, setGenre] = useState(null);
    const [isSearch , setIsSearch] = useState(null);
    const {keyword} = useParams();
    const {category} = useParams();
    const {type} = useParams();
    useEffect(() => {
        const getMovies = async () => {
            if(keyword === undefined) {
                try {
                    setMovies(props.movies);
                    setIsSearch(true);
                } catch (err) {
                    console.log(err)
                }
            }
            else {
                try {
                    const res = await axios.post("https://pythonserver-6.onrender.com/api/movies/similar-movies", {
                        movies : props.movies,
                        movie_title : keyword
                    })
                    setMovies(res.data);
                    setIsSearch(false);
                } catch (err) {
                    console.log(err)
                }
            }
        }
        if(props.movies.length !== 0) getMovies();
    },[props.movies,keyword])

    const handleSearch = () => {
        const url = `/${category}/${genre}`;
        navigate(url);
    }
    
    return (
        <>
            <div className='between'>

                <div className='section mb-3'>
                    <span>{category === "Movies" ? "Movies Type" : "Series Type"}</span>
                    <select
                        name='genre'
                        id="genre"
                        onChange={(e) => setGenre(e.target.value)}
                        onClick={() => handleSearch()}
                    >
                        {
                            options.map(option => (
                                <option value={option.value}>{option.label}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='section mb-3'>
                    <MovieSearch category={category} keyword={keyword} />
                </div>
            </div>
            <div className='movie-grid'>
               
                {
                    isSearch === true && movies.length !== 0  && movies.map((item) =>
                        <MovieCard id={item._id} />
                )}
                {
                    isSearch === false && movies.length !==0 && movies._id.map((item) => 
                        <MovieCard id={item}/>
                )
                }
            </div>

        </>
    )
}


const MovieSearch = props => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState(props.keyword ? props.keyword : '')
    const pathName = props.category;
    
    const goToSearch = useCallback(
        () => {
            if (keyword.trim().length > 0) {
                navigate(`/${pathName}/search/${keyword}`);
            }
        },
        [keyword, pathName, navigate]
    )

    useEffect(() => {
        const enterEvent = (e) => {
            e.preventDefault();
            if (e.keyCode === 13) {
                goToSearch()
            }
        }
        document.addEventListener('keyup', enterEvent);
        return () => {
            document.removeEventListener('keyup', enterEvent);
        }
    }, [keyword, goToSearch])

    return (
        <div className='movie-search'>
            <Input
                type="text"
                placeholder="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <Button className="small" onClick={goToSearch}>Search</Button>
        </div>
    )
}
export default MovieGird
