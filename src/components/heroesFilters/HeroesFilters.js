import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { changeActiveFilter, fetchFilters, selectAll } from "./filtersSlice";
import store from "../../store";

import Spinner from '../spinner/Spinner'

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {

    const {activeFilter, filtersLoadingStatus} = useSelector(state => state.filters)
    const filters = selectAll(store.getState())
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchFilters())
            // eslint-disable-next-line
    }, [])

    if (filtersLoadingStatus === 'loading') {
        return <Spinner/>
    } else if (filtersLoadingStatus === 'error') {
        return <h5 className="text-center mt-5">Loading error</h5>
    }

    const renderFiltersList = arr => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">No filters yet</h5>
        }

        return arr.map(({name, text, className}) => {
            return <button 
                        key={name} 
                        id={name}
                        className={`btn btn-${className} ${name === activeFilter ? 'active' : null}`}
                        value={name}
                        onClick={() => dispatch(changeActiveFilter(name))}>
                    {text}
                    </button>
        })
    }

    const filtersList = renderFiltersList(filters)
        
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {filtersList}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;